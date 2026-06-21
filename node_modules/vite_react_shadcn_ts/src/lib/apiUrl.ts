export const getApiUrl = (path: string): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}${path}`;
  }

  // Safe checks for window availability
  if (typeof window !== "undefined") {
    const isCapacitor = window.location.protocol.startsWith("cap");
    const isDevPort = window.location.port === "8080" || window.location.port === "5173";
    
    if (isCapacitor || (!isDevPort && window.location.hostname !== "localhost")) {
      // In native apps or deployed web previews, default to the local node server
      return `http://localhost:5000${path}`;
    }
  }

  return path;
};
