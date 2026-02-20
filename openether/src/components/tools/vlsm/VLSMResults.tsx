/**
 * VLSM Results Component
 */
import React from 'react';
import type { VLSMAllocationResult } from '../../../lib/network/vlsm';

interface VLSMResultsProps {
  result: VLSMAllocationResult;
}

const VLSMResults: React.FC<VLSMResultsProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Base Network" 
          value={`${result.baseNetwork}/${result.baseCIDR}`} 
          highlight 
        />
        <StatCard 
          label="Subnets Allocated" 
          value={result.allocations.length.toString()} 
        />
        <StatCard 
          label="Utilization" 
          value={`${result.utilizationPercent}%`}
          highlight={result.utilizationPercent > 80}
        />
        <StatCard 
          label="Available Hosts" 
          value={formatNumber(result.totalAvailable)} 
        />
      </div>

      {/* Utilization Bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">Address Space Utilization</span>
          <span className="text-slate-300">{result.utilizationPercent}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              result.utilizationPercent > 90
                ? 'bg-red-500'
                : result.utilizationPercent > 70
                ? 'bg-yellow-500'
                : 'bg-cyan-500'
            }`}
            style={{ width: `${Math.min(result.utilizationPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="space-y-2">
          {result.warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg"
            >
              <span className="text-yellow-500">⚠️</span>
              <span className="text-yellow-200 text-sm">{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Allocation Table */}
      {result.allocations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Network</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">CIDR</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">First Host</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Host</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Hosts</th>
              </tr>
            </thead>
            <tbody>
              {result.allocations.map((allocation, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-200 font-medium">{allocation.name}</td>
                  <td className="py-3 px-4 text-cyan-400 font-mono">{allocation.networkAddress}</td>
                  <td className="py-3 px-4 text-center text-slate-300">/{allocation.cidr}</td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{allocation.firstHost}</td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{allocation.lastHost}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{allocation.usableHosts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Allocations */}
      {result.allocations.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No subnets could be allocated. Check your requirements and base network size.
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

export default VLSMResults;
