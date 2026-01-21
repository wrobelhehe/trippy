"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function UploadDropzone({
  tripId,
  momentId,
  onUploaded,
}: {
  tripId?: string;
  momentId?: string;
  onUploaded?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const uploadResponse = await fetch("/api/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!uploadResponse.ok) {
        const payload = await uploadResponse.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to start upload.");
      }

      const uploadPayload = (await uploadResponse.json()) as {
        uploadUrl: string;
        path: string;
      };

      const putResponse = await fetch(uploadPayload.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!putResponse.ok) {
        throw new Error("Upload failed.");
      }

      const completeResponse = await fetch("/api/media/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storagePath: uploadPayload.path,
          mediaType: file.type.startsWith("video") ? "video" : "image",
          sizeBytes: file.size,
          tripId,
          momentId,
        }),
      });

      if (!completeResponse.ok) {
        const payload = await completeResponse.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to finalize upload.");
      }

      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleUpload(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-5 text-sm text-muted-foreground">
        <div>
          <p className="text-foreground">Drop media or browse files.</p>
          <p className="text-xs">Photos and short videos keep the story alive.</p>
        </div>
        <Button asChild disabled={loading}>
          <label>
            {loading ? "Uploading..." : "Upload"}
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleChange}
              disabled={loading}
            />
          </label>
        </Button>
      </div>
    </div>
  );
}