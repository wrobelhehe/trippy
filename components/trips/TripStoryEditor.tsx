"use client";

import {
  type DragEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Eye,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Trip } from "@/lib/supabase/trips";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker, formatDateInputValue } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  TripStoryPresentation,
  type StoryEntry,
  type StoryMediaItem,
  type TripStoryPreset,
} from "@/components/trips/TripStoryPresentation";
import { TripLocationPicker } from "@/components/trips/TripLocationPicker";
import type { GlobePin } from "@/components/globe/GlobePins";

type DraftMedia = StoryMediaItem & {
  file?: File;
  existingId?: string;
};

type DraftEntry = StoryEntry & {
  isNew: boolean;
  media: DraftMedia[];
};

type MediaDropzoneProps = {
  title: string;
  helper: string;
  note?: string;
  accept: string;
  multiple?: boolean;
  compact?: boolean;
  containerId?: string;
  onFiles: (files: FileList | null) => void;
};

function MediaDropzone({
  title,
  helper,
  note,
  accept,
  multiple = true,
  compact = false,
  containerId,
  onFiles,
}: MediaDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current += 1;
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setDragActive(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current = 0;
    setDragActive(false);
    onFiles(event.dataTransfer.files);
  };

  return (
    <div
      id={containerId}
      tabIndex={-1}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "rounded-2xl border border-dashed transition",
        compact ? "px-4 py-4" : "px-5 py-5",
        dragActive
          ? "border-[color:var(--lagoon)]/70 bg-[color:var(--panel-2)]/90"
          : "border-white/10 bg-[color:var(--panel-3)]/70"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">
            {dragActive ? "Drop files to add them." : helper}
          </p>
          {note ? (
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {note}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          Browse files
        </Button>
      </div>
      <Input
        id={inputId}
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        aria-label={title}
        onChange={(event) => {
          onFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}

type TripStoryEditorProps = {
  mode?: "edit";
  trip: Trip;
  entries: StoryEntry[];
  backHref?: string;
} | {
  mode: "create";
  backHref?: string;
};

const PRESET_OPTIONS: Array<{
  value: TripStoryPreset;
  label: string;
  description: string;
}> = [
  {
    value: "postcards",
    label: "Postcards",
    description: "Postmarked scenes with handwritten notes and stamps.",
  },
  {
    value: "album",
    label: "Album",
    description: "Hardcover cover page with cinematic album spreads.",
  },
  {
    value: "carousel",
    label: "Carousel",
    description: "A motion reel of frames you can drag through.",
  },
  {
    value: "collage",
    label: "Collage",
    description: "Mood-board wall of layered memories.",
  },
];

const PREVIEW_TRIP = {
  title: "Amalfi Pages",
  city: "Positano",
  countryCode: "IT",
  startDate: "2024-06-06",
  endDate: "2024-06-12",
};

const PREVIEW_ENTRIES: StoryEntry[] = [
  {
    id: "preview-1",
    title: "Day 1",
    description:
      "We chased the sunrise down the cliffside, espresso in hand, salt on our hair.",
    media: [
      {
        id: "preview-1a",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "preview-1b",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    id: "preview-2",
    title: "Day 2",
    description:
      "Market day felt like a color storm — lemons, linen, and sea-glass alleys.",
    media: [
      {
        id: "preview-2a",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "preview-2b",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "preview-2c",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1500534314209-a3b6aef4f65f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    id: "preview-3",
    title: "Day 3",
    description:
      "Golden hour ended with a boat ride and a sky that felt like molten copper.",
    media: [
      {
        id: "preview-3a",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "preview-3b",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
];

const createDraftId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `new-${crypto.randomUUID()}`;
  }
  return `new-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const SUPPORTED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".mp4",
  ".webm",
]);
const SUPPORTED_LABEL = "JPG, PNG, WEBP, GIF, MP4, WEBM";

const getFileExtension = (file: File) => {
  const match = /\.([a-z0-9]+)$/i.exec(file.name);
  return match ? `.${match[1].toLowerCase()}` : "";
};

const isVideoFile = (file: File) => {
  if (file.type) return file.type.startsWith("video/");
  const extension = getFileExtension(file);
  return extension === ".mp4" || extension === ".webm";
};

const isSupportedFile = (file: File) => {
  if (SUPPORTED_IMAGE_TYPES.has(file.type) || SUPPORTED_VIDEO_TYPES.has(file.type)) {
    return true;
  }
  const extension = getFileExtension(file);
  return SUPPORTED_EXTENSIONS.has(extension);
};

const filterSupportedFiles = (files: FileList | null) => {
  const supported: File[] = [];
  const rejected: File[] = [];
  Array.from(files ?? []).forEach((file) => {
    if (isSupportedFile(file)) {
      supported.push(file);
    } else {
      rejected.push(file);
    }
  });
  return { supported, rejected };
};

async function buildDraftMedia(file: File): Promise<DraftMedia> {
  return {
    id: createDraftId(),
    mediaType: isVideoFile(file) ? "video" : "image",
    url: URL.createObjectURL(file),
    file,
  };
}

function parseDate(value: string | null) {
  if (!value) return undefined;
  return new Date(value);
}

const normalizePreset = (value?: string | null): TripStoryPreset => {
  if (!value) return "postcards";
  if (value === "cinematic" || value === "journal") return "postcards";
  if (value === "postcards") return "postcards";
  if (value === "album") return "album";
  if (value === "carousel") return "carousel";
  if (value === "collage") return "collage";
  return "postcards";
};

function buildPreviewEntries(entries: DraftEntry[]) {
  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title ?? "",
    description: entry.description,
    media: entry.media.map((media) => ({
      id: media.id,
      mediaType: media.mediaType,
      url: media.url,
    })),
  }));
}

type EditorStep = "essentials" | "story";
type ValidationResult = {
  message: string;
  step: EditorStep;
  focusId?: string;
} | null;

export function TripStoryEditor(props: TripStoryEditorProps) {
  const isCreate = props.mode === "create";
  let trip: Trip | null = null;
  let entries: StoryEntry[] = [];

  if ("trip" in props) {
    trip = props.trip;
    entries = props.entries;
  }

  const router = useRouter();
  const entriesRef = useRef<DraftEntry[]>([]);
  const [createdTripId, setCreatedTripId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<EditorStep>("essentials");
  const [title, setTitle] = useState(trip?.title ?? "");
  const [city, setCity] = useState(trip?.place_name ?? "");
  const [countryCode, setCountryCode] = useState<string | null>(
    trip?.country_code ?? null
  );
  const [lat, setLat] = useState<number | null>(trip?.lat ?? null);
  const [lng, setLng] = useState<number | null>(trip?.lng ?? null);
  const [startDate, setStartDate] = useState<Date | undefined>(
    parseDate(trip?.start_date ?? null)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    parseDate(trip?.end_date ?? null)
  );
  const [preset, setPreset] = useState<TripStoryPreset>(
    normalizePreset(trip?.story_preset)
  );
  const [draftEntries, setDraftEntries] = useState<DraftEntry[]>(
    entries.map((entry) => ({
      ...entry,
      title: entry.title ?? "",
      isNew: false,
      media: entry.media.map((media) => ({
        ...media,
        existingId: media.id,
      })),
    }))
  );
  const [removedEntryIds, setRemovedEntryIds] = useState<string[]>([]);
  const [removedMediaPairs, setRemovedMediaPairs] = useState<
    Array<{ momentId: string; mediaId: string }>
  >([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formatWarning, setFormatWarning] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [presetPreview, setPresetPreview] = useState<TripStoryPreset | null>(
    null
  );
  const [titleError, setTitleError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [missingDescriptionIds, setMissingDescriptionIds] = useState<string[]>(
    []
  );
  const [missingMediaIds, setMissingMediaIds] = useState<string[]>([]);
  const activeTripId = trip?.id ?? createdTripId ?? null;
  const backHref = props.backHref ?? (isCreate ? "/trips" : `/trips/${trip?.id}`);
  const backLabel = isCreate ? "Back to trips" : "Back to trip";
  const saveLabel = isCreate ? "Create trip" : "Save changes";
  const savingLabel = isCreate ? "Creating..." : "Saving...";
  const markDirty = useCallback(() => {
    setDirty(true);
    setSuccess(false);
    setError(null);
  }, []);
  const handleLocationChange = useCallback(
    (next: { city: string; countryCode: string | null; lat: number | null; lng: number | null }) => {
      setCity(next.city);
      setCountryCode(next.countryCode);
      setLat(next.lat);
      setLng(next.lng);
      if (locationError) {
        setLocationError(null);
      }
      markDirty();
    },
    [locationError, markDirty]
  );

  useEffect(() => {
    entriesRef.current = draftEntries;
  }, [draftEntries]);

  useEffect(() => {
    return () => {
      entriesRef.current.forEach((entry) => {
        entry.media.forEach((media) => {
          if (media.file && media.url) {
            URL.revokeObjectURL(media.url);
          }
        });
      });
    };
  }, []);

  useEffect(() => {
    if (dirty || saving) return;
    if (isCreate) return;
    setDraftEntries(
      entries.map((entry) => ({
        ...entry,
        title: entry.title ?? "",
        isNew: false,
        media: entry.media.map((media) => ({
          ...media,
          existingId: media.id,
        })),
      }))
    );
    setRemovedEntryIds([]);
    setRemovedMediaPairs([]);
  }, [dirty, entries, isCreate, saving]);

  const pins = useMemo<GlobePin[]>(() => {
    if (lat === null || lng === null) return [];
    return [
      {
        id: activeTripId ?? "draft",
        lat,
        lng,
        title,
        placeName: city,
        momentsCount: draftEntries.length,
        mediaCount: draftEntries.reduce(
          (sum, entry) => sum + entry.media.length,
          0
        ),
      },
    ];
  }, [activeTripId, city, draftEntries, lat, lng, title]);

  const previewEntries = useMemo(
    () => buildPreviewEntries(draftEntries),
    [draftEntries]
  );

  const addMediaToEntry = async (entryId: string, files: FileList | null) => {
    if (!files?.length) return;
    const { supported, rejected } = filterSupportedFiles(files);
    if (rejected.length) {
      setFormatWarning(
        `Unsupported files: ${rejected.map((file) => file.name).join(", ")}. Use ${SUPPORTED_LABEL}.`
      );
    } else {
      setFormatWarning(null);
    }
    if (!supported.length) return;
    const nextMedia = await Promise.all(
      supported.map((file) => buildDraftMedia(file))
    );
    setDraftEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? { ...entry, media: [...entry.media, ...nextMedia] }
          : entry
      )
    );
    if (missingMediaIds.includes(entryId)) {
      setMissingMediaIds((prev) => prev.filter((id) => id !== entryId));
    }
    markDirty();
  };

  const addEntriesFromFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const { supported, rejected } = filterSupportedFiles(files);
    if (rejected.length) {
      setFormatWarning(
        `Unsupported files: ${rejected.map((file) => file.name).join(", ")}. Use ${SUPPORTED_LABEL}.`
      );
    } else {
      setFormatWarning(null);
    }
    if (!supported.length) return;
    const nextEntries = await Promise.all(
      supported.map(async (file) => ({
        id: createDraftId(),
        title: "",
        description: "",
        media: [await buildDraftMedia(file)],
        isNew: true,
      }))
    );
    setDraftEntries((prev) => [...prev, ...nextEntries]);
    markDirty();
  };

  const removeMedia = (entryId: string, mediaId: string) => {
    setDraftEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const media = entry.media.find((item) => item.id === mediaId);
        if (media?.file && media.url) {
          URL.revokeObjectURL(media.url);
        }
        if (media?.existingId) {
          setRemovedMediaPairs((current) => [
            ...current,
            { momentId: entryId, mediaId: media.existingId as string },
          ]);
        }
        return {
          ...entry,
          media: entry.media.filter((item) => item.id !== mediaId),
        };
      })
    );
    markDirty();
  };

  const moveMedia = (
    entryId: string,
    mediaId: string,
    direction: "up" | "down"
  ) => {
    setDraftEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const index = entry.media.findIndex((item) => item.id === mediaId);
        if (index === -1) return entry;
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= entry.media.length) return entry;
        const nextMedia = [...entry.media];
        const [moved] = nextMedia.splice(index, 1);
        nextMedia.splice(nextIndex, 0, moved);
        return { ...entry, media: nextMedia };
      })
    );
    markDirty();
  };

  const removeEntry = (entryId: string) => {
    setDraftEntries((prev) => {
      const entry = prev.find((item) => item.id === entryId);
      if (entry) {
        entry.media.forEach((media) => {
          if (media.file && media.url) {
            URL.revokeObjectURL(media.url);
          }
        });
      }
      return prev.filter((item) => item.id !== entryId);
    });
    setMissingDescriptionIds((prev) => prev.filter((id) => id !== entryId));
    setMissingMediaIds((prev) => prev.filter((id) => id !== entryId));
    if (!entryId.startsWith("new-")) {
      setRemovedEntryIds((prev) => [...prev, entryId]);
    }
    markDirty();
  };

  const moveEntry = (entryId: string, direction: "up" | "down") => {
    setDraftEntries((prev) => {
      const index = prev.findIndex((entry) => entry.id === entryId);
      if (index === -1) return prev;
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
    markDirty();
  };

  const updateEntryDescription = (entryId: string, value: string) => {
    setDraftEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, description: value } : entry
      )
    );
    if (missingDescriptionIds.includes(entryId) && value.trim()) {
      setMissingDescriptionIds((prev) => prev.filter((id) => id !== entryId));
    }
    markDirty();
  };

  const updateEntryTitle = (entryId: string, value: string) => {
    setDraftEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, title: value } : entry
      )
    );
    markDirty();
  };

  const handleStepChange = (nextStep: EditorStep) => {
    setActiveStep(nextStep);
  };

  const focusField = useCallback((focusId?: string) => {
    if (!focusId || typeof document === "undefined") return;
    const element = document.getElementById(focusId);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    if ("focus" in element) {
      (element as HTMLElement).focus();
    }
  }, []);

  const runValidation = useCallback<() => ValidationResult>(() => {
    const titleMissing = !title.trim();
    const locationMissing = !city.trim() || !countryCode;
    const missingDescriptions = draftEntries
      .filter((entry) => !entry.description.trim())
      .map((entry) => entry.id);
    const missingMedia = draftEntries
      .filter((entry) => entry.media.length === 0)
      .map((entry) => entry.id);

    setTitleError(titleMissing ? "Trip name is required." : null);
    setLocationError(
      locationMissing ? "Pick a city from the search results." : null
    );
    setMissingDescriptionIds(missingDescriptions);
    setMissingMediaIds(missingMedia);

    if (titleMissing) {
      return {
        message: "Trip name is required.",
        step: "essentials",
        focusId: "tripTitle",
      };
    }
    if (locationMissing) {
      return {
        message: "Pick a city from the search results.",
        step: "essentials",
        focusId: "tripLocation",
      };
    }
    if (draftEntries.length === 0) {
      return {
        message: "Add at least one story entry.",
        step: "story",
        focusId: "addMedia",
      };
    }
    if (missingDescriptions.length) {
      return {
        message: "Every story entry needs a description.",
        step: "story",
        focusId: `entry-${missingDescriptions[0]}`,
      };
    }
    if (missingMedia.length) {
      return {
        message: "Each entry needs at least one media item.",
        step: "story",
        focusId: `entry-media-${missingMedia[0]}`,
      };
    }

    return null;
  }, [city, countryCode, draftEntries, title]);

  const uploadMedia = async (
    file: File,
    momentId: string,
    orderIndex: number
  ) => {
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
      headers: { "Content-Type": file.type },
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
        momentId,
        orderIndex,
      }),
    });

    if (!completeResponse.ok) {
      const payload = await completeResponse.json().catch(() => null);
      throw new Error(payload?.error ?? "Unable to finalize upload.");
    }
  };

  const updateMediaOrder = async (
    momentId: string,
    mediaId: string,
    orderIndex: number
  ) => {
    const response = await fetch(`/api/moments/${momentId}/media/${mediaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIndex }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error ?? "Unable to update media order.");
    }
  };

  const handleSave = async () => {
    const validation = runValidation();
    if (validation) {
      setError(validation.message);
      setActiveStep(validation.step);
      setTimeout(() => focusField(validation.focusId), 0);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      let tripId = activeTripId;
      let createdNow = false;

      if (!tripId) {
        const tripResponse = await fetch("/api/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            placeName: city.trim(),
            startDate: startDate ? formatDateInputValue(startDate) : null,
            endDate: endDate ? formatDateInputValue(endDate) : null,
            countryCode,
            lat,
            lng,
            storyPreset: preset,
          }),
        });

        if (!tripResponse.ok) {
          const payload = await tripResponse.json().catch(() => null);
          throw new Error(payload?.error ?? "Unable to create trip.");
        }

        const created = (await tripResponse.json()) as { id: string };
        tripId = created.id;
        createdNow = true;
        setCreatedTripId(created.id);
      }

      if (!createdNow) {
        const tripResponse = await fetch(`/api/trips/${tripId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            placeName: city.trim(),
            startDate: startDate ? formatDateInputValue(startDate) : null,
            endDate: endDate ? formatDateInputValue(endDate) : null,
            countryCode,
            lat,
            lng,
            storyPreset: preset,
          }),
        });

        if (!tripResponse.ok) {
          const payload = await tripResponse.json().catch(() => null);
          throw new Error(payload?.error ?? "Unable to save trip details.");
        }
      }

      if (!tripId) {
        throw new Error("Trip could not be created.");
      }

      for (const entryId of removedEntryIds) {
        await fetch(`/api/moments/${entryId}`, { method: "DELETE" });
      }

      for (const removed of removedMediaPairs) {
        await fetch(
          `/api/moments/${removed.momentId}/media/${removed.mediaId}`,
          { method: "DELETE" }
        );
      }

      for (let index = 0; index < draftEntries.length; index += 1) {
        const entry = draftEntries[index];
        if (entry.id.startsWith("new-")) {
          const createResponse = await fetch(`/api/trips/${tripId}/moments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: entry.title?.trim() || null,
              contentText: entry.description.trim(),
              orderIndex: index,
            }),
          });

          if (!createResponse.ok) {
            const payload = await createResponse.json().catch(() => null);
            throw new Error(payload?.error ?? "Unable to create story entry.");
          }

          const created = (await createResponse.json()) as { id: string };
          await Promise.all(
            entry.media.map((media, mediaIndex) =>
              media.file
                ? uploadMedia(media.file, created.id, mediaIndex)
                : null
            )
          );
        } else {
          await fetch(`/api/moments/${entry.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: entry.title?.trim() || null,
              contentText: entry.description.trim(),
              orderIndex: index,
            }),
          });

          await Promise.all(
            entry.media.map((media, mediaIndex) => {
              if (media.file) {
                return uploadMedia(media.file, entry.id, mediaIndex);
              }
              if (media.existingId) {
                return updateMediaOrder(entry.id, media.existingId, mediaIndex);
              }
              return null;
            })
          );
        }
      }

      setSuccess(true);
      setDirty(false);
      if (isCreate) {
        router.push(`/trips/${tripId}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const essentialsComplete = Boolean(title.trim() && city.trim() && countryCode);
  const storyComplete =
    draftEntries.length > 0 &&
    draftEntries.every(
      (entry) => entry.description.trim() && entry.media.length > 0
    );
  const missingDescriptionSet = useMemo(
    () => new Set(missingDescriptionIds),
    [missingDescriptionIds]
  );
  const missingMediaSet = useMemo(
    () => new Set(missingMediaIds),
    [missingMediaIds]
  );

  return (
    <div className="w-full space-y-6 px-4 pb-36 md:px-8">
      <div className="rounded-[32px] border border-white/10 bg-[color:var(--panel)]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.32em] text-white/70">
              {isCreate ? "Trip builder" : "Trip editor"}
            </Badge>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              {title || "Untitled trip"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isCreate
                ? "Set the essentials first, then build the story step by step."
                : "Fine-tune the details and shape the story you want to share."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href={backHref}>
                <ArrowLeft className="size-4" />
                {backLabel}
              </Link>
            </Button>
            {activeStep === "story" ? (
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {saving ? savingLabel : saveLabel}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => handleStepChange("story")}
                className="gap-2"
              >
                Continue to story
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 rounded-[22px] border border-white/10 bg-[color:var(--panel-2)]/70 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleStepChange("essentials")}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition",
                activeStep === "essentials"
                  ? "border border-white/10 bg-[color:var(--panel-3)]/70 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={activeStep === "essentials"}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  essentialsComplete ? "bg-emerald-400" : "bg-white/20"
                )}
              />
              Essentials
            </button>
            <button
              type="button"
              onClick={() => handleStepChange("story")}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition",
                activeStep === "story"
                  ? "border border-white/10 bg-[color:var(--panel-3)]/70 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={activeStep === "story"}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  storyComplete ? "bg-emerald-400" : "bg-white/20"
                )}
              />
              Story
            </button>
          </div>
          <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Step {activeStep === "essentials" ? "01" : "02"} / 02
          </div>
        </div>
        {error ? (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        ) : null}
        {formatWarning ? (
          <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
            {formatWarning}
          </div>
        ) : null}
        {success ? (
          <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
            {isCreate
              ? "Trip created. Redirecting to the story."
              : "Story saved. Your trip presentation is updated."}
          </div>
        ) : null}
      </div>

      {activeStep === "essentials" ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel)]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Trip essentials</p>
                  <p className="text-xs text-muted-foreground">
                    The core facts that anchor this story.
                  </p>
                </div>
                <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                  Required
                </Badge>
              </div>
              <Separator className="my-4 bg-white/10" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tripTitle">Trip name</Label>
                  <Input
                    id="tripTitle"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      if (titleError) {
                        setTitleError(null);
                      }
                      markDirty();
                    }}
                    placeholder="Name the trip"
                    className={cn(
                      titleError &&
                        "border-destructive/60 focus-visible:ring-destructive/40"
                    )}
                  />
                  {titleError ? (
                    <p className="text-xs text-destructive">{titleError}</p>
                  ) : null}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">From</Label>
                    <DatePicker
                      id="startDate"
                      name="startDate"
                      value={startDate}
                      onChange={(value) => {
                        setStartDate(value);
                        markDirty();
                      }}
                      placeholder="Start date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">To</Label>
                    <DatePicker
                      id="endDate"
                      name="endDate"
                      value={endDate}
                      onChange={(value) => {
                        setEndDate(value);
                        markDirty();
                      }}
                      placeholder="End date"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel)]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-xs text-muted-foreground">
                    Search a city and lock the pin.
                  </p>
                </div>
                <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                  Required
                </Badge>
              </div>
              <Separator className="my-4 bg-white/10" />
              <TripLocationPicker
                city={city}
                countryCode={countryCode}
                lat={lat}
                lng={lng}
                error={locationError}
                onLocationChange={handleLocationChange}
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel)]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Story preset</p>
                  <p className="text-xs text-muted-foreground">
                    Choose how the story is presented to guests.
                  </p>
                </div>
                <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                  Style
                </Badge>
              </div>
              <Separator className="my-4 bg-white/10" />
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                {PRESET_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setPreset(option.value);
                      markDirty();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setPreset(option.value);
                        markDirty();
                      }
                    }}
                    className={cn(
                      "rounded-2xl border px-4 py-4 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-[color:var(--lagoon)]/50",
                      preset === option.value
                        ? "border-[color:var(--lagoon)] bg-[color:var(--panel-2)]/80 text-foreground"
                        : "border-white/10 bg-[color:var(--panel-3)]/60 text-muted-foreground hover:border-white/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {option.label}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={(event) => {
                          event.stopPropagation();
                          setPresetPreview(option.value);
                        }}
                        aria-label={`Preview ${option.label}`}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[color:var(--panel)]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Story builder</p>
                <p className="text-xs text-muted-foreground">
                  Add media with descriptions, then order the chapters.
                </p>
              </div>
              <Badge className="border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/70">
                Required
              </Badge>
            </div>
            <Separator className="my-4 bg-white/10" />
            <div className="space-y-4">
              <MediaDropzone
                title="Add media"
                helper="Drop files here or browse to start new scenes."
                note={`Supported: ${SUPPORTED_LABEL}`}
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                containerId="addMedia"
                onFiles={addEntriesFromFiles}
              />

              {draftEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[color:var(--panel-2)]/60 px-4 py-6 text-sm text-muted-foreground">
                  No story entries yet. Add media to start the story.
                </div>
              ) : (
                <div className="space-y-4">
                  {draftEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="space-y-3 rounded-[28px] border border-white/10 bg-[color:var(--panel-2)]/70 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                          {entry.title?.trim() ||
                            `Scene ${String(index + 1).padStart(2, "0")}`}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => moveEntry(entry.id, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => moveEntry(entry.id, "down")}
                            disabled={index === draftEntries.length - 1}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeEntry(entry.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`entry-title-${entry.id}`}>
                          Scene label
                        </Label>
                        <Input
                          id={`entry-title-${entry.id}`}
                          value={entry.title ?? ""}
                          onChange={(event) =>
                            updateEntryTitle(entry.id, event.target.value)
                          }
                          placeholder="Day 1"
                          className="bg-[color:var(--panel-3)]/60"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`entry-${entry.id}`}>Description</Label>
                        <Textarea
                          id={`entry-${entry.id}`}
                          value={entry.description}
                          onChange={(event) =>
                            updateEntryDescription(entry.id, event.target.value)
                          }
                          rows={3}
                          placeholder="Write what happened in this scene"
                          className={cn(
                            missingDescriptionSet.has(entry.id) &&
                              "border-destructive/60 focus-visible:ring-destructive/40"
                          )}
                        />
                        {missingDescriptionSet.has(entry.id) ? (
                          <p className="text-xs text-destructive">
                            Add a short description for this scene.
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <MediaDropzone
                          title="Add media to this scene"
                          helper="Drop files here or browse."
                          note={`Supported: ${SUPPORTED_LABEL}`}
                          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                          containerId={`entry-media-${entry.id}`}
                          compact
                          onFiles={(files) => addMediaToEntry(entry.id, files)}
                        />
                        {missingMediaSet.has(entry.id) ? (
                          <p className="text-xs text-destructive">
                            Add at least one media item.
                          </p>
                        ) : null}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {entry.media.map((media, mediaIndex) => (
                          <div
                            key={media.id}
                            className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[color:var(--panel-3)]/80"
                          >
                          <div className="relative aspect-[4/3] w-full bg-black/30">
                            {media.url ? (
                              media.mediaType === "video" ? (
                                <video
                                  src={media.url}
                                  className="absolute inset-0 h-full w-full object-contain"
                                  controls
                                />
                              ) : (
                                <img
                                  src={media.url}
                                  alt="Scene media"
                                  className="absolute inset-0 h-full w-full object-contain"
                                />
                              )
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                Media preview
                              </div>
                            )}
                          </div>
                            <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/80">
                              {media.file ? "New" : "Saved"}
                            </div>
                            <div className="absolute left-3 top-3 flex items-center gap-2">
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-black/60 text-white hover:bg-black/80"
                                onClick={() => moveMedia(entry.id, media.id, "up")}
                                disabled={mediaIndex === 0}
                              >
                                <ArrowUp className="size-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-black/60 text-white hover:bg-black/80"
                                onClick={() => moveMedia(entry.id, media.id, "down")}
                                disabled={mediaIndex === entry.media.length - 1}
                              >
                                <ArrowDown className="size-4" />
                              </Button>
                            </div>
                            <div className="absolute right-3 top-3">
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-black/60 text-white hover:bg-black/80"
                                onClick={() => removeMedia(entry.id, media.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {previewOpen ? (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0">
            <div className="space-y-6 px-4 pb-6 pt-8 md:px-6">
              <DialogHeader>
                <DialogTitle>Trip preview</DialogTitle>
                <DialogDescription>
                  Live preview updates with every change you make.
                </DialogDescription>
              </DialogHeader>
              <TripStoryPresentation
                title={title || "Untitled trip"}
                city={city}
                countryCode={countryCode}
                startDate={startDate ? formatDateInputValue(startDate) : null}
                endDate={endDate ? formatDateInputValue(endDate) : null}
                preset={preset}
                entries={previewEntries}
                globePins={pins}
                focusPinId={pins[0]?.id ?? null}
                label="Trip preview"
                fullBleed
                enableLightbox
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
      {presetPreview ? (
        <Dialog
          open={Boolean(presetPreview)}
          onOpenChange={(open) => {
            if (!open) setPresetPreview(null);
          }}
        >
          <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0">
            <div className="space-y-6 px-4 pb-6 pt-8 md:px-6">
              <DialogHeader>
                <DialogTitle>Preset preview</DialogTitle>
                <DialogDescription>
                  See how this layout tells a trip story with sample content.
                </DialogDescription>
              </DialogHeader>
              <TripStoryPresentation
                title={PREVIEW_TRIP.title}
                city={PREVIEW_TRIP.city}
                countryCode={PREVIEW_TRIP.countryCode}
                startDate={PREVIEW_TRIP.startDate}
                endDate={PREVIEW_TRIP.endDate}
                preset={presetPreview}
                entries={PREVIEW_ENTRIES}
                label="Preset preview"
                fullBleed
                showGlobe={false}
                enableLightbox
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}

      <div className="fixed bottom-4 left-4 right-4 z-40 md:left-[calc(var(--sidebar-width)+2rem)] md:right-8">
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[color:var(--panel)]/95 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewOpen(true)}
              className="w-full gap-2 sm:w-auto"
            >
              <Eye className="size-4" />
              Trip preview
            </Button>
            {activeStep === "story" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleStepChange("essentials")}
                className="w-full gap-2 sm:w-auto"
              >
                <ArrowLeft className="size-4" />
                Back to essentials
              </Button>
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            {activeStep === "essentials" ? (
              <Button
                type="button"
                onClick={() => handleStepChange("story")}
                className="w-full gap-2 sm:w-auto"
              >
                Continue to story
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full gap-2 sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {saving ? savingLabel : saveLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
