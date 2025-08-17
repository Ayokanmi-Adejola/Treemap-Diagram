import * as d3 from 'd3';

export const createLegend = (
  legendElement: HTMLDivElement,
  categories: string[],
  colorScale: d3.ScaleOrdinal<string, string>
) => {
  const legend = d3.select(legendElement);

  const legendItems = legend.selectAll('.legend-item-container')
    .data(categories)
    .enter()
    .append('div')
    .attr('class', 'legend-item-container');

  // Add colored rectangles using SVG
  legendItems.append('svg')
    .attr('width', 20)
    .attr('height', 20)
    .append('rect')
    .attr('class', 'legend-item')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', d => colorScale(d));

  // Add text labels
  legendItems.append('span')
    .attr('class', 'legend-text')
    .text(d => d);
};