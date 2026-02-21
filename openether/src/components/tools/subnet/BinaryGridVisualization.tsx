/**
 * Binary Grid Visualization Component
 * D3.js-based visualization of IP address binary representation
 */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { BinaryRepresentation } from '../../../lib/network/types';

interface BinaryGridVisualizationProps {
  ipAddress: string;
  cidr: number;
  binaryRepresentation: BinaryRepresentation;
}

const BinaryGridVisualization: React.FC<BinaryGridVisualizationProps> = ({
  ipAddress,
  cidr,
  binaryRepresentation,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 200 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width - 20, 300), height: 200 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Calculate grid dimensions
    const totalBits = 32;
    const bitsPerOctet = 8;
    const cellSize = Math.min(innerWidth / 36, 24); // 32 bits + 4 separators
    const cellGap = 2;
    const octetGap = 8;
    const totalWidth = totalBits * (cellSize + cellGap) + 3 * octetGap;
    const startX = (innerWidth - totalWidth) / 2;

    // Draw octet groups
    const octets = ipAddress.split('.').map(Number);
    const binaryOctets = binaryRepresentation.octets;

    for (let octetIndex = 0; octetIndex < 4; octetIndex++) {
      const octetStartX = startX + octetIndex * (8 * (cellSize + cellGap) + octetGap);
      const octetBinary = binaryOctets[octetIndex];
      const octetDecimal = octets[octetIndex];

      // Draw bit cells
      for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
        const globalBitIndex = octetIndex * 8 + bitIndex;
        const x = octetStartX + bitIndex * (cellSize + cellGap);
        const isNetworkBit = globalBitIndex < cidr;
        const bitValue = octetBinary[bitIndex];

        // Cell background
        const cell = g
          .append('rect')
          .attr('x', x)
          .attr('y', innerHeight / 2 - cellSize / 2)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', isNetworkBit ? '#22c55e' : '#0f172a') // primary : surface
          .attr('stroke', isNetworkBit ? '#4ade80' : '#1e293b') // primaryHover : border
          .attr('stroke-width', 2)
          .attr('class', 'bit-cell')
          .style('cursor', 'pointer');

        // Bit value text
        g.append('text')
          .attr('x', x + cellSize / 2)
          .attr('y', innerHeight / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('font-size', `${cellSize * 0.5}px`)
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .attr('fill', isNetworkBit ? '#020617' : '#94a3b8') // background : textMuted
          .text(bitValue);

        // Hover effect
        cell
          .on('mouseenter', function () {
            d3.select(this)
              .transition()
              .duration(150)
              .attr('fill', isNetworkBit ? '#4ade80' : '#1e293b'); // primaryHover : border
          })
          .on('mouseleave', function () {
            d3.select(this)
              .transition()
              .duration(150)
              .attr('fill', isNetworkBit ? '#22c55e' : '#0f172a'); // primary : surface
          });
      }

      // Octet decimal label
      g.append('text')
        .attr('x', octetStartX + 4 * (cellSize + cellGap) - cellGap / 2)
        .attr('y', innerHeight / 2 + cellSize / 2 + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('fill', '#f1f5f9') // text
        .text(octetDecimal);

      // Octet separator (except after last octet)
      if (octetIndex < 3) {
        g.append('text')
          .attr('x', octetStartX + 8 * (cellSize + cellGap) + octetGap / 2)
          .attr('y', innerHeight / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .attr('fill', '#94a3b8') // textMuted
          .text('.');
      }
    }

    // Network/Host bit labels
    const networkEndX = startX + cidr * (cellSize + cellGap) - cellGap / 2;
    
    if (cidr > 0) {
      g.append('text')
        .attr('x', Math.min(networkEndX, startX + 16 * (cellSize + cellGap)))
        .attr('y', innerHeight / 2 - cellSize / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#22c55e') // primary
        .text(`Network (${cidr} bits)`);
    }

    if (cidr < 32) {
      g.append('text')
        .attr('x', networkEndX + (32 - cidr) * (cellSize + cellGap) / 2)
        .attr('y', innerHeight / 2 - cellSize / 2 - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#94a3b8') // textMuted
        .text(`Host (${32 - cidr} bits)`);
    }

    // Legend
    const legendY = innerHeight - 10;
    const legendStartX = startX;

    // Network bit legend
    g.append('rect')
      .attr('x', legendStartX)
      .attr('y', legendY - 10)
      .attr('width', 12)
      .attr('height', 12)
      .attr('rx', 2)
      .attr('fill', '#22c55e') // primary
      .attr('stroke', '#4ade80') // primaryHover
      .attr('stroke-width', 1);

    g.append('text')
      .attr('x', legendStartX + 18)
      .attr('y', legendY)
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8') // textMuted
      .text('Network bits');

    // Host bit legend
    g.append('rect')
      .attr('x', legendStartX + 100)
      .attr('y', legendY - 10)
      .attr('width', 12)
      .attr('height', 12)
      .attr('rx', 2)
      .attr('fill', '#0f172a') // surface
      .attr('stroke', '#1e293b') // border
      .attr('stroke-width', 1);

    g.append('text')
      .attr('x', legendStartX + 118)
      .attr('y', legendY)
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8') // textMuted
      .text('Host bits');

  }, [ipAddress, cidr, binaryRepresentation, dimensions]);

  return (
    <div ref={containerRef} className="binary-grid-container w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        role="img"
        aria-label={`Binary visualization of ${ipAddress}/${cidr}`}
      />
    </div>
  );
};

export default BinaryGridVisualization;
