export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "Not specified";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(formatValue).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${key.replace(/([A-Z])/g, " $1")}: ${formatValue(item)}`)
      .join("; ");
  }
  return String(value);
};

export const toList = (value: unknown): string[] => {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value)) return value.flatMap(toList);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([key, item]) => `${key.replace(/([A-Z])/g, " $1")}: ${formatValue(item)}`);
  }
  return [String(value)];
};
