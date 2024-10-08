// src/utils/constants.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

export const endPoints = {
  URL_API_DEEZER: `${API_BASE_URL}track/`,  // Remove trailing slash
  URL_SEARCH_API: `${API_BASE_URL}search?q=`, // Remove trailing slash
};
