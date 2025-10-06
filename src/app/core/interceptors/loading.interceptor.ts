import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Incrementar contador de peticiones activas
    this.activeRequests++;
    
    // Mostrar loading si es la primera petición
    if (this.activeRequests === 1) {
      this.loadingService.show();
    }

    return next.handle(request).pipe(
      finalize(() => {
        // Decrementar contador de peticiones activas
        this.activeRequests--;
        
        // Ocultar loading si no hay más peticiones activas
        if (this.activeRequests === 0) {
          this.loadingService.hide();
        }
      })
    );
  }
}
