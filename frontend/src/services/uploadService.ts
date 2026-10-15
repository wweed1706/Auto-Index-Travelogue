import { apiRequest } from "./api";

export interface UploadedMedia {
  url: string;
  public_id: string;
  resource_type: "image" | "video";
}

export function uploadMedia(file: File, signal?: AbortSignal): Promise<UploadedMedia> {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<UploadedMedia>("/upload", { method: "POST", body, signal }, 180000);
}
