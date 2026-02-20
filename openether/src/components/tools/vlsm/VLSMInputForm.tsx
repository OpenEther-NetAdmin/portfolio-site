/**
 * VLSM Input Form Component
 */
import React from 'react';
import type { VLSMSubnetRequest } from '../../../lib/network/types';

interface VLSMInputFormProps {
  baseNetwork: string;
  baseCIDR: number;
  requests: VLSMSubnetRequest[];
  error: string | null;
  onBaseNetworkChange: (value: string) => void;
  onBaseCIDRChange: (value: number) => void;
  onAddRequest: () => void;
  onRemoveRequest: (index: number) => void;
  onUpdateRequest: (index: number, updates: Partial<VLSMSubnetRequest>) => void;
  onAllocate: () => void;
  onReset: () => void;
}

const VLSMInputForm: React.FC<VLSMInputFormProps> = ({
  baseNetwork,
  baseCIDR,
  requests,
  error,
  onBaseNetworkChange,
  onBaseCIDRChange,
  onAddRequest,
  onRemoveRequest,
  onUpdateRequest,
  onAllocate,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAllocate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Base Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="base-network" className="block text-sm font-medium text-slate-300 mb-2">
            Base Network Address
          </label>
          <input
            type="text"
            id="base-network"
            value={baseNetwork}
            onChange={(e) => onBaseNetworkChange(e.target.value)}
            placeholder="10.0.0.0"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="base-cidr" className="block text-sm font-medium text-slate-300 mb-2">
            CIDR Prefix (/{baseCIDR})
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              id="base-cidr"
              min="8"
              max="30"
              value={baseCIDR}
              onChange={(e) => onBaseCIDRChange(parseInt(e.target.value, 10))}
              className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <input
              type="number"
              min="8"
              max="30"
              value={baseCIDR}
              onChange={(e) => onBaseCIDRChange(parseInt(e.target.value, 10))}
              className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Subnet Requests */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-slate-300">
            Subnet Requirements
          </label>
          <button
            type="button"
            onClick={onAddRequest}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors"
          >
            + Add Subnet
          </button>
        </div>

        <div className="space-y-3">
          {requests.map((request, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={request.name}
                  onChange={(e) => onUpdateRequest(index, { name: e.target.value })}
                  placeholder="Subnet name"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  value={request.requiredHosts}
                  onChange={(e) => onUpdateRequest(index, { requiredHosts: parseInt(e.target.value, 10) || 1 })}
                  min="1"
                  placeholder="Hosts"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveRequest(index)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                disabled={requests.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={requests.length === 0}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            requests.length > 0
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          Allocate Subnets
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

export default VLSMInputForm;
