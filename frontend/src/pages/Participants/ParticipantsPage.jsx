import { Search, Users, Loader2, AlertCircle } from 'lucide-react';
import { ParticipantCard } from '../../components/ParticipantCard';
import { ParticipantModal } from '../../components/ParticipantModal';

export default function ParticipantsPage({
  searchQuery,
  participants,
  filteredParticipants,
  stats,
  isLoading,
  error,
  selectedParticipant,
  onSearchChange,
  onToggleMic,
  onToggleCamera,
  onToggleStatus,
  onViewDetails,
  onCloseModal,
  onClearSearch,
}) {
  if (isLoading && participants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading participants...</p>
        </div>
      </div>
    );
  }

  if (error && participants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Participants
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Video Call Participants
            </h1>
          </div>
          <p className="text-gray-600 ml-[60px]">
            Manage and monitor all participants in the call
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search participants by name..."
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Participants</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Online Now</p>
            <p className="text-2xl font-semibold text-green-600">{stats.online}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Camera Active</p>
            <p className="text-2xl font-semibold text-blue-600">
              {stats.cameraActive}
            </p>
          </div>
        </div>

        {error && participants.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          </div>
        )}

        {filteredParticipants.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No participants found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No participants match "${searchQuery}". Try a different search.`
                : 'No participants are currently in the call.'}
            </p>
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {filteredParticipants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredParticipants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                onToggleMic={onToggleMic}
                onToggleCamera={onToggleCamera}
                onToggleStatus={onToggleStatus}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {selectedParticipant && (
        <ParticipantModal
          participant={selectedParticipant}
          onClose={onCloseModal}
          onToggleMic={onToggleMic}
          onToggleCamera={onToggleCamera}
          onToggleStatus={onToggleStatus}
        />
      )}
    </div>
  );
}

