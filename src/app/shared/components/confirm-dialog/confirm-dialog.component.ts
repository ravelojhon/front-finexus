import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="dialog-overlay" *ngIf="isVisible" (click)="onCancel()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button 
            type="button" 
            class="btn btn-secondary" 
            (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .dialog-title {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.2rem;
    }

    .dialog-message {
      margin: 0 0 2rem 0;
      color: #666;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Confirmar';
  @Input() message: string = '¿Estás seguro?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
