export const PARTICIPANT_ENDPOINTS = {
  LIST: '/participants',
  BY_ID: (id) => `/participants/${id}`,
  UPDATE_MIC: (id) => `/participants/${id}/mic`,
  UPDATE_CAMERA: (id) => `/participants/${id}/camera`,
  UPDATE_STATUS: (id) => `/participants/${id}/status`,
};