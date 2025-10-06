import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts$ | async; trackBy: trackByToastId"
        class="toast-item"
        [class]="getToastClass(toast.type)"
        [@slideInOut]
        (click)="removeToast(toast.id)">
        <div class="toast-content">
          <div class="toast-icon">
            <i class="fas" [class]="getToastIcon(toast.type)"></i>
          </div>
          <div class="toast-message">
            <p class="mb-0">{{ toast.message }}</p>
            <small class="text-muted">{{ toast.timestamp | date:'HH:mm:ss' }}</small>
          </div>
          <button 
            class="toast-close"
            (click)="removeToast(toast.id); $event.stopPropagation()"
            title="Cerrar">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div 
          *ngIf="toast.duration && toast.duration > 0"
          class="toast-progress"
          [style.animation-duration]="toast.duration + 'ms'">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      max-width: 400px;
      width: 100%;
    }

    .toast-item {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
      margin-bottom: 0.75rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .toast-item:hover {
      transform: translateX(-4px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    .toast-content {
      display: flex;
      align-items: center;
      padding: 1rem;
      gap: 0.75rem;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
    }

    .toast-message {
      flex: 1;
      min-width: 0;
    }

    .toast-message p {
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.25rem;
      word-wrap: break-word;
    }

    .toast-message small {
      font-size: 0.75rem;
      color: #6c757d;
    }

    .toast-close {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background-color: #f8f9fa;
      color: #495057;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8));
      animation: progressBar linear;
    }

    /* Toast types */
    .toast-success {
      border-left: 4px solid #198754;
    }

    .toast-success .toast-icon {
      background-color: #d1edff;
      color: #198754;
    }

    .toast-error {
      border-left: 4px solid #dc3545;
    }

    .toast-error .toast-icon {
      background-color: #f8d7da;
      color: #dc3545;
    }

    .toast-warning {
      border-left: 4px solid #fd7e14;
    }

    .toast-warning .toast-icon {
      background-color: #fff3cd;
      color: #fd7e14;
    }

    .toast-info {
      border-left: 4px solid #0dcaf0;
    }

    .toast-info .toast-icon {
      background-color: #d1ecf1;
      color: #0dcaf0;
    }

    /* Animations */
    @keyframes slideInOut {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes progressBar {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    /* Responsive */
    @media (max-width: 576px) {
      .toast-container {
        top: 0.5rem;
        right: 0.5rem;
        left: 0.5rem;
        max-width: none;
      }

      .toast-content {
        padding: 0.75rem;
        gap: 0.5rem;
      }

      .toast-icon {
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.8rem;
      }
    }
  `],
  animations: [
    // Animación simple para slide in/out
    {
      trigger: 'slideInOut',
      state: 'in', style: { opacity: 1, transform: 'translateX(0)' },
      transition: 'void => *', animate: '300ms ease-out'
    }
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts$: Observable<ToastMessage[]>;
  private destroy$ = new Subject<void>();

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  ngOnInit(): void {
    // Suscribirse a los toasts
    this.toasts$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  trackByToastId(index: number, toast: ToastMessage): string {
    return toast.id;
  }

  getToastClass(type: string): string {
    return `toast-${type}`;
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-info-circle';
    }
  }
}
