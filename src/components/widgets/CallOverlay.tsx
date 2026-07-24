import React, { useState, useEffect, useRef } from 'react';
import { CallType, UserModel } from '../../types';
import { Avatar } from './Avatar';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

interface CallOverlayProps {
  targetUser: UserModel;
  callType: CallType;
  onEndCall: (durationSeconds: number) => void;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
  targetUser,
  callType,
  onEndCall,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web camera setup if video enabled
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isVideoOn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Fallback if camera denied or unavailable
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isVideoOn]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white rounded-2xl p-3 shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
        <Avatar src={targetUser.avatar} name={targetUser.name} size="sm" showStatus={false} />
        <div>
          <p className="text-xs font-semibold">{targetUser.name}</p>
          <p className="text-[10px] text-emerald-400 font-mono">{formatDuration(callDuration)}</p>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEndCall(callDuration)}
          className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md text-white flex flex-col justify-between p-6 md:p-10 animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-medium text-emerald-400 font-mono">
            {formatDuration(callDuration)}
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200"
          title="Minimize Call"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Video / Avatar Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-6">
        {isVideoOn ? (
          <div className="relative w-full max-w-2xl h-[400px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
            {/* Small Overlay Picture-in-Picture for remote caller */}
            <div className="absolute top-4 right-4 w-32 h-44 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-700 bg-slate-800 flex flex-col items-center justify-center">
              <Avatar src={targetUser.avatar} name={targetUser.name} size="lg" showStatus={false} />
              <span className="text-xs font-medium mt-2 px-2 truncate w-full text-center">
                {targetUser.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center animate-in zoom-in-95">
            <div className="relative mb-6">
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
              <Avatar src={targetUser.avatar} name={targetUser.name} size="xl" showStatus={false} />
            </div>
            <h2 className="text-2xl font-bold">{targetUser.name}</h2>
            <p className="text-sm text-slate-400 mt-1">
              {callType === 'video' ? 'Video Call' : 'Audio Call'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto w-full pb-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full transition-all ${
            isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-4 rounded-full transition-all ${
            !isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-indigo-600 text-white'
          }`}
          title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isVideoOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`p-4 rounded-full transition-all ${
            !isSpeakerOn ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-700 text-white'
          }`}
          title={isSpeakerOn ? 'Mute Speaker' : 'Speaker On'}
        >
          {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        <button
          onClick={() => onEndCall(callDuration)}
          className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-95"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
