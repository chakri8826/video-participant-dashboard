import { Mic, MicOff, Video, VideoOff, Eye, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

export function ParticipantCard({
  participant,
  onToggleMic,
  onToggleCamera,
  onToggleStatus,
  onViewDetails,
}) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleToggleMic = (e) => {
    e.stopPropagation();
    onToggleMic(participant.id);
  };

  const handleToggleCamera = (e) => {
    e.stopPropagation();
    onToggleCamera(participant.id);
  };

  const handleToggleStatus = (e) => {
    e.stopPropagation();
    onToggleStatus(participant.id);
  };

  const handleViewDetails = () => {
    onViewDetails(participant);
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg',
        !participant.isOnline && 'opacity-60'
      )}
      onClick={handleViewDetails}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl overflow-hidden">
          {participant.isCameraOn ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-white text-sm font-medium">
                {participant.name}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="h-20 w-20">
                {participant.avatarUrl ? (
                  <AvatarImage src={participant.avatarUrl} alt={participant.name} />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {getInitials(participant.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          )}

          <div className="absolute top-2 right-2">
            <div
              className={cn(
                'h-3 w-3 rounded-full border-2 border-white',
                participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
              )}
            />
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            <Button
              size="icon"
              variant={participant.isOnline ? 'default' : 'destructive'}
              onClick={handleToggleStatus}
              className="h-8 w-8"
              aria-label={participant.isOnline ? 'Set offline' : 'Set online'}
            >
              {participant.isOnline ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant={participant.isMicOn ? 'default' : 'destructive'}
              onClick={handleToggleMic}
              className="h-8 w-8"
              aria-label={participant.isMicOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {participant.isMicOn ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant={participant.isCameraOn ? 'default' : 'destructive'}
              onClick={handleToggleCamera}
              className="h-8 w-8"
              aria-label={participant.isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {participant.isCameraOn ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{participant.name}</h3>
              <p className="text-sm text-gray-600 truncate">{participant.email}</p>
            </div>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {participant.role}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className={cn(participant.isOnline ? 'text-green-600' : 'text-gray-400')}>
              {participant.isOnline ? 'Online' : 'Offline'}
            </span>
            <span>•</span>
            <span className={cn(participant.isMicOn ? 'text-green-600' : 'text-gray-400')}>
              Mic {participant.isMicOn ? 'On' : 'Off'}
            </span>
            <span>•</span>
            <span className={cn(participant.isCameraOn ? 'text-green-600' : 'text-gray-400')}>
              Camera {participant.isCameraOn ? 'On' : 'Off'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

