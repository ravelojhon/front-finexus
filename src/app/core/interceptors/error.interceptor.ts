import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ha ocurrido un error inesperado';
    let errorType: 'error' | 'warning' | 'info' = 'error';

    // Determinar el tipo de error y mensaje
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = this.getClientErrorMessage(error.error);
      errorType = 'warning';
    } else {
      // Error del lado del servidor
      const serverError = this.getServerErrorMessage(error);
      errorMessage = serverError.message;
      errorType = serverError.type;
    }

    // Mostrar toast con el error
    this.toastService.show(errorMessage, errorType);

    // Log del error para debugging
    console.error('🚨 Error HTTP:', {
      status: error.status,
      message: errorMessage,
      url: error.url,
      error: error.error
    });
  }

  private getClientErrorMessage(error: ErrorEvent): string {
    switch (error.type) {
      case 'network':
        return 'Error de conexión. Verifica tu conexión a internet.';
      case 'timeout':
        return 'La solicitud ha tardado demasiado. Intenta nuevamente.';
      default:
        return 'Error del navegador. Recarga la página si el problema persiste.';
    }
  }

  private getServerErrorMessage(error: HttpErrorResponse): { message: string; type: 'error' | 'warning' | 'info' } {
    const status = error.status;
    const errorBody = error.error;

    // Mensajes específicos por código de estado
    switch (status) {
      case 0:
        return {
          message: 'No se puede conectar con el servidor. Verifica tu conexión.',
          type: 'error'
        };

      case 400:
        return {
          message: this.getValidationErrorMessage(errorBody) || 'Datos inválidos. Verifica la información ingresada.',
          type: 'warning'
        };

      case 401:
        return {
          message: 'No tienes autorización. Inicia sesión nuevamente.',
          type: 'warning'
        };

      case 403:
        return {
          message: 'No tienes permisos para realizar esta acción.',
          type: 'warning'
        };

      case 404:
        return {
          message: 'El recurso solicitado no existe.',
          type: 'info'
        };

      case 409:
        return {
          message: this.getConflictErrorMessage(errorBody) || 'Conflicto: El recurso ya existe o está en uso.',
          type: 'warning'
        };

      case 422:
        return {
          message: this.getValidationErrorMessage(errorBody) || 'Datos de entrada inválidos.',
          type: 'warning'
        };

      case 429:
        return {
          message: 'Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.',
          type: 'warning'
        };

      case 500:
        return {
          message: 'Error interno del servidor. Nuestro equipo ha sido notificado.',
          type: 'error'
        };

      case 502:
        return {
          message: 'Servidor no disponible temporalmente. Intenta en unos minutos.',
          type: 'error'
        };

      case 503:
        return {
          message: 'Servicio temporalmente no disponible. Intenta más tarde.',
          type: 'error'
        };

      case 504:
        return {
          message: 'Tiempo de espera agotado. Intenta nuevamente.',
          type: 'warning'
        };

      default:
        if (status >= 500) {
          return {
            message: 'Error del servidor. Intenta nuevamente más tarde.',
            type: 'error'
          };
        } else if (status >= 400) {
          return {
            message: 'Error en la solicitud. Verifica los datos e intenta nuevamente.',
            type: 'warning'
          };
        } else {
          return {
            message: 'Error inesperado. Intenta nuevamente.',
            type: 'error'
          };
        }
    }
  }

  private getValidationErrorMessage(errorBody: any): string | null {
    if (!errorBody) return null;

    // Manejar diferentes formatos de errores de validación
    if (errorBody.message) {
      return errorBody.message;
    }

    if (errorBody.errors && Array.isArray(errorBody.errors)) {
      return errorBody.errors.map((err: any) => err.message || err).join('. ');
    }

    if (errorBody.error && typeof errorBody.error === 'string') {
      return errorBody.error;
    }

    return null;
  }

  private getConflictErrorMessage(errorBody: any): string | null {
    if (!errorBody) return null;

    if (errorBody.message) {
      return errorBody.message;
    }

    if (errorBody.error && typeof errorBody.error === 'string') {
      return errorBody.error;
    }

    return null;
  }
}