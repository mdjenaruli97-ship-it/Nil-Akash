import React from 'react';
import { X, Download } from 'lucide-react';

interface MediaViewerModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 md:p-8 animate-in fade-in"
      onClick={onClose}
    >
      <div className="w-full flex items-center justify-between max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <span className="text-white text-sm font-medium">Image Preview</span>
        <div className="flex items-center gap-2">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 max-w-5xl my-auto" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Full Preview"
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
};
