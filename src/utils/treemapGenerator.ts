import * as d3 from 'd3';

interface GameData {
  name: string;
  category: string;
  value: number;
}

export const createTreemap = (data: any, width: number, height: number) => {
  // Create hierarchy
  const hierarchy = d3.hierarchy(data)
    .sum((d: any) => d.value)
    .sort((a: any, b: any) => b.value - a.value);

  // Create treemap layout
  const treemap = d3.treemap<GameData>()
    .size([width, height])
    .paddingTop(1)
    .paddingRight(1)
    .paddingBottom(1)
    .paddingLeft(1)
    .paddingInner(1);

  // Apply layout
  return treemap(hierarchy);
};