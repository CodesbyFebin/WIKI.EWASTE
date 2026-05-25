import { InfographicData, BRAND_COLORS, PINTEREST_DIMENSIONS } from './types';

export class InfographicGenerator {
  static generateProcessFlow(data: InfographicData): string {
    const { title, data: flowData } = data;
    const steps = flowData.steps || [];
    
    const stepWidth = PINTEREST_DIMENSIONS.width / (steps.length + 1);
    const stepHeight = 150;
    const yStart = 200;

    let svg = `
      <svg width="${PINTEREST_DIMENSIONS.width}" height="${PINTEREST_DIMENSIONS.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="${PINTEREST_DIMENSIONS.width}" height="${PINTEREST_DIMENSIONS.height}" fill="${BRAND_COLORS.black}"/>
        
        <!-- Title -->
        <text x="${PINTEREST_DIMENSIONS.width / 2}" y="80" font-size="48" font-weight="bold" fill="${BRAND_COLORS.neonGreen}" text-anchor="middle" font-family="Arial, sans-serif">
          ${title}
        </text>
        
        <!-- Steps -->
        ${steps.map((step: any, index: number) => {
          const x = (index + 1) * stepWidth;
          const stepNum = index + 1;
          return `
            <!-- Step ${stepNum} -->
            <circle cx="${x}" cy="${yStart}" r="40" fill="${BRAND_COLORS.neonGreen}" stroke="${BRAND_COLORS.white}" stroke-width="2"/>
            <text x="${x}" y="${yStart + 15}" font-size="24" font-weight="bold" fill="${BRAND_COLORS.black}" text-anchor="middle" font-family="Arial, sans-serif">
              ${stepNum}
            </text>
            <text x="${x}" y="${yStart + 120}" font-size="16" fill="${BRAND_COLORS.neonGreen}" text-anchor="middle" font-family="Arial, sans-serif" width="${stepWidth - 20}">
              ${step.name}
            </text>
            ${index < steps.length - 1 ? `
              <line x1="${x + 50}" y1="${yStart}" x2="${(index + 2) * stepWidth - 50}" y2="${yStart}" stroke="${BRAND_COLORS.neonGreen}" stroke-width="3" stroke-dasharray="5,5"/>
            ` : ''}
          `;
        }).join('')}
        
        <!-- Description -->
        <text x="50" y="${PINTEREST_DIMENSIONS.height - 80}" font-size="18" fill="${BRAND_COLORS.lightGray}" font-family="Arial, sans-serif" width="${PINTEREST_DIMENSIONS.width - 100}">
          ${flowData.description || 'Step-by-step process guide'}
        </text>
        
        <!-- Branding -->
        <text x="50" y="${PINTEREST_DIMENSIONS.height - 20}" font-size="14" fill="${BRAND_COLORS.neonGreen}" font-family="Arial, sans-serif">
          ewastekochi.com
        </text>
      </svg>
    `;
    
    return svg.trim();
  }

  static generateDataVisualization(data: InfographicData): string {
    const { title, data: vizData } = data;
    const dataPoints = vizData.dataPoints || [];
    const maxValue = Math.max(...dataPoints.map((d: any) => d.value));

    const chartX = 150;
    const chartY = 200;
    const chartWidth = PINTEREST_DIMENSIONS.width - 200;
    const chartHeight = 800;
    const barWidth = chartWidth / dataPoints.length;

    let svg = `
      <svg width="${PINTEREST_DIMENSIONS.width}" height="${PINTEREST_DIMENSIONS.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="${PINTEREST_DIMENSIONS.width}" height="${PINTEREST_DIMENSIONS.height}" fill="${BRAND_COLORS.black}"/>
        
        <!-- Title -->
        <text x="${PINTEREST_DIMENSIONS.width / 2}" y="80" font-size="48" font-weight="bold" fill="${BRAND_COLORS.neonGreen}" text-anchor="middle" font-family="Arial, sans-serif">
          ${title}
        </text>
        
        <!-- Chart Grid -->
        <line x1="${chartX}" y1="${chartY}" x2="${chartX}" y2="${chartY + chartHeight}" stroke="${BRAND_COLORS.neonGreen}" stroke-width="2"/>
        <line x1="${chartX}" y1="${chartY + chartHeight}" x2="${chartX + chartWidth}" y2="${chartY + chartHeight}" stroke="${BRAND_COLORS.neonGreen}" stroke-width="2"/>
        
        <!-- Data Bars -->
        ${dataPoints.map((point: any, index: number) => {
          const barHeight = (point.value / maxValue) * chartHeight;
          const x = chartX + (index * barWidth) + 20;
          const y = chartY + chartHeight - barHeight;
          
          return `
            <rect x="${x}" y="${y}" width="${barWidth - 40}" height="${barHeight}" fill="${BRAND_COLORS.neonGreen}" opacity="0.8"/>
            <text x="${x + (barWidth - 40) / 2}" y="${chartY + chartHeight + 30}" font-size="14" fill="${BRAND_COLORS.lightGray}" text-anchor="middle" font-family="Arial, sans-serif">
              ${point.label}
            </text>
            <text x="${x + (barWidth - 40) / 2}" y="${y - 10}" font-size="16" font-weight="bold" fill="${BRAND_COLORS.neonGreen}" text-anchor="middle" font-family="Arial, sans-serif">
              ${point.value}${point.unit || ''}
            </text>
          `;
        }).join('')}
        
        <!-- Branding -->
        <text x="50" y="${PINTEREST_DIMENSIONS.height - 20}" font-size="14" fill="${BRAND_COLORS.neonGreen}" font-family="Arial, sans-serif">
          ewastekochi.com
        </text>
      </svg>
    `;
    
    return svg.trim();
  }

  static generateComparison(data: InfographicData): string {
    const { title, data: compData } = data;
    const items = compData.items || [];

    const itemWidth = PINTEREST_DIMENSIONS.width / items.length;
    
    let svg = `
      <svg width="${PINTEREST_DIMENSIONS.width}" height="${PINTEREST_DIMENSIONS.height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="${PINTEREST_DIMENSIONS.width}" height="${PINTEREST_DIMENSIONS.height}" fill="${BRAND_COLORS.black}"/>
        
        <!-- Title -->
        <text x="${PINTEREST_DIMENSIONS.width / 2}" y="80" font-size="48" font-weight="bold" fill="${BRAND_COLORS.neonGreen}" text-anchor="middle" font-family="Arial, sans-serif">
          ${title}
        </text>
        
        <!-- Comparison Items -->
        ${items.map((item: any, index: number) => {
          const x = (index + 0.5) * itemWidth;
          const startY = 150;
          
          return `
            <g>
              <!-- Item box -->
              <rect x="${x - itemWidth/2 + 20}" y="${startY}" width="${itemWidth - 40}" height="1100" fill="none" stroke="${BRAND_COLORS.neonGreen}" stroke-width="2"/>
              
              <!-- Item title -->
              <text x="${x}" y="${startY + 50}" font-size="24" font-weight="bold" fill="${BRAND_COLORS.neonGreen}" text-anchor="middle" font-family="Arial, sans-serif">
                ${item.name}
              </text>
              
              <!-- Properties -->
              ${(item.properties || []).map((prop: any, propIndex: number) => {
                return `
                  <text x="${x - itemWidth/2 + 40}" y="${startY + 100 + (propIndex * 80)}" font-size="14" fill="${BRAND_COLORS.lightGray}" font-family="Arial, sans-serif">
                    ${prop.label}
                  </text>
                  <text x="${x - itemWidth/2 + 40}" y="${startY + 130 + (propIndex * 80)}" font-size="18" font-weight="bold" fill="${BRAND_COLORS.neonGreen}" font-family="Arial, sans-serif">
                    ${prop.value}
                  </text>
                `;
              }).join('')}
            </g>
          `;
        }).join('')}
        
        <!-- Branding -->
        <text x="50" y="${PINTEREST_DIMENSIONS.height - 20}" font-size="14" fill="${BRAND_COLORS.neonGreen}" font-family="Arial, sans-serif">
          ewastekochi.com
        </text>
      </svg>
    `;
    
    return svg.trim();
  }

  static generate(infographic: InfographicData): string {
    switch (infographic.type) {
      case 'process-flow':
        return this.generateProcessFlow(infographic);
      case 'data-visualization':
        return this.generateDataVisualization(infographic);
      case 'comparison':
        return this.generateComparison(infographic);
      default:
        return this.generateProcessFlow(infographic);
    }
  }
}
