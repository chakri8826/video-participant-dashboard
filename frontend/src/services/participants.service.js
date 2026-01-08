import * as participantsApi from '../api/participants.api';

function transformParticipant(backendData) {
  if (!backendData) {
    return null;
  }

  return {
    id: backendData.id.toString(),
    name: backendData.name,
    email: backendData.email,
    role: backendData.role,
    avatarUrl: backendData.avatar_url || null,
    isOnline: backendData.is_online ?? false,
    isCameraOn: backendData.camera_on ?? false,
    isMicOn: backendData.mic_on ?? false,
    createdAt: backendData.created_at,
    updatedAt: backendData.updated_at,
  };
}

function transformParticipants(backendDataArray) {
  if (!Array.isArray(backendDataArray)) {
    return [];
  }
  return backendDataArray.map(transformParticipant);
}

function extractErrorMessage(error, defaultMessage) {
  if (error.response) {
    if (error.response.status === 404) {
      return 'Participant not found';
    }
    if (error.response.status === 400) {
      return error.response.data?.detail || 'Invalid request';
    }
    if (error.response.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.response.data?.detail || defaultMessage;
  }

  if (error.request) {
    return 'Network error. Please check your connection.';
  }

  return error.message || defaultMessage;
}

export const participantsService = {
  async getAll(searchQuery = '') {
    try {
      const response = await participantsApi.fetchParticipants(searchQuery);
      return transformParticipants(response.data);
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to fetch participants');
      throw new Error(message);
    }
  },

  async getById(id) {
    try {
      const response = await participantsApi.fetchParticipantById(id);
      return transformParticipant(response.data);
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to fetch participant');
      throw new Error(message);
    }
  },

  async updateMic(id, micOn) {
    try {
      const response = await participantsApi.updateParticipantMic(id, micOn);
      return transformParticipant(response.data);
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to update microphone state');
      throw new Error(message);
    }
  },

  async updateCamera(id, cameraOn) {
    try {
      const response = await participantsApi.updateParticipantCamera(id, cameraOn);
      return transformParticipant(response.data);
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to update camera state');
      throw new Error(message);
    }
  },

  async updateStatus(id, isOnline) {
    try {
      const response = await participantsApi.updateParticipantStatus(id, isOnline);
      return transformParticipant(response.data);
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to update online status');
      throw new Error(message);
    }
  },
};

