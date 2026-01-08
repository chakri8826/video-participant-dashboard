import { useState, useEffect, useCallback } from 'react';
import { participantsService } from '../services/participants.service';

export function useParticipants(searchQuery = '') {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParticipants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await participantsService.getAll(searchQuery);
      setParticipants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch participants');
      console.error('Error fetching participants:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const updateParticipant = useCallback((updatedParticipant) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === updatedParticipant.id.toString()
          ? { ...p, ...updatedParticipant }
          : p
      )
    );
  }, []);

  return {
    participants,
    isLoading,
    error,
    refetch: fetchParticipants,
    updateParticipant,
  };
}

