import { useState, useMemo } from 'react';
import { useParticipants } from '../../hooks/useParticipants';
import { useMediaControls } from '../../hooks/useMediaControls';
import { debounce } from '../../utils/debounce';
import { participantsService } from '../../services/participants.service';
import ParticipantsPage from './ParticipantsPage';

export function ParticipantsContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearchQuery(value);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const { participants, isLoading, error, updateParticipant } = useParticipants(
    debouncedSearchQuery
  );

  const { toggleMic, toggleCamera, toggleStatus } = useMediaControls(updateParticipant);

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;

    return participants.filter((participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [participants, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: participants.length,
      online: participants.filter((p) => p.isOnline).length,
      cameraActive: participants.filter((p) => p.isCameraOn).length,
    };
  }, [participants]);

  const handleToggleMic = async (id) => {
    try {
      const updated = await toggleMic(id, participants);
      if (selectedParticipant?.id === id) {
        setSelectedParticipant(updated);
      }
    } catch (error) {
      console.error('Failed to toggle mic:', error);
    }
  };

  const handleToggleCamera = async (id) => {
    try {
      const updated = await toggleCamera(id, participants);
      if (selectedParticipant?.id === id) {
        setSelectedParticipant(updated);
      }
    } catch (error) {
      console.error('Failed to toggle camera:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const participant = participants.find((p) => p.id === id.toString());
      if (!participant) {
        throw new Error('Participant not found');
      }
      const newStatus = !participant.isOnline;
      const updated = await toggleStatus(id, newStatus);
      if (selectedParticipant?.id === id) {
        setSelectedParticipant(updated);
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleViewDetails = async (participant) => {
    setSelectedParticipant(participant);
    try {
      const fresh = await participantsService.getById(participant.id);
      setSelectedParticipant(fresh);
    } catch (error) {
      console.error('Failed to fetch participant details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedParticipant(null);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

  return (
    <ParticipantsPage
      searchQuery={searchQuery}
      participants={participants}
      filteredParticipants={filteredParticipants}
      stats={stats}
      isLoading={isLoading}
      error={error}
      selectedParticipant={selectedParticipant}
      onSearchChange={handleSearchChange}
      onToggleMic={handleToggleMic}
      onToggleCamera={handleToggleCamera}
      onToggleStatus={handleToggleStatus}
      onViewDetails={handleViewDetails}
      onCloseModal={handleCloseModal}
      onClearSearch={handleClearSearch}
    />
  );
}

