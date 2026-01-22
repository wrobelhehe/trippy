import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/share/serializer", () => ({
  getSharePayload: vi.fn(),
}));

vi.mock("@/lib/share/rate-limit", () => ({
  checkShareRateLimit: vi.fn(),
}));

describe("Guest share view", () => {
  it("returns payload when allowed", async () => {
    const { GET } = await import("@/app/api/share/[token]/route");
    const { getSharePayload } = await import("@/lib/share/serializer");
    const { checkShareRateLimit } = await import("@/lib/share/rate-limit");

    vi.mocked(checkShareRateLimit).mockReturnValueOnce({
      allowed: true,
      remaining: 5,
      resetAt: Date.now() + 60_000,
    });

    vi.mocked(getSharePayload).mockResolvedValueOnce({
      scope: "profile",
      share_link_id: "share_profile",
      privacy: { hide_exact_dates: true, allow_downloads: false },
      owner: {
        id: "user_1",
        display_name: "Nova",
        avatar_url: null,
        bio: "Traveler",
      },
      trips: [],
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ token: "token_profile" }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.scope).toBe("profile");
  });

  it("throttles excessive requests", async () => {
    const { GET } = await import("@/app/api/share/[token]/route");
    const { checkShareRateLimit } = await import("@/lib/share/rate-limit");

    vi.mocked(checkShareRateLimit).mockReturnValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 60_000,
      retryAfter: 60,
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ token: "token_limited" }),
    });

    expect(response.status).toBe(429);
  });
});
