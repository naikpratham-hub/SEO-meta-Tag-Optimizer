
import React, { useState, useEffect } from 'react';
import type { FormData } from '../types';

interface InputFormProps {
  onAnalyze: (formData: FormData) => void;
  isLoading: boolean;
}

const LOCAL_STORAGE_KEY = 'seo-meta-optimizer-form-data';

const defaultFormData: FormData = {
  url: '',
  currentTitle: '',
  currentDescription: '',
  keywords: '',
  industry: '',
};

const FormField: React.FC<{
  id: keyof FormData;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'input' | 'textarea';
  required?: boolean;
}> = ({ id, label, placeholder, value, onChange, type = 'input', required = true }) => {
  const commonProps = {
    id,
    name: id,
    placeholder,
    value,
    onChange,
    required,
    className: "block w-full px-4 py-2 mt-2 text-slate-700 bg-slate-50 border border-slate-200 rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-40 focus:outline-none focus:ring transition duration-150 ease-in-out",
  };

  return (
    <div>
      <label htmlFor={id} className="text-slate-700 font-semibold">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea {...commonProps} rows={4} />
      ) : (
        <input {...commonProps} type="text" />
      )}
    </div>
  );
};


export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Failed to parse saved form data from localStorage", error);
    }
    return defaultFormData;
  });

  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save form data to localStorage", error);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'url') {
      setFetchError(null);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFetchMetaTags = async () => {
    if (!formData.url) {
      setFetchError("Please enter a URL first.");
      return;
    }
    setIsFetchingMeta(true);
    setFetchError(null);
    try {
      let url = formData.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Using a CORS proxy to fetch URL content from the client-side.
      // allorigins.win is a free and open-source proxy.
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch URL content. Status: ${response.statusText}`);
      }
      const htmlText = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const title = doc.querySelector('title')?.innerText || '';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      if (!title && !description) {
        setFetchError("Could not find meta title or description on the page.");
      }
      
      setFormData(prev => ({
        ...prev,
        currentTitle: title,
        currentDescription: description,
      }));

    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "An unknown error occurred while fetching tags.");
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setFetchError(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove form data from localStorage", error);
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="url" className="text-slate-700 font-semibold">
          URL
        </label>
        <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-2">
          <input
            id="url"
            name="url"
            placeholder="https://example.com/page"
            value={formData.url}
            onChange={handleChange}
            required
            className="block w-full px-4 py-2 text-slate-700 bg-slate-50 border border-slate-200 rounded-md focus:border-indigo-400 focus:ring-indigo-300 focus:ring-opacity-40 focus:outline-none focus:ring transition duration-150 ease-in-out"
            aria-describedby="fetch-error"
          />
          <button
            type="button"
            onClick={handleFetchMetaTags}
            disabled={isFetchingMeta || isLoading || !formData.url}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 transform bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isFetchingMeta ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Fetch
              </>
            )}
          </button>
        </div>
        {fetchError && <p id="fetch-error" className="text-red-500 text-sm mt-1">{fetchError}</p>}
      </div>

      <FormField id="currentTitle" label="Current Meta Title" placeholder="Your current page title" value={formData.currentTitle} onChange={handleChange} />
      <FormField id="currentDescription" label="Current Meta Description" placeholder="Your current page description" value={formData.currentDescription} onChange={handleChange} type="textarea" />
      <FormField id="keywords" label="Target Keywords" placeholder="e.g., seo tools, meta tags, rank checker" value={formData.keywords} onChange={handleChange} />
      <FormField id="industry" label="Industry / Business Type" placeholder="e.g., E-commerce, SaaS, Local Bakery" value={formData.industry} onChange={handleChange} />
      
      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
        <button 
          type="submit" 
          disabled={isLoading || isFetchingMeta} 
          className="w-full sm:flex-grow flex justify-center items-center gap-2 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Optimize My Tags'
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading || isFetchingMeta}
          title="Clear form and saved data"
          aria-label="Reset form"
          className="w-full sm:w-auto flex-shrink-0 p-3 text-slate-500 transition-colors duration-200 bg-slate-100 rounded-md hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </form>
  );
};
