import { editorialDestinations } from "./editorial";
import { articlePaths } from "./articles";
import { helpPaths } from "./help-articles";

export const marketingPaths = new Set([
  ...Object.values(editorialDestinations).filter((path) => path.startsWith("/")),
  ...articlePaths,
  ...helpPaths,
  "/integrations"
]);
export function isPublicMarketingPath(path: string) {
  if (process.env.NODE_ENV === "development" && /^\/preview\/card-processing\/(gradient|dark|hybrid)$/.test(path))
    return true;
  return marketingPaths.has(path);
}
