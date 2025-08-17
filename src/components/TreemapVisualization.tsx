import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createTreemap } from '../utils/treemapGenerator';
import { createTooltip } from '../utils/tooltipManager';
import { createLegend } from '../utils/legendGenerator';
import { COLORS, DIMENSIONS } from '../constants/config';

interface GameData {
  name: string;
  category: string;
  value: number;
}

interface HierarchyData extends d3.HierarchyRectangularNode<GameData> {
  data: GameData;
}

const TreemapVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
        );
        const data = await response.json();
        
        if (svgRef.current && tooltipRef.current && legendRef.current) {
          createVisualization(data, svgRef.current, tooltipRef.current, legendRef.current);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const createVisualization = (
    data: any,
    svg: SVGSVGElement,
    tooltipElement: HTMLDivElement,
    legendElement: HTMLDivElement
  ) => {
    // Clear existing content
    d3.select(svg).selectAll('*').remove();
    d3.select(legendElement).selectAll('*').remove();

    // Create treemap layout
    const root = createTreemap(data, DIMENSIONS.width, DIMENSIONS.height);

    // Setup SVG
    const svgSelection = d3.select(svg)
      .attr('width', DIMENSIONS.width)
      .attr('height', DIMENSIONS.height);

    // Create tooltip manager
    const tooltip = createTooltip(tooltipElement);

    // Get categories for color mapping
    const categories = Array.from(new Set(root.leaves().map(d => d.data.category)));
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(COLORS.palette);

    // Create tiles
    const leaf = svgSelection.selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', (d: HierarchyData) => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    leaf.append('rect')
      .attr('class', 'tile')
      .attr('width', (d: HierarchyData) => d.x1 - d.x0)
      .attr('height', (d: HierarchyData) => d.y1 - d.y0)
      .attr('fill', (d: HierarchyData) => colorScale(d.data.category))
      .attr('data-name', (d: HierarchyData) => d.data.name)
      .attr('data-category', (d: HierarchyData) => d.data.category)
      .attr('data-value', (d: HierarchyData) => d.data.value)
      .on('mouseover', function(event: MouseEvent, d: HierarchyData) {
        tooltip.show(event, d.data);
      })
      .on('mousemove', function(event: MouseEvent, d: HierarchyData) {
        tooltip.move(event);
      })
      .on('mouseout', function() {
        tooltip.hide();
      });

    // Add text labels
    leaf.append('text')
      .attr('class', 'tile-text')
      .selectAll('tspan')
      .data((d: HierarchyData) => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        
        // Only show text if tile is large enough
        if (width < 30 || height < 20) return [];
        
        const words = d.data.name.split(/\s+/);
        const lines = [];
        const maxCharsPerLine = Math.floor(width / 6);
        const maxLines = Math.floor(height / 12);
        
        let currentLine = '';
        for (const word of words) {
          if ((currentLine + word).length <= maxCharsPerLine) {
            currentLine += (currentLine ? ' ' : '') + word;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
            if (lines.length >= maxLines - 1) break;
          }
        }
        if (currentLine && lines.length < maxLines) {
          lines.push(currentLine);
        }
        
        return lines;
      })
      .enter().append('tspan')
      .attr('x', 3)
      .attr('y', (_, i) => 12 + i * 12)
      .text((d: string) => d);

    // Create legend
    createLegend(legendElement, categories, colorScale);
  };

  return (
    <div className="treemap-container">
      <div className="dataset-links">
        <a href="#" onClick={(e) => e.preventDefault()}>Video Game Data Set</a> |
        <a href="#" onClick={(e) => e.preventDefault()}> Movies Data Set</a> |
        <a href="#" onClick={(e) => e.preventDefault()}> Kickstarter Data Set</a>
      </div>
      
      <header className="treemap-header">
        <h1 id="title">Video Game Sales</h1>
        <p id="description">
          Top 100 Most Sold Video Games Grouped by Platform
        </p>
      </header>
      
      <div className="visualization-wrapper">
        <svg ref={svgRef} className="treemap-svg"></svg>
        <div ref={legendRef} id="legend"></div>
        <div ref={tooltipRef} id="tooltip" className="tooltip"></div>
      </div>
    </div>
  );
};

export default TreemapVisualization;