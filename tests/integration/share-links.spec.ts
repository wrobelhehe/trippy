import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/share/share-links", () => ({
  createShareLink: vi.fn(),
  rotateShareLink: vi.fn(),
}));

describe("Share link flow", () => {
  it("creates and rotates a share link", async () => {
    const { POST: createHandler } = await import("@/app/api/share-links/route");
    const { POST: rotateHandler } = await import(
      "@/app/api/share-links/[shareLinkId]/rotate/route"
    );
    const { createShareLink } = await import("@/lib/share/share-links");
    const { rotateShareLink } = await import("@/lib/share/share-links");

    const createShareLinkMock = vi.mocked(createShareLink);
    const rotateShareLinkMock = vi.mocked(rotateShareLink);

    createShareLinkMock.mockResolvedValueOnce({
      shareLink: {
        id: "share_flow",
        owner_id: "user_1",
        scope: "trip",
        trip_id: "trip_1",
        token_hash: "hash",
        privacy_overrides: {},
        created_at: new Date().toISOString(),
        revoked_at: null,
        expires_at: null,
      },
      token: "token_flow",
    });

    rotateShareLinkMock.mockResolvedValueOnce({
      shareLink: {
        id: "share_flow",
        owner_id: "user_1",
        scope: "trip",
        trip_id: "trip_1",
        token_hash: "hash",
        privacy_overrides: {},
        created_at: new Date().toISOString(),
        revoked_at: null,
        expires_at: null,
      },
      token: "token_rotated",
    });

    const createResponse = await createHandler(
      new Request("http://localhost/api/share-links", {
        method: "POST",
        body: JSON.stringify({ scope: "trip", tripId: "trip_1" }),
      })
    );
    const createBody = await createResponse.json();

    const rotateResponse = await rotateHandler(new Request("http://localhost"), {
      params: Promise.resolve({ shareLinkId: "share_flow" }),
    });
    const rotateBody = await rotateResponse.json();

    expect(createBody.token).toBe("token_flow");
    expect(rotateBody.token).toBe("token_rotated");
  });
});
