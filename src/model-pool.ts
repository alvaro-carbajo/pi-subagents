import { resolveModel } from "./model-resolver.js";

type ModelRegistry = Parameters<typeof resolveModel>[1];

/** Reject a caller-selected model that is outside an agent's declared pool. */
export function checkModelPool(
  pool: string[] | undefined,
  requested: string | undefined,
  registry: ModelRegistry,
): string | undefined {
  if (!pool?.length || requested === undefined) return undefined;

  const selected = resolveModel(requested, registry);
  if (typeof selected === "string") return selected;

  const allowed = pool.some((entry) => {
    const resolved = resolveModel(entry, registry);
    return typeof resolved !== "string"
      && resolved.provider === selected.provider
      && resolved.id === selected.id;
  });
  if (allowed) return undefined;

  return `Model "${requested}" is not in this agent's model_pool. Allowed: ${pool.join(", ")}.`;
}
