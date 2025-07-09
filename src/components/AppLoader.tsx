
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface AppLoaderProps {
  onLoadingComplete: () => void;
}

const AppLoader = ({ onLoadingComplete }: AppLoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 200);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950 flex items-center justify-center">
      <div className="text-center space-y-8 px-6">
        {/* App Logo/Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl animate-pulse">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-emerald-400 opacity-20 blur-xl animate-pulse"></div>
        </div>

        {/* App Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
            Notes
          </h1>
          <p className="text-gray-400 text-lg">Your thoughts, organized</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-full mx-auto space-y-4">
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-2 bg-gray-800 border border-gray-700"
            />
            {/* Glow effect for progress bar */}
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full blur-sm opacity-60 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Loading text */}
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm">Loading your notes...</span>
          </div>
        </div>

        {/* Version or additional info */}
        <div className="text-xs text-gray-600">
          v1.0.0
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
