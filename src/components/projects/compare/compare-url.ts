export interface CompareState {
  dimension: string;
  a: string;
  b: string;
  metric: string;
}

export function compareHref(basePath: string, state: CompareState) {
  const params = new URLSearchParams();
  if (state.dimension) params.set("dimension", state.dimension);
  if (state.a) params.set("a", state.a);
  if (state.b) params.set("b", state.b);
  if (state.metric) params.set("metric", state.metric);
  return `${basePath}${params.size ? `?${params}` : ""}`;
}
