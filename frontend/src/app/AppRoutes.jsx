import { Routes, Route } from 'react-router-dom';
import { ParticipantsContainer } from '../pages/Participants/ParticipantsContainer';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ParticipantsContainer />} />
    </Routes>
  );
}

