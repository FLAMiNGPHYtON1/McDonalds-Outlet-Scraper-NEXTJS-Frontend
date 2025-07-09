export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  scrapeAndSave: '/save-outlets',
  outlets: `/outlets`,
  deleteAllOutlets: '/outlets',
  aiSearch: '/api/v1/search',
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [3.1390, 101.6869], // Kuala Lumpur, Malaysia
  DEFAULT_ZOOM: 11,
  MAX_OUTLETS_PER_REQUEST: 1000
};

// UI Configuration
export const UI_CONFIG = {
  LOADING_SPINNER_SIZE: 'h-12 w-12',
  DEFAULT_PAGINATION: {
    PAGE: 1,
    PER_PAGE: 50
  }
}; 