import { cn } from './utils';

// Lista de rotas válidas do aplicativo
// Esta lista deve ser mantida atualizada com as rotas disponíveis na aplicação
const validRoutes = [
  '/',
  '/dashboard',
  '/profile',
  '/goals',
  '/transactions',
  '/admin',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/not-found',
  '/forbidden',
];

/**
 * Verifica se uma rota existe no aplicativo
 * @param route Rota a ser verificada
 * @returns Booleano indicando se a rota existe
 */
export function routeExists(route: string): boolean {
  // Remove trailing slash se existir
  const normalizedRoute = route.endsWith('/') ? route.slice(0, -1) : route;

  // Verifica se é uma rota exata ou se é uma subrota válida
  return validRoutes.some(
    validRoute =>
      normalizedRoute === validRoute ||
      (normalizedRoute.startsWith(validRoute + '/') && validRoute !== '/')
  );
}

/**
 * Redireciona para a página 404 se a rota não existir
 * @param route Rota a ser verificada
 * @param navigate Função de navegação
 */
export function redirectIfRouteNotExists(
  route: string,
  navigate: (path: string) => void
): boolean {
  if (!routeExists(route)) {
    navigate('/not-found');
    return true;
  }
  return false;
}
