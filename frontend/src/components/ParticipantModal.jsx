import { X, Mic, MicOff, Video, VideoOff, Mail, User, Clock, Wifi, WifiOff } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { cn } from '../utils/cn';

export function ParticipantModal({
  participant,
  onClose,
  onToggleMic,
  onToggleCamera,
  onToggleStatus,
}) {
  if (!participant) return null;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleToggleMic = () => {
    onToggleMic(participant.id);
  };

  const handleToggleCamera = () => {
    onToggleCamera(participant.id);
  };

  const handleToggleStatus = () => {
    onToggleStatus(participant.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="pr-8">Participant Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden">
            {participant.isCameraOn ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-white text-2xl font-medium">
                  {participant.name}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="h-32 w-32">
                  {participant.avatarUrl ? (
                    <AvatarImage src={participant.avatarUrl} alt={participant.name} />
                  ) : (
                    <AvatarFallback className="bg-blue-500 text-white text-4xl">
                      {getInitials(participant.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            )}

            <div className="absolute top-4 right-4">
              <Badge
                variant={participant.isOnline ? 'default' : 'secondary'}
                className="flex items-center gap-2"
              >
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  )}
                />
                {participant.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{participant.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{participant.role}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{participant.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-sm font-medium text-gray-900">{participant.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Media Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant={participant.isOnline ? 'default' : 'destructive'}
                size="lg"
                onClick={handleToggleStatus}
                className="flex-1"
              >
                {participant.isOnline ? (
                  <>
                    <Wifi className="h-5 w-5 mr-2" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-5 w-5 mr-2" />
                    Offline
                  </>
                )}
              </Button>
              <Button
                variant={participant.isMicOn ? 'default' : 'destructive'}
                size="lg"
                onClick={handleToggleMic}
                className="flex-1"
              >
                {participant.isMicOn ? (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Microphone On
                  </>
                ) : (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Microphone Off
                  </>
                )}
              </Button>
              <Button
                variant={participant.isCameraOn ? 'default' : 'destructive'}
                size="lg"
                onClick={handleToggleCamera}
                className="flex-1"
              >
                {participant.isCameraOn ? (
                  <>
                    <Video className="h-5 w-5 mr-2" />
                    Camera On
                  </>
                ) : (
                  <>
                    <VideoOff className="h-5 w-5 mr-2" />
                    Camera Off
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {formatDate(participant.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

