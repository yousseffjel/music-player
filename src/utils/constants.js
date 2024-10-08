// API base URL for making requests to Deezer
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";  // Default to /api if REACT_APP_API_URL is not set

// Endpoints for the Deezer API
export const endPoints = {
  URL_API_DEEZER: `${API_BASE_URL}track/`,  // Endpoint for fetching individual tracks
  URL_SEARCH_API: `${API_BASE_URL}search?q=`,  // Endpoint for searching tracks by query
};
