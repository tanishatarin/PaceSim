// src/types/router.ts - Type definitions for router
export interface RouteParams {
  id?: string;
  [key: string]: string | undefined;
}

export interface RouterPage {
  route: string;
  params?: RouteParams;
}

export type RouteName = 'home' | 'login' | 'settings' | 'profile' | 'module';