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
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
            Private IP Range
          </span>
        )}
        {result.isLoopback && (
          <span className="px-3 py-1 bg-yellow-900/10 text-yellow-400 border border-yellow-700/30 rounded-full text-sm font-medium">
            Loopback
          </span>
        )}
        {(result.cidr === 32 || result.cidr === 31 || result.cidr === 30 || result.cidr === 24) && (
          <span className="px-3 py-1 bg-surface border border-white/10 text-textMuted rounded-full text-sm font-medium">
            {result.cidr === 32 ? '/32 - Single Host' : 
             result.cidr === 31 ? '/31 - Point-to-Point Link' :
             result.cidr === 30 ? '/30 - Typical WAN Link' :
             '/24 - Class C Network'}
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
  <div className="flex justify-between items-center p-3 bg-surface/80 rounded-lg border border-white/5">
    <span className="text-textMuted text-sm">{label}</span>
    <span className={`font-mono ${highlight ? 'text-primary font-semibold' : 'text-text'}`}>
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
  <div className="p-4 bg-surface/80 rounded-lg text-center border border-white/5">
    <div className="text-textMuted text-xs uppercase tracking-wide mb-1">{label}</div>
    <div className={`text-lg font-semibold ${badge ? 'text-primary' : 'text-text'}`}>
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
