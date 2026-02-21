import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const CelestialGlobe = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const projection = d3.geoOrthographic()
        .scale(height * 1.5) // Gigantic scale for "planet horizon" feel
        .translate([width * 1.1, height * 1.1]) // Position in the bottom-right corner
        .clipAngle(90);

      const path = d3.geoPath().projection(projection);
      const graticule = d3.geoGraticule().step([10, 10]);

      svg.selectAll('*').remove();
      
      const g = svg.append('g');

      // The Wireframe Graticule
      g.append('path')
        .datum(graticule())
        .attr('d', path as any)
        .attr('fill', 'none')
        .attr('stroke', '#22c55e')
        .attr('stroke-width', 0.5)
        .attr('stroke-opacity', 0.15);

      // The Atmosphere edge/outline
      g.append('path')
        .datum({type: "Sphere"})
        .attr('d', path as any)
        .attr('fill', 'none')
        .attr('stroke', '#22c55e')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.1);

      return { projection, render: () => g.selectAll('path').attr('d', path as any) };
    };

    let { projection, render } = updateSize();
    let rotation = 0;
    
    const timer = d3.timer(() => {
      rotation += 0.04; // Slow, cinematic rotation
      projection.rotate([rotation, -20]); // Slight tilt for perspective
      render();
    });

    const handleResize = () => {
      const result = updateSize();
      projection = result.projection;
      render = result.render;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      timer.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
      {/* Background gradient overlay to blend the planet */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-transparent z-10"></div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
