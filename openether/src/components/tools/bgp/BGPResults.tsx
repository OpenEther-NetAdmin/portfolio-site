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
      <div className="p-4 bg-slate-700/50 rounded-lg">
        <div className="text-sm text-slate-400 mb-2">AS_PATH</div>
        <div className="font-mono text-cyan-400 text-sm break-all">
          {result.pathString}
        </div>
      </div>

      {/* Segments */}
      {result.segments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">Path Segments</h4>
          <div className="space-y-2">
            {result.segments.map((segment, index) => (
              <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    segment.type === 'AS_SEQUENCE' 
                      ? 'bg-cyan-900/50 text-cyan-400' 
                      : 'bg-purple-900/50 text-purple-400'
                  }`}>
                    {segment.type}
                  </span>
                  <span className="font-mono text-slate-300 text-sm">
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
        <h4 className="text-sm font-medium text-slate-300 mb-2">Unique ASNs</h4>
        <div className="flex flex-wrap gap-2">
          {result.uniqueASNs.map((asn) => (
            <span
              key={asn}
              className={`px-3 py-1 rounded-full text-sm font-mono ${
                result.prependingASNs.includes(asn)
                  ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                  : 'bg-slate-700 text-slate-300'
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
          <h4 className="text-sm font-medium text-slate-300 mb-2">
            Potential Issues
          </h4>
          <div className="space-y-2">
            {result.potentialIssues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg"
              >
                <span className="text-yellow-500">⚠️</span>
                <span className="text-yellow-200 text-sm">{issue}</span>
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
  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
    <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">{label}</div>
    <div className={`text-lg font-semibold ${highlight ? 'text-cyan-400' : 'text-slate-100'}`}>
      {value}
    </div>
  </div>
);

export default BGPResults;
