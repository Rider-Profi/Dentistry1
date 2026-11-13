import { describe, expect, it, vi } from "vitest";
import { withRetry } from "@/lib/retry";

describe("withRetry", () => {
  it("returns after a transient failure", async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValue("ok");
    await expect(withRetry(operation, [0])).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("throws after all attempts", async () => {
    const operation = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(withRetry(operation, [0, 0])).rejects.toThrow("offline");
    expect(operation).toHaveBeenCalledTimes(3);
  });
});
