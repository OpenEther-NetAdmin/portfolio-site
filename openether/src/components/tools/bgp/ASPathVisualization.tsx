/**
 * AS Path Visualization Component
 * D3.js-based visualization of AS path as a flow diagram
 */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ASPathVisualizationProps {
  asns: number[];
}

const ASPathVisualization: React.FC<ASPathVisualizationProps> = ({ asns }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 150 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width - 20, 300), height: 150 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || asns.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 30, right: 40, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Calculate node positions
    const nodeRadius = Math.min(25, innerWidth / (asns.length * 3));
    const nodeSpacing = innerWidth / (asns.length + 1);

    // Draw connections (lines between nodes)
    for (let i = 0; i < asns.length - 1; i++) {
      const x1 = nodeSpacing * (i + 1);
      const x2 = nodeSpacing * (i + 2);
      const y = innerHeight / 2;

      // Arrow line
      g.append('line')
        .attr('x1', x1 + nodeRadius)
        .attr('y1', y)
        .attr('x2', x2 - nodeRadius - 5)
        .attr('y2', y)
        .attr('stroke', '#475569')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,2');

      // Arrow head
      g.append('polygon')
        .attr('points', `${x2 - nodeRadius - 5},${y - 5} ${x2 - nodeRadius},${y} ${x2 - nodeRadius - 5},${y + 5}`)
        .attr('fill', '#475569');
    }

    // Draw nodes
    asns.forEach((asn, index) => {
      const x = nodeSpacing * (index + 1);
      const y = innerHeight / 2;
      const isFirst = index === 0;
      const isLast = index === asns.length - 1;

      // Node circle
      const node = g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', nodeRadius)
        .attr('fill', isFirst ? '#0891b2' : isLast ? '#059669' : '#334155')
        .attr('stroke', isFirst ? '#06b6d4' : isLast ? '#10b981' : '#475569')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer');

      // ASN text
      g.append('text')
        .attr('x', x)
        .attr('y', y + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', `${Math.min(12, nodeRadius * 0.5)}px`)
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .attr('fill', '#ffffff')
        .text(asn);

      // Label (Neighbor/Origin)
      if (isFirst) {
        g.append('text')
          .attr('x', x)
          .attr('y', y - nodeRadius - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#06b6d4')
          .text('Neighbor AS');
      }
      if (isLast) {
        g.append('text')
          .attr('x', x)
          .attr('y', y - nodeRadius - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#10b981')
          .text('Origin AS');
      }

      // Hover effect
      node
        .on('mouseenter', function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('r', nodeRadius + 3);
        })
        .on('mouseleave', function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('r', nodeRadius);
        });
    });

    // Legend
    const legendY = innerHeight + 20;
    
    // Neighbor AS legend
    g.append('circle')
      .attr('cx', 10)
      .attr('cy', legendY)
      .attr('r', 6)
      .attr('fill', '#0891b2')
      .attr('stroke', '#06b6d4')
      .attr('stroke-width', 1);
    g.append('text')
      .attr('x', 22)
      .attr('y', legendY + 4)
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8')
      .text('Neighbor AS');

    // Origin AS legend
    g.append('circle')
      .attr('cx', 110)
      .attr('cy', legendY)
      .attr('r', 6)
      .attr('fill', '#059669')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 1);
    g.append('text')
      .attr('x', 122)
      .attr('y', legendY + 4)
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8')
      .text('Origin AS');

    // Transit AS legend
    g.append('circle')
      .attr('cx', 200)
      .attr('cy', legendY)
      .attr('r', 6)
      .attr('fill', '#334155')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1);
    g.append('text')
      .attr('x', 212)
      .attr('y', legendY + 4)
      .attr('font-size', '11px')
      .attr('fill', '#94a3b8')
      .text('Transit AS');

  }, [asns, dimensions]);

  if (asns.length === 0) {
    return (
      <div className="text-slate-400 text-center py-8">
        No ASNs to visualize
      </div>
    );
  }

  return (
    <div ref={containerRef} className="as-path-visualization-container w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        role="img"
        aria-label={`AS path visualization: ${asns.join(' → ')}`}
      />
    </div>
  );
};

export default ASPathVisualization;
