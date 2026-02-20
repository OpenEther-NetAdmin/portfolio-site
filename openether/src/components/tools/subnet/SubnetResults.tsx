/**
 * Subnet Results Component
 * Displays calculation results in a formatted grid
 */
import React from 'react';
import type { IPv4NetworkResult } from '../../../lib/network/types';

interface SubnetResultsProps {
  result: IPv4NetworkResult;
}

const SubnetResults: React.FC<SubnetResultsProps> = ({ result }) => {
  return (
    <div className="space-y-4">
      {/* Main Network Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultRow label="Network Address" value={result.networkAddress} highlight />
        <ResultRow label="Broadcast Address" value={result.broadcastAddress} highlight />
        <ResultRow label="Subnet Mask" value={result.subnetMask} />
        <ResultRow label="Wildcard Mask" value={result.wildcardMask} />
        <ResultRow label="First Usable Host" value={result.firstUsableHost} />
        <ResultRow label="Last Usable Host" value={result.lastUsableHost} />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard label="CIDR" value={`/${result.cidr}`} />
        <StatCard label="Total Hosts" value={formatNumber(result.totalHosts)} />
        <StatCard label="Usable Hosts" value={formatNumber(result.usableHosts)} />
        <StatCard 
          label="IP Class" 
          value={result.ipClass} 
          badge={result.ipClass === 'Private' || result.ipClass === 'Loopback'}
        />
      </div>

      {/* Special Properties */}
      <div className="flex flex-wrap gap-2 mt-4">
        {result.isPrivate && (
          <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm">
            Private IP Range
          </span>
        )}
        {result.isLoopback && (
          <span className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-sm">
            Loopback
          </span>
        )}
        {result.cidr === 32 && (
          <span className="px-3 py-1 bg-cyan-900/50 text-cyan-400 rounded-full text-sm">
            /32 - Single Host
          </span>
        )}
        {result.cidr === 31 && (
          <span className="px-3 py-1 bg-cyan-900/50 text-cyan-400 rounded-full text-sm">
            /31 - Point-to-Point Link
          </span>
        )}
        {result.cidr === 30 && (
          <span className="px-3 py-1 bg-cyan-900/50 text-cyan-400 rounded-full text-sm">
            /30 - Typical WAN Link
          </span>
        )}
        {result.cidr === 24 && (
          <span className="px-3 py-1 bg-cyan-900/50 text-cyan-400 rounded-full text-sm">
            /24 - Class C Network
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Result Row Component
 */
const ResultRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
    <span className="text-slate-400 text-sm">{label}</span>
    <span className={`font-mono ${highlight ? 'text-cyan-400 font-semibold' : 'text-slate-200'}`}>
      {value}
    </span>
  </div>
);

/**
 * Stat Card Component
 */
const StatCard: React.FC<{
  label: string;
  value: string;
  badge?: boolean;
}> = ({ label, value, badge }) => (
  <div className="p-4 bg-slate-700/50 rounded-lg text-center">
    <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">{label}</div>
    <div className={`text-lg font-semibold ${badge ? 'text-cyan-400' : 'text-slate-100'}`}>
      {value}
    </div>
  </div>
);

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export default SubnetResults;
