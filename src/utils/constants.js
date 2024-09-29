// src/utils/constants.js

const CORS_PROXY_PROXY = process.env.REACT_APP_CORS_PROXY || ""; // Optional for CORS proxy
const URL_API_DEEZER = `${process.env.REACT_APP_API_URL}track/`;
const URL_SEARCH_API = `${process.env.REACT_APP_API_URL}search?q=`;

export const endPoints = {
  CORS_PROXY_PROXY,
  URL_API_DEEZER,
  URL_SEARCH_API,
};
