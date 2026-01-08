import { useCallback } from 'react';
import { participantsService } from '../services/participants.service';

export function useMediaControls(updateParticipant) {
  const toggleMic = useCallback(
    async (participantId, currentParticipants) => {
      try {
        const participant = currentParticipants?.find(
          (p) => p.id === participantId.toString()
        );
        
        if (!participant) {
          throw new Error('Participant not found');
        }

        const newMicState = !participant.isMicOn;
        const updated = await participantsService.updateMic(
          participantId,
          newMicState
        );

        if (updateParticipant) {
          updateParticipant(updated);
        }

        return updated;
      } catch (error) {
        console.error('Error toggling mic:', error);
        throw error;
      }
    },
    [updateParticipant]
  );

  const toggleCamera = useCallback(
    async (participantId, currentParticipants) => {
      try {
        const participant = currentParticipants?.find(
          (p) => p.id === participantId.toString()
        );
        
        if (!participant) {
          throw new Error('Participant not found');
        }

        const newCameraState = !participant.isCameraOn;
        const updated = await participantsService.updateCamera(
          participantId,
          newCameraState
        );

        if (updateParticipant) {
          updateParticipant(updated);
        }

        return updated;
      } catch (error) {
        console.error('Error toggling camera:', error);
        throw error;
      }
    },
    [updateParticipant]
  );

  const toggleStatus = useCallback(
    async (participantId, isOnline) => {
      try {
        const updated = await participantsService.updateStatus(
          participantId,
          isOnline
        );

        if (updateParticipant) {
          updateParticipant(updated);
        }

        return updated;
      } catch (error) {
        console.error('Error toggling status:', error);
        throw error;
      }
    },
    [updateParticipant]
  );

  return {
    toggleMic,
    toggleCamera,
    toggleStatus,
  };
}

