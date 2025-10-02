
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader } from './Loader';

interface AnalysisDisplayProps {
  isLoading: boolean;
  analysisResult: string | null;
  error: string | null;
}

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-slate-700">Analysis Results</h3>
        <p className="mt-1">Fill out the form to generate your optimized meta tags.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 p-6 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold">An Error Occurred</h3>
        <p className="mt-1 text-sm">{message}</p>
    </div>
);

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ isLoading, analysisResult, error }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!analysisResult) {
    return <Placeholder />;
  }

  return (
    <div className="prose prose-slate max-w-none prose-h3:text-indigo-600 prose-h3:font-semibold prose-h3:border-b prose-h3:pb-2 prose-h3:mb-4 prose-strong:text-slate-800 prose-strong:font-semibold">
      <ReactMarkdown>
        {analysisResult}
      </ReactMarkdown>
    </div>
  );
};
