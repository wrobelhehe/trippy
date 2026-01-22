import { createAdminClient } from "@/lib/supabase/server";
import { hashShareToken } from "@/lib/share/tokens";

export type SharePrivacy = {
  hide_exact_dates: boolean;
  allow_downloads: boolean;
};

export type ShareVisibility = {
  show_owner: boolean;
  show_stats: boolean;
  show_globe: boolean;
  show_highlights: boolean;
  show_moments: boolean;
  show_media: boolean;
  show_tags: boolean;
  show_profile_bio: boolean;
  show_trip_list: boolean;
  show_trip_descriptions: boolean;
};

export type ShareOwner = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export type ShareMediaItem = {
  id: string;
  media_type: "image" | "video";
  preview_url: string | null;
  full_url: string | null;
  download_url: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  size_bytes: number | null;
};

export type ShareMoment = {
  id: string;
  content_text: string;
  moment_timestamp: string | null;
  order_index: number;
};

export type ShareTrip = {
  id: string;
  title: string;
  place_name: string;
  country_code: string | null;
  lat: number | null;
  lng: number | null;
  start_date: string | null;
  end_date: string | null;
  date_label: string | null;
  short_description: string | null;
  tags: string[];
  moments_count: number;
  media_count: number;
};

export type ShareTripPayload = {
  scope: "trip";
  share_link_id: string;
  privacy: SharePrivacy;
  visibility: ShareVisibility;
  owner: ShareOwner | null;
  trip: ShareTrip;
  highlights: string[];
  moments: ShareMoment[];
  media: ShareMediaItem[];
};

export type ShareProfileTrip = {
  id: string;
  title: string;
  place_name: string;
  country_code: string | null;
  lat: number | null;
  lng: number | null;
  start_date: string | null;
  end_date: string | null;
  date_label: string | null;
  short_description: string | null;
  tags: string[];
  moments_count: number;
  media_count: number;
};

export type ShareProfileStats = {
  trip_count: number;
  moments_count: number;
  media_count: number;
  countries_count: number;
};

export type ShareProfilePayload = {
  scope: "profile";
  share_link_id: string;
  privacy: SharePrivacy;
  visibility: ShareVisibility;
  owner: ShareOwner | null;
  stats: ShareProfileStats;
  trips: ShareProfileTrip[];
};

export type SharePayload = ShareTripPayload | ShareProfilePayload;

export type ShareLinkRecord = {
  id: string;
  owner_id: string;
  scope: "trip" | "profile";
  trip_id: string | null;
  token_hash: string;
  privacy_overrides: Record<string, unknown> | null;
  revoked_at: string | null;
  expires_at: string | null;
};

type ShareTripRecord = {
  id: string;
  owner_id: string;
  title: string;
  place_name: string;
  country_code: string | null;
  lat: number | null;
  lng: number | null;
  start_date: string | null;
  end_date: string | null;
  short_description: string | null;
  deleted_at: string | null;
  tags: string[] | null;
  moments_count: number;
  media_count: number;
};

type ShareMomentRecord = {
  id: string;
  content_text: string;
  moment_timestamp: string | null;
  order_index: number;
};

type ShareMediaRecord = {
  id: string;
  media_type: "image" | "video";
  storage_bucket: string;
  storage_path: string;
  thumb_path: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  size_bytes: number | null;
};

type ShareProfileRecord = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

function normalizePrivacy(
  overrides: Record<string, unknown> | null | undefined
): SharePrivacy {
  const hideExactDatesValue =
    overrides?.hideExactDates ?? overrides?.hide_exact_dates;
  const allowDownloadsValue =
    overrides?.allowDownloads ?? overrides?.allow_downloads;

  return {
    hide_exact_dates:
      typeof hideExactDatesValue === "boolean" ? hideExactDatesValue : true,
    allow_downloads:
      typeof allowDownloadsValue === "boolean" ? allowDownloadsValue : false,
  };
}

function readBooleanOverride(
  overrides: Record<string, unknown> | null | undefined,
  camelKey: string,
  snakeKey: string,
  fallback: boolean
) {
  const value = overrides?.[camelKey] ?? overrides?.[snakeKey];
  return typeof value === "boolean" ? value : fallback;
}

function normalizeVisibility(
  overrides: Record<string, unknown> | null | undefined
): ShareVisibility {
  return {
    show_owner: readBooleanOverride(overrides, "showOwner", "show_owner", true),
    show_stats: readBooleanOverride(overrides, "showStats", "show_stats", true),
    show_globe: readBooleanOverride(overrides, "showGlobe", "show_globe", true),
    show_highlights: readBooleanOverride(
      overrides,
      "showHighlights",
      "show_highlights",
      true
    ),
    show_moments: readBooleanOverride(
      overrides,
      "showMoments",
      "show_moments",
      true
    ),
    show_media: readBooleanOverride(overrides, "showMedia", "show_media", true),
    show_tags: readBooleanOverride(overrides, "showTags", "show_tags", true),
    show_profile_bio: readBooleanOverride(
      overrides,
      "showProfileBio",
      "show_profile_bio",
      true
    ),
    show_trip_list: readBooleanOverride(
      overrides,
      "showTripList",
      "show_trip_list",
      true
    ),
    show_trip_descriptions: readBooleanOverride(
      overrides,
      "showTripDescriptions",
      "show_trip_descriptions",
      true
    ),
  };
}

function formatDateLabel(
  start: string | null,
  end: string | null,
  hideExactDates: boolean
) {
  if (!start && !end) {
    return null;
  }

  const formatOptions: Intl.DateTimeFormatOptions = hideExactDates
    ? { month: "short", year: "numeric" }
    : { month: "short", day: "numeric", year: "numeric" };

  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  if (startDate && endDate) {
    const startLabel = startDate.toLocaleDateString("en-US", formatOptions);
    const endLabel = endDate.toLocaleDateString("en-US", formatOptions);

    if (
      hideExactDates &&
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth()
    ) {
      return startLabel;
    }

    return `${startLabel} - ${endLabel}`;
  }

  const solo = startDate ?? endDate;
  return solo?.toLocaleDateString("en-US", formatOptions) ?? null;
}

function normalizeHighlights(input: unknown) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => (typeof item === "string" ? item : null))
    .filter((item): item is string => Boolean(item));
}

async function createSignedUrl(
  supabaseAdmin: ReturnType<typeof createAdminClient>,
  bucket: string,
  path: string
) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    return null;
  }

  return data.signedUrl ?? null;
}

export async function getSharePayload(token: string): Promise<SharePayload | null> {
  const supabaseAdmin = createAdminClient();
  const tokenHash = hashShareToken(token);

  const { data: shareLink, error: shareLinkError } = await supabaseAdmin
    .from("share_links")
    .select("*")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (shareLinkError) {
    throw new Error(shareLinkError.message);
  }

  if (!shareLink) {
    return null;
  }

  const shareLinkRecord = shareLink as ShareLinkRecord;
  if (shareLinkRecord.revoked_at) {
    return null;
  }

  if (shareLinkRecord.expires_at) {
    const expiresAt = new Date(shareLinkRecord.expires_at).getTime();
    if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
      return null;
    }
  }

  const privacy = normalizePrivacy(shareLinkRecord.privacy_overrides ?? {});
  const visibility = normalizeVisibility(shareLinkRecord.privacy_overrides ?? {});

  const { data: owner, error: ownerError } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, avatar_url, bio")
    .eq("id", shareLinkRecord.owner_id)
    .maybeSingle();

  if (ownerError) {
    throw new Error(ownerError.message);
  }

  const ownerPayload =
    owner && visibility.show_owner
      ? ({
          id: owner.id,
          display_name: owner.display_name ?? null,
          avatar_url: owner.avatar_url ?? null,
          bio: visibility.show_profile_bio ? owner.bio ?? null : null,
        } as ShareOwner)
      : null;

  if (shareLinkRecord.scope === "profile") {
    const { data: trips, error: tripsError } = await supabaseAdmin
      .from("trips")
      .select(
        "id, title, place_name, country_code, lat, lng, start_date, end_date, short_description, tags, moments_count, media_count, deleted_at"
      )
      .eq("owner_id", shareLinkRecord.owner_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (tripsError) {
      throw new Error(tripsError.message);
    }

    const tripRecords = (trips ?? []).map((trip) => trip as ShareTripRecord);
    const countries = new Set(
      tripRecords.map((trip) => trip.country_code).filter(Boolean)
    );
    const stats = visibility.show_stats
      ? {
          trip_count: tripRecords.length,
          moments_count: tripRecords.reduce(
            (sum, trip) => sum + (trip.moments_count ?? 0),
            0
          ),
          media_count: tripRecords.reduce(
            (sum, trip) => sum + (trip.media_count ?? 0),
            0
          ),
          countries_count: countries.size,
        }
      : {
          trip_count: 0,
          moments_count: 0,
          media_count: 0,
          countries_count: 0,
        };

    const listVisible = visibility.show_trip_list;
    const tripItems = tripRecords.map((tripRecord) => ({
      id: tripRecord.id,
      title: tripRecord.title,
      place_name: tripRecord.place_name,
      country_code: tripRecord.country_code ?? null,
      lat: visibility.show_globe ? tripRecord.lat ?? null : null,
      lng: visibility.show_globe ? tripRecord.lng ?? null : null,
      start_date:
        listVisible && !privacy.hide_exact_dates ? tripRecord.start_date : null,
      end_date:
        listVisible && !privacy.hide_exact_dates ? tripRecord.end_date : null,
      date_label: listVisible
        ? formatDateLabel(
            tripRecord.start_date,
            tripRecord.end_date,
            privacy.hide_exact_dates
          )
        : null,
      short_description:
        listVisible && visibility.show_trip_descriptions
          ? tripRecord.short_description ?? null
          : null,
      tags:
        listVisible && visibility.show_tags ? tripRecord.tags ?? [] : [],
      moments_count: visibility.show_stats ? tripRecord.moments_count ?? 0 : 0,
      media_count: visibility.show_stats ? tripRecord.media_count ?? 0 : 0,
    }));

    return {
      scope: "profile",
      share_link_id: shareLinkRecord.id,
      privacy,
      visibility,
      owner: ownerPayload,
      stats,
      trips: tripItems,
    };
  }

  if (!shareLinkRecord.trip_id) {
    return null;
  }

  const tripId = shareLinkRecord.trip_id;

  const [tripResult, highlightsResult, momentsResult, mediaResult] =
    await Promise.all([
      supabaseAdmin
        .from("trips")
        .select(
          "id, owner_id, title, place_name, country_code, lat, lng, start_date, end_date, short_description, tags, deleted_at, moments_count, media_count"
        )
        .eq("id", tripId)
        .maybeSingle(),
      supabaseAdmin
        .from("trip_highlights")
        .select("highlight_items")
        .eq("trip_id", tripId)
        .maybeSingle(),
      supabaseAdmin
        .from("moments")
        .select("id, content_text, moment_timestamp, order_index, deleted_at")
        .eq("trip_id", tripId)
        .is("deleted_at", null)
        .order("order_index", { ascending: true }),
      supabaseAdmin
        .from("trip_media")
        .select(
          "media:media_id (id, media_type, storage_bucket, storage_path, thumb_path, width, height, duration_seconds, size_bytes)"
        )
        .eq("trip_id", tripId),
    ]);

  if (tripResult.error) {
    throw new Error(tripResult.error.message);
  }

  if (!tripResult.data) {
    return null;
  }

  const tripRecord = tripResult.data as ShareTripRecord;

  if (tripRecord.deleted_at) {
    return null;
  }

  if (highlightsResult.error) {
    throw new Error(highlightsResult.error.message);
  }

  if (momentsResult.error) {
    throw new Error(momentsResult.error.message);
  }

  if (mediaResult.error) {
    throw new Error(mediaResult.error.message);
  }

  const highlights = visibility.show_highlights
    ? normalizeHighlights(highlightsResult.data?.highlight_items ?? [])
    : [];

  const moments = visibility.show_moments
    ? (momentsResult.data ?? []).map((moment) => {
        const momentRecord = moment as ShareMomentRecord;
        return {
          id: momentRecord.id,
          content_text: momentRecord.content_text,
          moment_timestamp: privacy.hide_exact_dates
            ? null
            : momentRecord.moment_timestamp ?? null,
          order_index: momentRecord.order_index,
        };
      })
    : [];

  const mediaRecords = (mediaResult.data ?? []).map((row) => {
    const media = row.media as ShareMediaRecord;
    return media;
  });

  const mediaWithUrls = visibility.show_media
    ? await Promise.all(
        mediaRecords.map(async (media) => {
          const [previewUrl, fullUrl] = await Promise.all([
            media.thumb_path
              ? createSignedUrl(
                  supabaseAdmin,
                  media.storage_bucket,
                  media.thumb_path
                )
              : createSignedUrl(
                  supabaseAdmin,
                  media.storage_bucket,
                  media.storage_path
                ),
            createSignedUrl(
              supabaseAdmin,
              media.storage_bucket,
              media.storage_path
            ),
          ]);

          return {
            id: media.id,
            media_type: media.media_type,
            preview_url: previewUrl ?? fullUrl,
            full_url: fullUrl,
            download_url: privacy.allow_downloads ? fullUrl : null,
            width: media.width ?? null,
            height: media.height ?? null,
            duration_seconds: media.duration_seconds ?? null,
            size_bytes: media.size_bytes ?? null,
          };
        })
      )
    : [];

  return {
    scope: "trip",
    share_link_id: shareLinkRecord.id,
    privacy,
    visibility,
    owner: ownerPayload,
    trip: {
      id: tripRecord.id,
      title: tripRecord.title,
      place_name: tripRecord.place_name,
      country_code: tripRecord.country_code ?? null,
      lat: visibility.show_globe ? tripRecord.lat ?? null : null,
      lng: visibility.show_globe ? tripRecord.lng ?? null : null,
      start_date: privacy.hide_exact_dates ? null : tripRecord.start_date,
      end_date: privacy.hide_exact_dates ? null : tripRecord.end_date,
      date_label: formatDateLabel(
        tripRecord.start_date,
        tripRecord.end_date,
        privacy.hide_exact_dates
      ),
      short_description: visibility.show_trip_descriptions
        ? tripRecord.short_description ?? null
        : null,
      tags: visibility.show_tags ? tripRecord.tags ?? [] : [],
      moments_count: visibility.show_stats ? tripRecord.moments_count ?? 0 : 0,
      media_count: visibility.show_stats ? tripRecord.media_count ?? 0 : 0,
    },
    highlights,
    moments,
    media: mediaWithUrls,
  };
}

export async function getTripSharePayloadForLink(
  shareLinkRecord: ShareLinkRecord
): Promise<ShareTripPayload | null> {
  if (shareLinkRecord.scope !== "trip") {
    return null;
  }

  if (shareLinkRecord.revoked_at) {
    return null;
  }

  if (shareLinkRecord.expires_at) {
    const expiresAt = new Date(shareLinkRecord.expires_at).getTime();
    if (Number.isFinite(expiresAt) && expiresAt < Date.now()) {
      return null;
    }
  }

  if (!shareLinkRecord.trip_id) {
    return null;
  }

  const supabaseAdmin = createAdminClient();
  const privacy = normalizePrivacy(shareLinkRecord.privacy_overrides ?? {});
  const visibility = normalizeVisibility(shareLinkRecord.privacy_overrides ?? {});

  const { data: owner, error: ownerError } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, avatar_url, bio")
    .eq("id", shareLinkRecord.owner_id)
    .maybeSingle();

  if (ownerError) {
    throw new Error(ownerError.message);
  }

  const ownerPayload =
    owner && visibility.show_owner
      ? ({
          id: owner.id,
          display_name: owner.display_name ?? null,
          avatar_url: owner.avatar_url ?? null,
          bio: visibility.show_profile_bio ? owner.bio ?? null : null,
        } as ShareOwner)
      : null;

  const tripId = shareLinkRecord.trip_id;

  const [tripResult, highlightsResult, momentsResult, mediaResult] =
    await Promise.all([
      supabaseAdmin
        .from("trips")
        .select(
          "id, owner_id, title, place_name, country_code, lat, lng, start_date, end_date, short_description, tags, deleted_at, moments_count, media_count"
        )
        .eq("id", tripId)
        .maybeSingle(),
      supabaseAdmin
        .from("trip_highlights")
        .select("highlight_items")
        .eq("trip_id", tripId)
        .maybeSingle(),
      supabaseAdmin
        .from("moments")
        .select("id, content_text, moment_timestamp, order_index, deleted_at")
        .eq("trip_id", tripId)
        .is("deleted_at", null)
        .order("order_index", { ascending: true }),
      supabaseAdmin
        .from("trip_media")
        .select(
          "media:media_id (id, media_type, storage_bucket, storage_path, thumb_path, width, height, duration_seconds, size_bytes)"
        )
        .eq("trip_id", tripId),
    ]);

  if (tripResult.error) {
    throw new Error(tripResult.error.message);
  }

  if (!tripResult.data) {
    return null;
  }

  const tripRecord = tripResult.data as ShareTripRecord;

  if (tripRecord.deleted_at) {
    return null;
  }

  if (highlightsResult.error) {
    throw new Error(highlightsResult.error.message);
  }

  if (momentsResult.error) {
    throw new Error(momentsResult.error.message);
  }

  if (mediaResult.error) {
    throw new Error(mediaResult.error.message);
  }

  const highlights = visibility.show_highlights
    ? normalizeHighlights(highlightsResult.data?.highlight_items ?? [])
    : [];

  const moments = visibility.show_moments
    ? (momentsResult.data ?? []).map((moment) => {
        const momentRecord = moment as ShareMomentRecord;
        return {
          id: momentRecord.id,
          content_text: momentRecord.content_text,
          moment_timestamp: privacy.hide_exact_dates
            ? null
            : momentRecord.moment_timestamp ?? null,
          order_index: momentRecord.order_index,
        };
      })
    : [];

  const mediaRecords = (mediaResult.data ?? []).map((row) => {
    const media = row.media as ShareMediaRecord;
    return media;
  });

  const mediaWithUrls = visibility.show_media
    ? await Promise.all(
        mediaRecords.map(async (media) => {
          const [previewUrl, fullUrl] = await Promise.all([
            media.thumb_path
              ? createSignedUrl(
                  supabaseAdmin,
                  media.storage_bucket,
                  media.thumb_path
                )
              : createSignedUrl(
                  supabaseAdmin,
                  media.storage_bucket,
                  media.storage_path
                ),
            createSignedUrl(
              supabaseAdmin,
              media.storage_bucket,
              media.storage_path
            ),
          ]);

          return {
            id: media.id,
            media_type: media.media_type,
            preview_url: previewUrl ?? fullUrl,
            full_url: fullUrl,
            download_url: privacy.allow_downloads ? fullUrl : null,
            width: media.width ?? null,
            height: media.height ?? null,
            duration_seconds: media.duration_seconds ?? null,
            size_bytes: media.size_bytes ?? null,
          };
        })
      )
    : [];

  return {
    scope: "trip",
    share_link_id: shareLinkRecord.id,
    privacy,
    visibility,
    owner: ownerPayload,
    trip: {
      id: tripRecord.id,
      title: tripRecord.title,
      place_name: tripRecord.place_name,
      country_code: tripRecord.country_code ?? null,
      lat: visibility.show_globe ? tripRecord.lat ?? null : null,
      lng: visibility.show_globe ? tripRecord.lng ?? null : null,
      start_date: privacy.hide_exact_dates ? null : tripRecord.start_date,
      end_date: privacy.hide_exact_dates ? null : tripRecord.end_date,
      date_label: formatDateLabel(
        tripRecord.start_date,
        tripRecord.end_date,
        privacy.hide_exact_dates
      ),
      short_description: visibility.show_trip_descriptions
        ? tripRecord.short_description ?? null
        : null,
      tags: visibility.show_tags ? tripRecord.tags ?? [] : [],
      moments_count: visibility.show_stats ? tripRecord.moments_count ?? 0 : 0,
      media_count: visibility.show_stats ? tripRecord.media_count ?? 0 : 0,
    },
    highlights,
    moments,
    media: mediaWithUrls,
  };
}
