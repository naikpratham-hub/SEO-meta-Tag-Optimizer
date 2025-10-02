
import React from 'react';

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
             <div className="bg-indigo-100 p-2 rounded-lg">
                <SparklesIcon />
             </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">SEO Meta Tag Optimizer</h1>
                <p className="text-sm text-slate-500">AI-powered analysis & generation for peak search performance.</p>
            </div>
        </div>
    </header>
  );
};
