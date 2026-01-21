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
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return;
  }

  await supabase.from("audit_log").insert({
    owner_id: data.user.id,
    event_type: eventType,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    metadata: metadata ?? {},
  });
}