import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-spinner" [ngClass]="{
      'loading-spinner-small': size === 'small',
      'loading-spinner-large': size === 'large'
    }">
      <mat-spinner [diameter]="diameter" [strokeWidth]="strokeWidth"></mat-spinner>
      <span class="loading-text" *ngIf="text">{{ text }}</span>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() text = '';
  @Input() strokeWidth = 4;

  get diameter(): number {
    switch (this.size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 36;
    }
  }
} 