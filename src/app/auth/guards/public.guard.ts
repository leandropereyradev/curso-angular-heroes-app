import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable, tap, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

const checkAuthStatus = (): boolean | Observable<boolean> => {
  // Se inyectan el AuthService y el Router
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication().pipe(
    // El primer tap es sólo para que veamos en consola que está o no autenticado
    tap((isAuthenticated) => console.log({ Authenticated: isAuthenticated })),
    tap((isAuthenticated) => {
      if (isAuthenticated) router.navigate(['/']);
    }),
    // Como la condición anterior retorna un false
    // hay que convertir ese false en true con un map()
    map((isAuthenticated) => !isAuthenticated)
  );
};

// No hay necesidad de crear una clase, simplemente definiendo una función flecha
// y exportándola podemos utilizar sus funcionalidades de guard en el app-routing
export const canPublicActivateGuard: CanActivateFn = (
  // Hay que tener en cuenta el tipado CanActiveFn
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('CanPublicActivate');
  console.log({ route, state });

  return checkAuthStatus();
  // return false;
};

export const canPublicMatchGuard: CanMatchFn = (
  // Tipado CanMatchFN
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('CanPublicMatch');
  console.log({ route, segments });

  return checkAuthStatus();
  // return false;
};
