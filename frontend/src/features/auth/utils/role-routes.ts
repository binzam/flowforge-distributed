export const getHomeRouteForRole = (role: string | undefined): string =>
  role === "admin" || role === "warehouse" ? "/portal" : "/";
