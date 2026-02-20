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
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          IPv4 Subnet Calculator
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
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Network Information
            </h3>
            <SubnetResults result={result} />
          </div>

          {/* Binary Visualization */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Binary Visualization
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
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100">
              Calculation History
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
                <span className="text-cyan-400 font-mono">
                  {entry.input.address}/{entry.input.cidr}
                </span>
                <span className="text-slate-400 text-sm ml-2">
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
