import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/moments", () => ({
  listMoments: vi.fn(),
  createMoment: vi.fn(),
}));

describe("Moments API contract", () => {
  it("lists moments", async () => {
    const { GET } = await import("@/app/api/trips/[tripId]/moments/route");
    const { listMoments } = await import("@/lib/supabase/moments");
    const listMomentsMock = vi.mocked(listMoments);

    listMomentsMock.mockResolvedValueOnce([
      {
        id: "moment_1",
        trip_id: "trip_1",
        owner_id: "user_1",
        content_text: "Golden hour walk.",
        moment_timestamp: null,
        order_index: 1,
        lat: null,
        lng: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
    ]);

    const response = await GET(new Request("http://localhost"), {
      params: { tripId: "trip_1" },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body[0].content_text).toBe("Golden hour walk.");
  });

  it("creates a moment", async () => {
    const { POST } = await import("@/app/api/trips/[tripId]/moments/route");
    const { createMoment } = await import("@/lib/supabase/moments");
    const createMomentMock = vi.mocked(createMoment);

    createMomentMock.mockResolvedValueOnce({
      id: "moment_2",
      trip_id: "trip_1",
      owner_id: "user_1",
      content_text: "Matcha break.",
      moment_timestamp: null,
      order_index: null,
      lat: null,
      lng: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    });

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ contentText: "Matcha break." }),
    });

    const response = await POST(request, { params: { tripId: "trip_1" } });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.id).toBe("moment_2");
  });

  it("validates required fields", async () => {
    const { POST } = await import("@/app/api/trips/[tripId]/moments/route");

    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request, { params: { tripId: "trip_1" } });
    expect(response.status).toBe(400);
  });
});