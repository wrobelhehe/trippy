"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

const REALTIME_TABLES = [
  { table: "trips", filterColumn: "owner_id" },
  { table: "moments", filterColumn: "owner_id" },
  { table: "media", filterColumn: "owner_id" },
  { table: "trip_media", filterColumn: "owner_id" },
  { table: "moment_media", filterColumn: "owner_id" },
  { table: "trip_highlights", filterColumn: "owner_id" },
  { table: "share_links", filterColumn: "owner_id" },
  { table: "subscriptions", filterColumn: "owner_id" },
  { table: "profiles", filterColumn: "id" },
];

export function RealtimeRefresh({ userId }: { userId?: string | null }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const refreshTimeout = useRef<ReturnType<typeof window.setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    const channel = supabase.channel(`realtime-refresh-${userId}`);

    const triggerRefresh = () => {
      if (refreshTimeout.current !== null) {
        return;
      }
      refreshTimeout.current = window.setTimeout(() => {
        refreshTimeout.current = null;
        router.refresh();
      }, 250);
    };

    REALTIME_TABLES.forEach(({ table, filterColumn }) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `${filterColumn}=eq.${userId}`,
        },
        triggerRefresh
      );
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
      if (refreshTimeout.current !== null) {
        window.clearTimeout(refreshTimeout.current);
        refreshTimeout.current = null;
      }
    };
  }, [router, supabase, userId]);

  return null;
}
