import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/share/serializer", () => ({
  getSharePayload: vi.fn(),
}));

vi.mock("@/lib/share/rate-limit", () => ({
  checkShareRateLimit: vi.fn(() => ({
    allowed: true,
    remaining: 10,
    resetAt: Date.now() + 60_000,
  })),
}));

describe("Share payload API contract", () => {
  it("returns a share payload", async () => {
    const { GET } = await import("@/app/api/share/[token]/route");
    const { getSharePayload } = await import("@/lib/share/serializer");
    const getSharePayloadMock = vi.mocked(getSharePayload);

    getSharePayloadMock.mockResolvedValueOnce({
      scope: "trip",
      share_link_id: "share_1",
      privacy: { hide_exact_dates: true, allow_downloads: false },
      owner: {
        id: "user_1",
        display_name: "Mira",
        avatar_url: null,
        bio: null,
      },
      trip: {
        id: "trip_1",
        title: "Lisbon",
        place_name: "Lisbon",
        start_date: null,
        end_date: null,
        date_label: "Jan 2024",
        short_description: null,
      },
      highlights: [],
      moments: [],
      media: [],
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ token: "token_1" }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.scope).toBe("trip");
  });

  it("returns 404 when share payload is missing", async () => {
    const { GET } = await import("@/app/api/share/[token]/route");
    const { getSharePayload } = await import("@/lib/share/serializer");
    const getSharePayloadMock = vi.mocked(getSharePayload);

    getSharePayloadMock.mockResolvedValueOnce(null);

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ token: "missing" }),
    });

    expect(response.status).toBe(404);
  });
});
