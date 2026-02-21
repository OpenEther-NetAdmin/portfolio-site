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
        <label htmlFor="as-path" className="block text-sm font-medium text-textMuted mb-2">
          AS_PATH (space-separated ASNs)
        </label>
        <textarea
          id="as-path"
          value={asPath}
          onChange={(e) => onAsPathChange(e.target.value)}
          placeholder="e.g., 174 3356 1299 15133"
          rows={3}
          className={`w-full px-4 py-2 bg-surface border rounded-lg text-text placeholder-textMuted/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors font-mono text-sm ${
            error ? 'border-red-500' : 'border-white/5'
          }`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        <p className="mt-2 text-sm text-textMuted/60">
          Supports: Simple paths (100 200 300), AS_SETs ({'{'}300 400{'}'}), ASDOT notation (1.1000)
        </p>
      </div>

      {/* IP Version Toggle */}
      <div>
        <label className="block text-sm font-medium text-textMuted mb-2">
          IP Version
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="ip-version"
              checked={isIPv4}
              onChange={() => onIsIPv4Change(true)}
              className="mr-2 accent-primary"
            />
            <span className="text-textMuted">IPv4</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="ip-version"
              checked={!isIPv4}
              onChange={() => onIsIPv4Change(false)}
              className="mr-2 accent-primary"
            />
            <span className="text-textMuted">IPv6</span>
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
              ? 'bg-primary hover:bg-primaryHover text-background'
              : 'bg-surface text-textMuted cursor-not-allowed'
          }`}
        >
          Analyze AS_PATH
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-surface hover:bg-surface/80 text-text rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default BGPInputForm;
