/**
 * VLSM Allocator App
 * Main React component for VLSM subnet allocation
 */
import React, { useState, useCallback } from 'react';
import { VLSMAllocator, type VLSMAllocationResult } from '../../../lib/network/vlsm';
import { useCalculationHistory, type HistoryEntry } from '../../../hooks/useCalculationHistory';
import type { VLSMSubnetRequest } from '../../../lib/network/types';
import VLSMInputForm from './VLSMInputForm';
import VLSMResults from './VLSMResults';

interface VLSMFormData {
  baseNetwork: string;
  baseCIDR: number;
  requests: VLSMSubnetRequest[];
}

const VLSMAllocatorApp: React.FC = () => {
  // Form state
  const [baseNetwork, setBaseNetwork] = useState('10.0.0.0');
  const [baseCIDR, setBaseCIDR] = useState(24);
  const [requests, setRequests] = useState<VLSMSubnetRequest[]>([
    { name: 'LAN 1', requiredHosts: 50 },
    { name: 'LAN 2', requiredHosts: 25 },
    { name: 'WAN Links', requiredHosts: 2 },
  ]);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [result, setResult] = useState<VLSMAllocationResult | null>(null);

  // History
  const { history, addEntry, clearHistory } = useCalculationHistory<VLSMFormData, VLSMAllocationResult>(
    'vlsm-allocator-history'
  );

  // Allocate subnets
  const handleAllocate = useCallback(() => {
    setError(null);

    // Validate requests
    const validation = VLSMAllocator.validateRequests(requests);
    if (!validation.valid) {
      setError(validation.errors.join('; '));
      return;
    }

    try {
      const allocation = VLSMAllocator.allocate(baseNetwork, baseCIDR, requests);
      setResult(allocation);

      // Add to history
      addEntry({
        input: { baseNetwork, baseCIDR, requests: [...requests] },
        result: allocation,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Allocation failed');
      setResult(null);
    }
  }, [baseNetwork, baseCIDR, requests, addEntry]);

  // Load from history
  const handleLoadFromHistory = useCallback((entry: HistoryEntry<VLSMFormData, VLSMAllocationResult>) => {
    setBaseNetwork(entry.input.baseNetwork);
    setBaseCIDR(entry.input.baseCIDR);
    setRequests(entry.input.requests);
    setResult(entry.result);
    setError(null);
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setBaseNetwork('10.0.0.0');
    setBaseCIDR(24);
    setRequests([
      { name: 'LAN 1', requiredHosts: 50 },
      { name: 'LAN 2', requiredHosts: 25 },
      { name: 'WAN Links', requiredHosts: 2 },
    ]);
    setResult(null);
    setError(null);
  }, []);

  // Add subnet request
  const handleAddRequest = useCallback(() => {
    setRequests(prev => [...prev, { name: `Subnet ${prev.length + 1}`, requiredHosts: 10 }]);
  }, []);

  // Remove subnet request
  const handleRemoveRequest = useCallback((index: number) => {
    setRequests(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update subnet request
  const handleUpdateRequest = useCallback((index: number, updates: Partial<VLSMSubnetRequest>) => {
    setRequests(prev => prev.map((r, i) => i === index ? { ...r, ...updates } : r));
  }, []);

  return (
    <div className="vlsm-allocator-app space-y-6">
      {/* Input Form */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          VLSM Subnet Allocator
        </h2>
        <VLSMInputForm
          baseNetwork={baseNetwork}
          baseCIDR={baseCIDR}
          requests={requests}
          error={error}
          onBaseNetworkChange={setBaseNetwork}
          onBaseCIDRChange={setBaseCIDR}
          onAddRequest={handleAddRequest}
          onRemoveRequest={handleRemoveRequest}
          onUpdateRequest={handleUpdateRequest}
          onAllocate={handleAllocate}
          onReset={handleReset}
        />
      </div>

      {/* Results */}
      {result && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            Allocation Results
          </h3>
          <VLSMResults result={result} />
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100">
              Allocation History
            </h3>
            <button
              onClick={clearHistory}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice(0, 10).map((entry) => (
              <button
                key={entry.id}
                onClick={() => handleLoadFromHistory(entry)}
                className="w-full text-left p-3 bg-slate-700/50 rounded hover:bg-slate-700 transition-colors"
              >
                <span className="text-cyan-400 font-mono text-sm">
                  {entry.input.baseNetwork}/{entry.input.baseCIDR}
                </span>
                <span className="text-slate-400 text-sm ml-2">
                  ({entry.input.requests.length} subnets, {entry.result.utilizationPercent}% used)
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VLSMAllocatorApp;
