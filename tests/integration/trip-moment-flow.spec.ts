import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/trips", () => ({
  createTrip: vi.fn(),
}));

vi.mock("@/lib/supabase/moments", () => ({
  createMoment: vi.fn(),
}));

describe("Trip + moment flow", () => {
  it("creates a trip then a moment", async () => {
    const { POST: createTripHandler } = await import("@/app/api/trips/route");
    const { POST: createMomentHandler } = await import(
      "@/app/api/trips/[tripId]/moments/route"
    );
    const { createTrip } = await import("@/lib/supabase/trips");
    const { createMoment } = await import("@/lib/supabase/moments");

    const createTripMock = vi.mocked(createTrip);
    const createMomentMock = vi.mocked(createMoment);

    createTripMock.mockResolvedValueOnce({
      id: "trip_flow",
      owner_id: "user_1",
      title: "Oslo",
      place_name: "Oslo",
      country_code: "NO",
      lat: 59.91,
      lng: 10.75,
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

    createMomentMock.mockResolvedValueOnce({
      id: "moment_flow",
      trip_id: "trip_flow",
      owner_id: "user_1",
      content_text: "Fjord breeze.",
      moment_timestamp: null,
      order_index: 1,
      lat: null,
      lng: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    });

    const tripResponse = await createTripHandler(
      new Request("http://localhost/api/trips", {
        method: "POST",
        body: JSON.stringify({ title: "Oslo", placeName: "Oslo" }),
      })
    );

    const tripBody = await tripResponse.json();

    const momentResponse = await createMomentHandler(
      new Request("http://localhost/api/trips/trip_flow/moments", {
        method: "POST",
        body: JSON.stringify({ contentText: "Fjord breeze." }),
      }),
      { params: Promise.resolve({ tripId: tripBody.id }) }
    );

    const momentBody = await momentResponse.json();

    expect(tripBody.id).toBe("trip_flow");
    expect(momentBody.trip_id).toBe("trip_flow");
  });
});
