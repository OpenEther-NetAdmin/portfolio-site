/**
 * BGP Input Form Component
 */
import React from 'react';

interface BGPInputFormProps {
  asPath: string;
  isIPv4: boolean;
  error: string | null;
  onAsPathChange: (value: string) => void;
  onIsIPv4Change: (value: boolean) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

const BGPInputForm: React.FC<BGPInputFormProps> = ({
  asPath,
  isIPv4,
  error,
  onAsPathChange,
  onIsIPv4Change,
  onAnalyze,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* AS_PATH Input */}
      <div>
        <label htmlFor="as-path" className="block text-sm font-medium text-slate-300 mb-2">
          AS_PATH (space-separated ASNs)
        </label>
        <textarea
          id="as-path"
          value={asPath}
          onChange={(e) => onAsPathChange(e.target.value)}
          placeholder="e.g., 174 3356 1299 15133"
          rows={3}
          className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors font-mono text-sm ${
            error ? 'border-red-500' : 'border-slate-600'
          }`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          Supports: Simple paths (100 200 300), AS_SETs ({'{'}300 400{'}'}), ASDOT notation (1.1000)
        </p>
      </div>

      {/* IP Version Toggle */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          IP Version
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="ip-version"
              checked={isIPv4}
              onChange={() => onIsIPv4Change(true)}
              className="mr-2 accent-cyan-500"
            />
            <span className="text-slate-300">IPv4</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="ip-version"
              checked={!isIPv4}
              onChange={() => onIsIPv4Change(false)}
              className="mr-2 accent-cyan-500"
            />
            <span className="text-slate-300">IPv6</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={!asPath.trim()}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            asPath.trim()
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          Analyze AS_PATH
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default BGPInputForm;
