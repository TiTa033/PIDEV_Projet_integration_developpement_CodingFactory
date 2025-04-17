import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChartLoaderService {
  private chartJsLoaded = false;

  loadChartJsScript(): Promise<void> {
    if (this.chartJsLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'node_modules/chart.js/dist/chart.min.js';
      script.onload = () => {
        this.chartJsLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }
}
