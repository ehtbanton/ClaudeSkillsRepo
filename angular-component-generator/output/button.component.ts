import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick.emit($event)"
    >
      <span *ngIf="loading" class="spinner"></span>
      <ng-content *ngIf="!loading"></ng-content>
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .primary { background: #3b82f6; color: white; }
    .primary:hover:not(:disabled) { background: #2563eb; }
    .secondary { background: #64748b; color: white; }
    .outline { background: transparent; border: 1px solid #3b82f6; color: #3b82f6; }
    .ghost { background: transparent; color: #3b82f6; }
    .sm { padding: 0.5rem 0.75rem; font-size: 0.875rem; }
    .md { padding: 0.75rem 1rem; font-size: 1rem; }
    .lg { padding: 1rem 1.5rem; font-size: 1.125rem; }
    .spinner {
      width: 1rem; height: 1rem;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return `${this.variant} ${this.size}`;
  }
}
