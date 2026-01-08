import apiClient from './client';
import { PARTICIPANT_ENDPOINTS } from './endpoints';

export async function fetchParticipants(searchQuery = '') {
  const params = searchQuery ? { search: searchQuery } : {};
  return apiClient.get(PARTICIPANT_ENDPOINTS.LIST, { params });
}

export async function fetchParticipantById(id) {
  return apiClient.get(PARTICIPANT_ENDPOINTS.BY_ID(id));
}

export async function updateParticipantMic(id, micOn) {
  return apiClient.patch(PARTICIPANT_ENDPOINTS.UPDATE_MIC(id), {
    mic_on: micOn,
  });
}

export async function updateParticipantCamera(id, cameraOn) {
  return apiClient.patch(PARTICIPANT_ENDPOINTS.UPDATE_CAMERA(id), {
    camera_on: cameraOn,
  });
}

export async function updateParticipantStatus(id, isOnline) {
  return apiClient.patch(PARTICIPANT_ENDPOINTS.UPDATE_STATUS(id), {
    is_online: isOnline,
  });
}

