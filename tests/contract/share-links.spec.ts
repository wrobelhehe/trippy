import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/share/share-links", () => ({
  createShareLink: vi.fn(),
  revokeShareLink: vi.fn(),
  rotateShareLink: vi.fn(),
}));

describe("Share links API contract", () => {
  it("creates a share link", async () => {
    const { POST } = await import("@/app/api/share-links/route");
    const { createShareLink } = await import("@/lib/share/share-links");
    const createShareLinkMock = vi.mocked(createShareLink);

    createShareLinkMock.mockResolvedValueOnce({
      shareLink: {
        id: "share_1",
        owner_id: "user_1",
        scope: "trip",
        trip_id: "trip_1",
        token_hash: "hash",
        privacy_overrides: {},
        created_at: new Date().toISOString(),
        revoked_at: null,
        expires_at: null,
      },
      token: "token_1",
    });

    const response = await POST(
      new Request("http://localhost/api/share-links", {
        method: "POST",
        body: JSON.stringify({ scope: "trip", tripId: "trip_1" }),
      })
    );

    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.token).toBe("token_1");
  });

  it("revokes a share link", async () => {
    const { POST } = await import(
      "@/app/api/share-links/[shareLinkId]/revoke/route"
    );
    const { revokeShareLink } = await import("@/lib/share/share-links");
    const revokeShareLinkMock = vi.mocked(revokeShareLink);

    revokeShareLinkMock.mockResolvedValueOnce();

    const response = await POST(new Request("http://localhost"), {
      params: { shareLinkId: "share_1" },
    });

    const body = await response.json();
    expect(body.revoked).toBe(true);
  });

  it("rotates a share link", async () => {
    const { POST } = await import(
      "@/app/api/share-links/[shareLinkId]/rotate/route"
    );
    const { rotateShareLink } = await import("@/lib/share/share-links");
    const rotateShareLinkMock = vi.mocked(rotateShareLink);

    rotateShareLinkMock.mockResolvedValueOnce({
      shareLink: {
        id: "share_2",
        owner_id: "user_1",
        scope: "profile",
        trip_id: null,
        token_hash: "hash",
        privacy_overrides: {},
        created_at: new Date().toISOString(),
        revoked_at: null,
        expires_at: null,
      },
      token: "token_2",
    });

    const response = await POST(new Request("http://localhost"), {
      params: { shareLinkId: "share_2" },
    });

    const body = await response.json();
    expect(body.token).toBe("token_2");
  });
});