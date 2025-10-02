
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { UsageExample } from './components/UsageExample';
import { generateMetaTagAnalysis } from './services/geminiService';
import type { FormData } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisRequest = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await generateMetaTagAnalysis(formData);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/50 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200/80">
            <InputForm onAnalyze={handleAnalysisRequest} isLoading={isLoading} />
          </div>

          <UsageExample />

          {(isLoading || analysisResult || error) && (
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200/80 min-h-[24rem]">
              <AnalysisDisplay
                isLoading={isLoading}
                analysisResult={analysisResult}
                error={error}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
