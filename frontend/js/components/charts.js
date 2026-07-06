/**
 * Lightweight SVG & CSS Charts Component.
 * Implements Donut, Pie, and Horizontal Bar charts without external dependencies.
 */

/**
 * Renders a Donut Chart representing repository processing statuses.
 * @param {HTMLElement} container The DOM element to render into.
 * @param {Array<Object>} statusList Array of { status: string, count: number } objects.
 */
export function renderStatusChart(container, statusList) {
  if (!container) return;

  if (!statusList || !statusList.length) {
    container.innerHTML = `<div class="text-muted text-center py-xl">No processing data available.</div>`;
    return;
  }

  const total = statusList.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    container.innerHTML = `<div class="text-muted text-center py-xl">No processing data available.</div>`;
    return;
  }

  // Define colors for each status
  const colors = {
    completed: 'var(--color-success)',
    processing: 'var(--color-warning)',
    pending: 'var(--color-info)',
    failed: 'var(--color-danger)'
  };

  const defaultColor = 'var(--color-text-muted)';

  // Circumference calculations for radius = 40 (box size 100x100)
  const radius = 35;
  const circ = 2 * Math.PI * radius; // ~219.91
  
  let cumulativePercent = 0;
  let circlesHTML = '';
  
  // Sort status list: completed first, then processing, etc.
  const sorted = [...statusList].sort((a, b) => b.count - a.count);

  sorted.forEach(item => {
    const percent = (item.count / total) * 100;
    const strokeDash = (percent / 100) * circ;
    const strokeOffset = circ - strokeDash;
    const rotation = (cumulativePercent / 100) * 360 - 90; // Start at top center (-90deg)
    
    const color = colors[item.status.toLowerCase()] || defaultColor;

    circlesHTML += `
      <circle 
        cx="50" cy="50" r="${radius}" 
        fill="transparent" 
        stroke="${color}" 
        stroke-width="10" 
        stroke-dasharray="${circ}" 
        stroke-dashoffset="${strokeOffset}" 
        transform="rotate(${rotation} 50 50)"
        stroke-linecap="${percent === 100 ? 'butt' : 'round'}"
        class="chart-donut-segment"
        data-percent="${percent.toFixed(1)}%"
        data-label="${item.status}"
      ></circle>
    `;
    cumulativePercent += percent;
  });

  container.innerHTML = `
    <div class="chart-donut-container">
      <div class="chart-donut-graphic">
        <svg viewBox="0 0 100 100" class="chart-svg-donut">
          <!-- Background track -->
          <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="var(--color-border)" stroke-width="10"></circle>
          ${circlesHTML}
        </svg>
        <div class="chart-donut-center">
          <div class="chart-donut-metric-val">${total}</div>
          <div class="chart-donut-metric-lbl">Total</div>
        </div>
      </div>
      
      <!-- Legends -->
      <div class="chart-legends mt-md">
        ${sorted.map(item => {
          const color = colors[item.status.toLowerCase()] || defaultColor;
          const percent = ((item.count / total) * 100).toFixed(0);
          return `
            <div class="chart-legend-item">
              <span class="legend-dot" style="background-color: ${color};"></span>
              <span class="legend-label capitalize">${item.status}</span>
              <span class="legend-value">${item.count} (${percent}%)</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Renders a Pie (Donut type) Chart representing language distribution.
 * @param {HTMLElement} container The DOM element to render into.
 * @param {Array<Object>} languages Array of { language: string, count: number } objects.
 */
export function renderLanguageChart(container, languages) {
  if (!container) return;

  if (!languages || !languages.length) {
    container.innerHTML = `<div class="text-muted text-center py-xl">No language data available.</div>`;
    return;
  }

  const total = languages.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    container.innerHTML = `<div class="text-muted text-center py-xl">No language data available.</div>`;
    return;
  }

  // Pre-selected modern colors
  const palette = [
    '#6c5ce7', // Purple
    '#00d2d3', // Blue
    '#ff9f43', // Orange
    '#10ac84', // Green
    '#ee5253', // Red
    '#0abde3', // Cyan
    '#f368e0', // Pink
    '#ffcd56'  // Yellow
  ];

  const radius = 35;
  const circ = 2 * Math.PI * radius; // ~219.91
  
  let cumulativePercent = 0;
  let circlesHTML = '';
  
  const sorted = [...languages].sort((a, b) => b.count - a.count);

  sorted.forEach((item, index) => {
    const percent = (item.count / total) * 100;
    const strokeDash = (percent / 100) * circ;
    const strokeOffset = circ - strokeDash;
    const rotation = (cumulativePercent / 100) * 360 - 90;
    
    const color = palette[index % palette.length];

    circlesHTML += `
      <circle 
        cx="50" cy="50" r="${radius}" 
        fill="transparent" 
        stroke="${color}" 
        stroke-width="8" 
        stroke-dasharray="${circ}" 
        stroke-dashoffset="${strokeOffset}" 
        transform="rotate(${rotation} 50 50)"
        stroke-linecap="${percent === 100 ? 'butt' : 'round'}"
        class="chart-donut-segment"
      ></circle>
    `;
    cumulativePercent += percent;
  });

  container.innerHTML = `
    <div class="chart-donut-container">
      <div class="chart-donut-graphic">
        <svg viewBox="0 0 100 100" class="chart-svg-donut">
          <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="var(--color-border)" stroke-width="8"></circle>
          ${circlesHTML}
        </svg>
        <div class="chart-donut-center">
          <div class="chart-donut-metric-val">${sorted.length}</div>
          <div class="chart-donut-metric-lbl">Languages</div>
        </div>
      </div>
      
      <!-- Legends -->
      <div class="chart-legends mt-md">
        ${sorted.slice(0, 5).map((item, index) => {
          const color = palette[index % palette.length];
          const percent = ((item.count / total) * 100).toFixed(1);
          return `
            <div class="chart-legend-item">
              <span class="legend-dot" style="background-color: ${color};"></span>
              <span class="legend-label">${item.language}</span>
              <span class="legend-value">${percent}%</span>
            </div>
          `;
        }).join('')}
        ${sorted.length > 5 ? `<div class="text-muted text-center text-xs mt-xs">+ ${sorted.length - 5} more</div>` : ''}
      </div>
    </div>
  `;
}

/**
 * Renders a horizontal bar chart displaying project type counts.
 * @param {HTMLElement} container The DOM element to render into.
 * @param {Array<Object>} projectTypes Array of { value: string, count: number } objects.
 */
export function renderProjectTypeChart(container, projectTypes) {
  if (!container) return;

  if (!projectTypes || !projectTypes.length) {
    container.innerHTML = `<div class="text-muted text-center py-xl">No project type data available.</div>`;
    return;
  }

  // Find max value to determine percentage width scale
  const max = Math.max(...projectTypes.map(item => item.count));
  const total = projectTypes.reduce((sum, item) => sum + item.count, 0);

  const sorted = [...projectTypes].sort((a, b) => b.count - a.count);

  container.innerHTML = `
    <div class="chart-bar-container flex flex-col gap-md mt-sm">
      ${sorted.slice(0, 5).map(item => {
        const percent = max > 0 ? (item.count / max) * 100 : 0;
        const totalPercent = total > 0 ? ((item.count / total) * 100).toFixed(0) : 0;
        return `
          <div class="chart-bar-row">
            <div class="flex justify-between items-center text-sm mb-xxs">
              <span class="font-medium text-secondary">${item.value}</span>
              <span class="font-bold text-muted">${item.count} repos (${totalPercent}%)</span>
            </div>
            <div class="chart-bar-track">
              <div class="chart-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
