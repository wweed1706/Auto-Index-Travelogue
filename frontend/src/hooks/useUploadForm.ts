import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useToast } from "../context/ToastContext";
import { useMediaUpload } from "./useMediaUpload";
import { useJourney } from "./useJourney";
import { validateJourney } from "../services/journeys";
import { uploadMedia } from "../services/uploadService";
import { localDate, messageOf } from "../services/utils";
import type { JourneyInput, JourneyApiMedia, ProcessingStage } from "../types";

const blank = (): JourneyInput => ({
  title: "",
  location: null,
  date: localDate(),
  notes: "",
  tags: [],
});
const unsupportedEdit =
  "API chưa hỗ trợ chỉnh sửa chuyến đi. Thay đổi chưa được lưu.";

export function useUploadForm(editId?: string) {
  const library = useLibrary();
  const detail = useJourney(editId);
  const { notify } = useToast();
  const navigate = useNavigate();
  const media = useMediaUpload();
  const [input, setInput] = useState<JourneyInput>(blank);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [error, setError] = useState("");
  const saving = useRef(false);
  const uploaded = useRef(new Map<string, JourneyApiMedia>());
  const uploadController = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      uploadController.current?.abort();
    };
  }, []);
  useEffect(() => {
    const existing = detail.journey;
    if (existing)
      setInput({
        title: existing.title,
        location: existing.location,
        date: existing.date,
        notes: existing.notes,
        tags: existing.tags,
      });
  }, [detail.journey]);
  const setField = <K extends keyof JourneyInput>(
    key: K,
    value: JourneyInput[K],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const submit = async () => {
    if (saving.current) return;
    setError("");
    try {
      if (editId) throw new Error(unsupportedEdit);
      const payload: JourneyInput = {
        ...input,
        title: input.title.trim(),
        location: input.location
          ? { ...input.location, name: input.location.name.trim() }
          : null,
        notes: input.notes.trim(),
        tags: [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))],
      };
      validateJourney(payload, media.files.length);
      if (!payload.location) throw new Error("Vui lòng chọn một địa điểm từ danh sách gợi ý.");
      saving.current = true;
      setBusy(true);
      setStage("checking");
      const controller = new AbortController();
      uploadController.current = controller;
      const attachments: JourneyApiMedia[] = [];
      // Tải tuần tự để hạn chế bộ nhớ; giữ URL đã nhận khi cần thử lại.
      for (const selected of media.files) {
        if (controller.signal.aborted) throw new Error("Đã hủy tải media.");
        let attachment = uploaded.current.get(selected.id);
        if (!attachment) {
          const result = await uploadMedia(selected.file, controller.signal);
          attachment = {
            id: result.public_id,
            url: result.url,
            name: selected.name,
            kind: result.resource_type,
            mimeType: selected.type,
            sizeBytes: selected.file.size,
            tags: [],
          };
          uploaded.current.set(selected.id, attachment);
        }
        attachments.push(attachment);
      }
      if (controller.signal.aborted || !mounted.current)
        throw new Error("Đã hủy tải media.");
      uploadController.current = null;
      setStage("saving");
      const journey = await library.addJourney({
        ...payload,
        location: payload.location,
        coordinates: {
          latitude: payload.location.lat,
          longitude: payload.location.lng,
        },
        media: attachments,
      });
      if (mounted.current) {
        setStage("complete");
        notify("Đã lưu một ký ức mới");
        navigate("/journey/" + journey.id);
      }
    } catch (err) {
      if (mounted.current) {
        setError(uploadController.current?.signal.aborted ? "Đã hủy tải media." : messageOf(err));
        setStage("idle");
      }
    } finally {
      saving.current = false;
      uploadController.current = null;
      if (mounted.current) setBusy(false);
    }
  };
  return {
    input,
    setField,
    media,
    ready: !editId || !detail.loading,
    restored: false,
    busy,
    stage,
    error:
      error ||
      detail.error ||
      (editId ? unsupportedEdit : ""),
    draftStatus:
      "Bản nháp chỉ giữ trong trang đang mở; nhấn Lưu để gửi lên máy chủ.",
    existing: detail.journey,
    submit,
    discard: async () => {
      if (!saving.current) {
        media.clear();
        uploaded.current.clear();
        setInput(blank());
        setError("");
      }
    },
    cancel: () => {
      uploadController.current?.abort();
    },
  };
}
