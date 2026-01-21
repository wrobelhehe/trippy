import { createClient } from "@/lib/supabase/server";

export type AuditEventInput = {
  eventType: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export async function logAuditEvent({
  eventType,
  entityType,
  entityId,
  metadata,
}: AuditEventInput) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return;
  }

  const { error } = await supabase.from("audit_log").insert({
    owner_id: data.user.id,
    event_type: eventType,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    metadata: metadata ?? {},
  });

  if (error) {
    console.error("[audit] Failed to log event:", eventType, error.message);
  }
}
