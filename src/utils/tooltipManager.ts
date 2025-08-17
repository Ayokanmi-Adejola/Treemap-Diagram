import * as d3 from 'd3';

interface GameData {
  name: string;
  category: string;
  value: number;
}

export const createTooltip = (tooltipElement: HTMLDivElement) => {
  const tooltip = d3.select(tooltipElement);

  return {
    show: (event: MouseEvent, data: GameData) => {
      tooltip
        .style('opacity', 1)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px')
        .attr('data-value', data.value)
        .html(`
          <div class="tooltip-content">
            <div class="tooltip-name">Name: ${data.name}</div>
            <div class="tooltip-category">Category: ${data.category}</div>
            <div class="tooltip-value">Value: ${data.value.toLocaleString()}</div>
          </div>
        `);
    },
    
    move: (event: MouseEvent) => {
      tooltip
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    },
    
    hide: () => {
      tooltip.style('opacity', 0);
    }
  };
};