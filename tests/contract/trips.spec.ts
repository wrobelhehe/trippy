import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/trips", () => ({
  listTrips: vi.fn(),
  createTrip: vi.fn(),
}));

describe("Trips API contract", () => {
  it("lists trips", async () => {
    const { GET } = await import("@/app/api/trips/route");
    const { listTrips } = await import("@/lib/supabase/trips");
    const listTripsMock = vi.mocked(listTrips);

    listTripsMock.mockResolvedValueOnce([
      {
        id: "trip_1",
        owner_id: "user_1",
        title: "Lisbon",
        place_name: "Lisbon",
        country_code: "PT",
        lat: 38.72,
        lng: -9.13,
        start_date: null,
        end_date: null,
        short_description: null,
        cover_media_id: null,
        tags: [],
        privacy_mode: "private",
        hide_exact_dates: true,
        moments_count: 0,
        media_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body[0].title).toBe("Lisbon");
  });

  it("creates a trip", async () => {
    const { POST } = await import("@/app/api/trips/route");
    const { createTrip } = await import("@/lib/supabase/trips");
    const createTripMock = vi.mocked(createTrip);

    createTripMock.mockResolvedValueOnce({
      id: "trip_2",
      owner_id: "user_1",
      title: "Kyoto",
      place_name: "Kyoto",
      country_code: "JP",
      lat: 35.01,
      lng: 135.76,
      start_date: null,
      end_date: null,
      short_description: null,
      cover_media_id: null,
      tags: [],
      privacy_mode: "private",
      hide_exact_dates: true,
      moments_count: 0,
      media_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    });

    const request = new Request("http://localhost/api/trips", {
      method: "POST",
      body: JSON.stringify({ title: "Kyoto", placeName: "Kyoto" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.id).toBe("trip_2");
  });

  it("validates required fields", async () => {
    const { POST } = await import("@/app/api/trips/route");

    const request = new Request("http://localhost/api/trips", {
      method: "POST",
      body: JSON.stringify({ title: "Missing place" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});