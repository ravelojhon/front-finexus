import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const productGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Aquí puedes agregar lógica de autenticación o validación
  // Por ejemplo, verificar si el usuario tiene permisos para ver productos
  
  // Por ahora, permitimos el acceso
  return true;
};

export const productFormGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Validar si es edición y el ID existe
  const id = route.paramMap.get('id');
  if (state.url.includes('/edit/') && (!id || isNaN(Number(id)))) {
    router.navigate(['/products']);
    return false;
  }
  
  return true;
};
