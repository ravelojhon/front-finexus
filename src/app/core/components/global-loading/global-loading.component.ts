import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="global-loading-overlay" *ngIf="isLoading$ | async">
      <div class="global-loading-container">
        <div class="global-loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div class="global-loading-text">
          <p class="mb-0">Cargando...</p>
          <small class="text-muted">Por favor espera</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }

    .global-loading-container {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      text-align: center;
      min-width: 200px;
      animation: fadeInScale 0.3s ease-out;
    }

    .global-loading-spinner {
      margin-bottom: 1rem;
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
      border-width: 0.25rem;
    }

    .global-loading-text p {
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.25rem;
    }

    .global-loading-text small {
      font-size: 0.875rem;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Responsive */
    @media (max-width: 576px) {
      .global-loading-container {
        margin: 1rem;
        padding: 1.5rem;
        min-width: 150px;
      }
      
      .spinner-border {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  `]
})
export class GlobalLoadingComponent {
  isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
  }
}
