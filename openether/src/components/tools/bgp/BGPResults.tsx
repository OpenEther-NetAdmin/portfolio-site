/**
 * BGP Results Component
 */
import React from 'react';
import type { BGPPathAnalysis } from '../../../lib/network/bgp';

interface BGPResultsProps {
  result: BGPPathAnalysis;
}

const BGPResults: React.FC<BGPResultsProps> = ({ result }) => {
  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="AS Path Length" value={result.asPathLength.toString()} />
        <StatCard label="Unique ASNs" value={result.asnCount.toString()} />
        <StatCard label="Origin AS" value={result.originAS ? `AS${result.originAS}` : 'N/A'} highlight />
        <StatCard label="Neighbor AS" value={result.neighborAS ? `AS${result.neighborAS}` : 'N/A'} />
      </div>

      {/* AS Path Display */}
      <div className="p-4 bg-surface/80 rounded-lg border border-white/5">
        <div className="text-sm text-textMuted mb-2">AS_PATH</div>
        <div className="font-mono text-primary text-sm break-all">
          {result.pathString}
        </div>
      </div>

      {/* Segments */}
      {result.segments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text mb-2">Path Segments</h4>
          <div className="space-y-2">
            {result.segments.map((segment, index) => (
              <div key={index} className="p-3 bg-surface/80 rounded-lg border border-white/5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    segment.type === 'AS_SEQUENCE' 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-purple-900/20 text-purple-400 border border-purple-800/30'
                  }`}>
                    {segment.type}
                  </span>
                  <span className="font-mono text-textMuted text-sm">
                    {segment.asns.map(asn => `AS${asn}`).join(' → ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unique ASNs */}
      <div>
        <h4 className="text-sm font-medium text-text mb-2">Unique ASNs</h4>
        <div className="flex flex-wrap gap-2">
          {result.uniqueASNs.map((asn) => (
            <span
              key={asn}
              className={`px-3 py-1 rounded-full text-sm font-mono ${
                result.prependingASNs.includes(asn)
                  ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-700/50'
                  : 'bg-surface text-textMuted border border-white/5'
              }`}
            >
              AS{asn}
            </span>
          ))}
        </div>
      </div>

      {/* Potential Issues */}
      {result.potentialIssues.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text mb-2">
            Potential Issues
          </h4>
          <div className="space-y-2">
            {result.potentialIssues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 p-3 bg-yellow-900/10 border border-yellow-800/30 rounded-lg"
              >
                <span className="text-yellow-500">⚠️</span>
                <span className="text-yellow-200/80 text-sm">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Stat Card Component
 */
const StatCard: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div className="p-4 bg-surface/80 rounded-lg text-center border border-white/5">
    <div className="text-textMuted text-xs uppercase tracking-wide mb-1">{label}</div>
    <div className={`text-lg font-semibold ${highlight ? 'text-primary' : 'text-text'}`}>
      {value}
    </div>
  </div>
);

export default BGPResults;
