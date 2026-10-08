import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useToast } from "../context/ToastContext";
import { useMediaUpload } from "./useMediaUpload";
import { storage } from "../services/storage";
import { journeyService, toMedia, validateJourney } from "../services/journeys";
import { isAbort, localDate, messageOf } from "../services/utils";
import type {
  JourneyInput,
  ProcessingStage,
  SelectedFile,
  UploadDraftRecord,
} from "../types";
const blank = (): JourneyInput => ({
  title: "",
  location: "",
  date: localDate(),
  notes: "",
  tags: [],
});
export function useUploadForm(editId?: string) {
  const library = useLibrary();
  const { notify } = useToast();
  const navigate = useNavigate();
  const media = useMediaUpload();
  const { restore } = media;
  const existing = library.journeys.find((item) => item.id === editId);
  const [input, setInput] = useState<JourneyInput>(blank);
  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [error, setError] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const initialized = useRef(false);
  const submitted = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const snapshot = useRef<{
    input: JourneyInput;
    files: SelectedFile[];
    ready: boolean;
  }>({ input, files: [], ready: false });
  const ownerId = library.ownerId;
  const persist = useCallback(
    (values: JourneyInput, files: SelectedFile[]) => {
      if (!values.title.trim() && !values.notes.trim() && !files.length)
        return queue.current;
      const record: UploadDraftRecord = {
        id: ownerId,
        ownerId,
        input: values,
        media: toMedia(files, "draft:" + ownerId, values),
        updatedAt: new Date().toISOString(),
      };
      queue.current = queue.current
        .catch(() => undefined)
        .then(async () => {
          await storage.saveDraft(record);
        });
      return queue.current;
    },
    [ownerId],
  );
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controller.current?.abort();
      const current = snapshot.current;
      if (!editId && !submitted.current && current.ready)
        void persist(current.input, current.files).catch(() => undefined);
    };
  }, [editId, persist]);
  useEffect(() => {
    snapshot.current = { input, files: media.files, ready };
  }, [input, media.files, ready]);
  useEffect(() => {
    if (library.loading || initialized.current) return;
    if (editId && !existing) {
      setReady(true);
      return;
    }
    initialized.current = true;
    let active = true;
    let completed = false;
    const load = async () => {
      if (existing) {
        const files = await storage.media(existing.id, ownerId);
        if (!active) return;
        setInput({
          title: existing.title,
          location: existing.location,
          date: existing.date,
          notes: existing.notes,
          tags: existing.tags,
          coordinates: existing.coordinates,
        });
        restore(files);
      } else {
        const draft = await storage.draft(ownerId);
        if (!active) return;
        if (draft) {
          setInput(draft.input);
          restore(draft.media);
          setRestored(true);
          setDraftStatus("Đã khôi phục bản nháp");
        }
      }
      if (active) {
        completed = true;
        setReady(true);
      }
    };
    void load().catch((err: unknown) => {
      if (active) {
        initialized.current = false;
        setError(messageOf(err));
        setReady(true);
      }
    });
    return () => {
      active = false;
      if (!completed) initialized.current = false;
    };
  }, [library.loading, existing, editId, ownerId, restore]);
  useEffect(() => {
    if (!ready || busy || editId || submitted.current) return;
    const timer = setTimeout(() => {
      if (!input.title.trim() && !input.notes.trim() && !media.files.length)
        return;
      setDraftStatus("Đang lưu nháp…");
      void persist(input, media.files)
        .then(() => {
          if (mounted.current) setDraftStatus("Đã lưu nháp trên thiết bị");
        })
        .catch((err: unknown) => {
          if (mounted.current) setDraftStatus(messageOf(err));
        });
    }, 350);
    return () => clearTimeout(timer);
  }, [input, media.files, ready, busy, editId, persist]);
  const setField = <K extends keyof JourneyInput>(
    key: K,
    value: JourneyInput[K],
  ) => {
    setInput((current) => ({
      ...current,
      [key]: value,
      ...(key === "location" ? { coordinates: undefined } : {}),
    }));
    setError("");
  };
  const submit = async () => {
    if (busy || !ready) return;
    try {
      validateJourney(input, media.files.length);
    } catch (err) {
      setError(messageOf(err));
      return;
    }
    setBusy(true);
    setError("");
    submitted.current = true;
    const abort = new AbortController();
    controller.current = abort;
    try {
      if (!editId) await persist(input, media.files);
      await queue.current.catch(() => undefined);
      const journey = await journeyService.process(
        input,
        media.files,
        ownerId,
        (next) => {
          if (mounted.current) setStage(next);
        },
        abort.signal,
        existing,
      );
      library.commitJourney(journey);
      if (mounted.current) {
        notify(editId ? "Đã cập nhật chuyến đi" : "Đã lưu một ký ức mới");
        navigate("/journey/" + journey.id);
      }
    } catch (err) {
      submitted.current = false;
      if (mounted.current) {
        setStage("idle");
        if (!isAbort(err)) setError(messageOf(err));
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const discard = async () => {
    if (busy) return;
    submitted.current = true;
    try {
      await queue.current.catch(() => undefined);
      await storage.deleteDraft(ownerId);
      media.clear();
      setInput(blank());
      setRestored(false);
      setDraftStatus("");
    } catch (err) {
      setError(messageOf(err));
    } finally {
      submitted.current = false;
    }
  };
  return {
    input,
    setField,
    media,
    ready,
    restored,
    busy,
    stage,
    error,
    draftStatus,
    existing,
    submit,
    discard,
    cancel: () => controller.current?.abort(),
  };
}
