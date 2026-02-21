/**
 * BGP Looking Glass App
 * Main React component for BGP AS_PATH analysis
 */
import React, { useState, useCallback } from 'react';
import { BGPParser, type BGPPathAnalysis } from '../../../lib/network/bgp';
import { useCalculationHistory, type HistoryEntry } from '../../../hooks/useCalculationHistory';
import BGPInputForm from './BGPInputForm';
import BGPResults from './BGPResults';
import ASPathVisualization from './ASPathVisualization';

interface BGPFormData {
  asPath: string;
  isIPv4: boolean;
}

const BGPLookingGlassApp: React.FC = () => {
  // Form state
  const [asPath, setAsPath] = useState('174 3356 1299');
  const [isIPv4, setIsIPv4] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Analysis result state
  const [result, setResult] = useState<BGPPathAnalysis | null>(null);

  // History management
  const { history, addEntry, clearHistory } = useCalculationHistory<BGPFormData, BGPPathAnalysis>(
    'bgp-looking-glass-history'
  );

  // Analyze AS_PATH
  const handleAnalyze = useCallback(() => {
    setError(null);
    
    try {
      const analysis = BGPParser.analyzeASPath(asPath, isIPv4);
      setResult(analysis);
      
      // Add to history
      addEntry({
        input: { asPath, isIPv4 },
        result: analysis,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse AS_PATH');
      setResult(null);
    }
  }, [asPath, isIPv4, addEntry]);

  // Load from history
  const handleLoadFromHistory = useCallback((entry: HistoryEntry<BGPFormData, BGPPathAnalysis>) => {
    setAsPath(entry.input.asPath);
    setIsIPv4(entry.input.isIPv4);
    setResult(entry.result);
    setError(null);
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setAsPath('174 3356 1299');
    setIsIPv4(true);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="bgp-looking-glass-app space-y-6">
      {/* Input Form */}
      <div className="bg-surface rounded-lg p-6 border border-white/5">
        <h2 className="text-xl font-semibold text-text mb-4">
          BGP Looking Glass
        </h2>
        <BGPInputForm
          asPath={asPath}
          isIPv4={isIPv4}
          error={error}
          onAsPathChange={setAsPath}
          onIsIPv4Change={setIsIPv4}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
        />
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="bg-surface rounded-lg p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-text mb-4">
              AS_PATH Analysis
            </h3>
            <BGPResults result={result} />
          </div>

          {/* AS Path Visualization */}
          <div className="bg-surface rounded-lg p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-text mb-4">
              AS Path Visualization
            </h3>
            <ASPathVisualization asns={result.asPath.asns} />
          </div>
        </>
      )}

      {/* History Panel */}
      {history.length > 0 && (
        <div className="bg-surface rounded-lg p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text">
              Analysis History
            </h3>
            <button
              onClick={clearHistory}
              className="text-sm text-textMuted hover:text-text transition-colors"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice(0, 10).map((entry) => (
              <button
                key={entry.id}
                onClick={() => handleLoadFromHistory(entry)}
                className="w-full text-left p-3 bg-surface/80 rounded hover:bg-surface transition-colors"
              >
                <span className="text-primary font-mono text-sm">
                  {entry.input.asPath}
                </span>
                <span className="text-textMuted text-sm ml-2">
                  ({entry.result.asnCount} ASNs)
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BGPLookingGlassApp;
