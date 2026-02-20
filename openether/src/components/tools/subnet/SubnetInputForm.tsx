/**
 * Subnet Input Form Component
 * Handles IP address and CIDR input with validation
 */
import React from 'react';

interface SubnetInputFormProps {
  address: string;
  cidr: number;
  errors: Partial<Record<'address' | 'cidr', string>>;
  onAddressChange: (value: string) => void;
  onCidrChange: (value: number) => void;
  onCalculate: () => void;
  onReset: () => void;
  isValid: boolean;
}

const SubnetInputForm: React.FC<SubnetInputFormProps> = ({
  address,
  cidr,
  errors,
  onAddressChange,
  onCidrChange,
  onCalculate,
  onReset,
  isValid,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* IP Address Input */}
      <div>
        <label htmlFor="ip-address" className="block text-sm font-medium text-slate-300 mb-2">
          IP Address
        </label>
        <input
          type="text"
          id="ip-address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="192.168.1.0"
          className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
            errors.address ? 'border-red-500' : 'border-slate-600'
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-400">{errors.address}</p>
        )}
      </div>

      {/* CIDR Input */}
      <div>
        <label htmlFor="cidr" className="block text-sm font-medium text-slate-300 mb-2">
          CIDR Prefix (/{cidr})
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            id="cidr"
            min="0"
            max="32"
            value={cidr}
            onChange={(e) => onCidrChange(parseInt(e.target.value, 10))}
            className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <input
            type="number"
            min="0"
            max="32"
            value={cidr}
            onChange={(e) => onCidrChange(parseInt(e.target.value, 10))}
            className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        {errors.cidr && (
          <p className="mt-1 text-sm text-red-400">{errors.cidr}</p>
        )}
        <p className="mt-2 text-sm text-slate-400">
          Subnet Mask: {getSubnetMaskFromCIDR(cidr)}
        </p>
      </div>

      {/* CIDR Notation Display */}
      <div className="p-3 bg-slate-700/50 rounded-lg">
        <span className="text-slate-400 text-sm">CIDR Notation: </span>
        <span className="text-cyan-400 font-mono">
          {address}/{cidr}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={!isValid}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            isValid
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          Calculate
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

/**
 * Get subnet mask from CIDR prefix
 */
function getSubnetMaskFromCIDR(cidr: number): string {
  if (cidr === 0) return '0.0.0.0';
  const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return [
    (mask >>> 24) & 0xFF,
    (mask >>> 16) & 0xFF,
    (mask >>> 8) & 0xFF,
    mask & 0xFF,
  ].join('.');
}

export default SubnetInputForm;
