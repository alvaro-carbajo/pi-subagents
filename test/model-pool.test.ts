import { describe, expect, it } from "vitest";
import { checkModelPool } from "../src/model-pool.js";

const models = [
  { provider: "github-copilot", id: "gpt-5.3-codex", name: "GPT-5.3-Codex" },
  { provider: "dbs", id: "system.ai.claude-sonnet-5", name: "Claude Sonnet 5" },
  { provider: "github-copilot", id: "gpt-5.6-terra", name: "GPT-5.6 Terra" },
];
const registry = {
  getAll: () => models,
  find: (provider: string, id: string) => models.find((model) => model.provider === provider && model.id === id),
};

const pool = ["github-copilot/gpt-5.3-codex", "dbs/system.ai.claude-sonnet-5"];

describe("checkModelPool", () => {
  it("allows a caller to choose a configured model", () => {
    expect(checkModelPool(pool, "dbs/system.ai.claude-sonnet-5", registry as never)).toBeUndefined();
  });

  it("rejects a caller-selected model outside the pool", () => {
    expect(checkModelPool(pool, "github-copilot/gpt-5.6-terra", registry as never))
      .toContain("not in this agent's model_pool");
  });
});
