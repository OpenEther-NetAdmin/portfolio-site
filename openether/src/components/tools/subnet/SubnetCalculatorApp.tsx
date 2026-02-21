/**
 * Subnet Calculator App
 * Main React component for IPv4 subnet calculations
 */
import React, { useState, useCallback } from 'react';
import { IPv4Calculator } from '../../../lib/network/ipv4';
import { useFormState } from '../../../hooks/useFormState';
import { useCalculationHistory, type HistoryEntry } from '../../../hooks/useCalculationHistory';
import { SubnetFormSchema, type SubnetFormData } from '../../../lib/network/validators';
import type { IPv4NetworkResult } from '../../../lib/network/types';
import SubnetInputForm from './SubnetInputForm';
import SubnetResults from './SubnetResults';
import BinaryGridVisualization from './BinaryGridVisualization';

const SubnetCalculatorApp: React.FC = () => {
  // Form state with validation
  const { data, errors, isValid, updateField, reset } = useFormState<SubnetFormData>(
    { address: '192.168.1.0', cidr: 24 },
    SubnetFormSchema
  );

  // Calculation result state
  const [result, setResult] = useState<IPv4NetworkResult | null>(null);

  // History management - input type is SubnetFormData, result type is IPv4NetworkResult
  const { history, addEntry, clearHistory } = useCalculationHistory<SubnetFormData, IPv4NetworkResult>(
    'subnet-calculator-history'
  );

  // Calculate subnet on valid input
  const handleCalculate = useCallback(() => {
    if (!isValid) return;

    try {
      const calculationResult = IPv4Calculator.calculate(data.address, data.cidr);
      setResult(calculationResult);
      
      // Add to history
      addEntry({
        input: { address: data.address, cidr: data.cidr },
        result: calculationResult,
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [data, isValid, addEntry]);

  // Load from history
  const handleLoadFromHistory = useCallback((entry: HistoryEntry<SubnetFormData, IPv4NetworkResult>) => {
    updateField('address', entry.input.address);
    updateField('cidr', entry.input.cidr);
    setResult(entry.result);
  }, [updateField]);

  // Reset everything
  const handleReset = useCallback(() => {
    reset();
    setResult(null);
  }, [reset]);

  return (
    <div className="subnet-calculator-app space-y-6">
      {/* Input Form */}
      <div className="bg-surface rounded-xl p-6 border border-white/5">
        <h2 className="text-xl font-semibold text-text mb-4 font-mono text-primary flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
          IPv4 SUBNET CALCULATOR
        </h2>
        <SubnetInputForm
          address={data.address}
          cidr={data.cidr}
          errors={errors}
          onAddressChange={(value: string) => updateField('address', value)}
          onCidrChange={(value: number) => updateField('cidr', value)}
          onCalculate={handleCalculate}
          onReset={handleReset}
          isValid={isValid}
        />
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="bg-surface rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-text mb-4 font-mono text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              NETWORK INFORMATION
            </h3>
            <SubnetResults result={result} />
          </div>

          {/* Binary Visualization */}
          <div className="bg-surface rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-text mb-4 font-mono text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              BINARY VISUALIZATION
            </h3>
            <BinaryGridVisualization
              ipAddress={result.networkAddress}
              cidr={result.cidr}
              binaryRepresentation={result.binaryRepresentation}
            />
          </div>
        </>
      )}

      {/* History Panel */}
      {history.length > 0 && (
        <div className="bg-surface rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text font-mono text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              HISTORY
            </h3>
            <button
              onClick={clearHistory}
              className="text-xs font-mono text-textMuted hover:text-primary transition-colors"
            >
              [ CLEAR_LOGS ]
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history.slice(0, 10).map((entry) => (
              <button
                key={entry.id}
                onClick={() => handleLoadFromHistory(entry)}
                className="w-full text-left p-3 bg-background border border-white/5 rounded-lg hover:border-primary/30 transition-all group"
              >
                <span className="text-primary font-mono group-hover:glow-sm transition-all">
                  {entry.input.address}/{entry.input.cidr}
                </span>
                <span className="text-textMuted text-xs font-mono ml-4">
                  → {entry.result.networkAddress}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubnetCalculatorApp;
