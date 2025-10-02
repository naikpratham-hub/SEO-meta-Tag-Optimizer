
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="mt-4 text-lg font-semibold text-slate-600">Generating Analysis...</p>
      <p className="text-sm text-slate-500">The AI is working its magic!</p>
    </div>
  );
};
