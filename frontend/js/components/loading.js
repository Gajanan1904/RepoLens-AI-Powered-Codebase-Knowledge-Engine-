/**
 * Skeleton Loader Components.
 */

/**
 * HTML skeleton for statistics metrics.
 * @returns {string}
 */
export function getStatsSkeletonHTML() {
  return `
    <div class="skeleton-container grid grid-cols-2 md-grid-cols-3 lg-grid-cols-6 gap-md w-full">
      ${Array(6).fill(`
        <div class="card skeleton-card">
          <div class="skeleton skeleton-title w-full h-md mb-sm"></div>
          <div class="skeleton skeleton-metric w-half h-xl"></div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * HTML skeleton for repository grid list.
 * @param {number} count Number of skeleton cards to render.
 * @returns {string}
 */
export function getRepoListSkeletonHTML(count = 6) {
  return `
    <div class="skeleton-container grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-3 gap-lg w-full">
      ${Array(count).fill(`
        <div class="card skeleton-card">
          <div class="skeleton skeleton-icon w-lg h-lg mb-md"></div>
          <div class="skeleton skeleton-title w-two-thirds h-lg mb-sm"></div>
          <div class="skeleton skeleton-desc w-full h-md mb-md"></div>
          <div class="flex gap-sm justify-between">
            <div class="skeleton skeleton-badge w-third h-md"></div>
            <div class="skeleton skeleton-badge w-third h-md"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * HTML skeleton for dashboard charts.
 * @returns {string}
 */
export function getChartsSkeletonHTML() {
  return `
    <div class="skeleton-container grid grid-cols-1 md-grid-cols-3 gap-lg w-full">
      <div class="card skeleton-card flex flex-col justify-between" style="height: 320px;">
        <div class="skeleton skeleton-title w-half h-md"></div>
        <div class="skeleton skeleton-circle w-xl h-xl align-self-center my-md"></div>
        <div class="skeleton skeleton-desc w-full h-md"></div>
      </div>
      <div class="card skeleton-card flex flex-col justify-between" style="height: 320px;">
        <div class="skeleton skeleton-title w-half h-md"></div>
        <div class="skeleton skeleton-circle w-xl h-xl align-self-center my-md"></div>
        <div class="skeleton skeleton-desc w-full h-md"></div>
      </div>
      <div class="card skeleton-card flex flex-col justify-between" style="height: 320px;">
        <div class="skeleton skeleton-title w-half h-md"></div>
        <div class="skeleton skeleton-desc w-full h-lg my-md"></div>
        <div class="skeleton skeleton-desc w-full h-lg mb-md"></div>
      </div>
    </div>
  `;
}

/**
 * HTML skeleton for a recent repositories table.
 * @returns {string}
 */
export function getTableSkeletonHTML() {
  return `
    <div class="skeleton-container w-full">
      <div class="skeleton skeleton-title w-third h-lg mb-md"></div>
      <div class="card skeleton-card p-none">
        <div class="table-responsive">
          <table class="table-skeleton-table">
            <thead>
              <tr>
                ${Array(4).fill('<th><div class="skeleton w-third h-sm"></div></th>').join('')}
              </tr>
            </thead>
            <tbody>
              ${Array(3).fill(`
                <tr>
                  ${Array(4).fill('<td><div class="skeleton w-two-thirds h-md"></div></td>').join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
