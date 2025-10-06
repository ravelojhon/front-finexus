import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

  private defaultDuration = 5000; // 5 segundos
  private maxToasts = 5; // Máximo 5 toasts simultáneos

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration?: number): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      message,
      type,
      duration: duration || this.getDefaultDuration(type),
      timestamp: new Date()
    };

    const currentToasts = this.toastsSubject.value;
    
    // Limitar número de toasts
    if (currentToasts.length >= this.maxToasts) {
      currentToasts.shift(); // Remover el más antiguo
    }

    // Agregar nuevo toast
    const newToasts = [...currentToasts, toast];
    this.toastsSubject.next(newToasts);

    // Auto-remover después de la duración especificada
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration);
    }

    // Log para debugging
    console.log(`🍞 Toast ${type}:`, message);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const filteredToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(filteredToasts);
  }

  clear(): void {
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultDuration(type: 'success' | 'error' | 'warning' | 'info'): number {
    switch (type) {
      case 'success':
        return 3000; // 3 segundos
      case 'error':
        return 7000; // 7 segundos
      case 'warning':
        return 5000; // 5 segundos
      case 'info':
        return 4000; // 4 segundos
      default:
        return this.defaultDuration;
    }
  }
}
