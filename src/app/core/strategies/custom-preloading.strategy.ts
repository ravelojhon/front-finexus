import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Solo precargar rutas que tengan la propiedad preload: true
    if (route.data && route.data['preload']) {
      console.log('Preloading: ' + route.path);
      return load();
    }
    
    // Para rutas de productos, precargar después de 2 segundos
    if (route.path?.includes('products')) {
      setTimeout(() => {
        load().subscribe();
      }, 2000);
    }
    
    return of(null);
  }
}
