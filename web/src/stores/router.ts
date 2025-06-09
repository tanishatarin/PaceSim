// // import { atom } from "nanostores";

// // export interface RouteParams {
// //   id?: string;
// //   [key: string]: string | undefined;
// // }

// // export interface RouterPage {
// //   route: string;
// //   params?: RouteParams;
// // }

// // export type RouteName = 'home' | 'login' | 'settings' | 'profile' | 'module';

// // // Create a simple router atom
// // export const $router = atom<RouterPage>({ route: 'home' });

// // // Helper functions for navigation
// // export const goHome = (): void => {
// //   $router.set({ route: 'home' });
// //   updateURL('/');
// // };

// // export const goToSettings = (): void => {
// //   $router.set({ route: 'settings' });
// //   updateURL('/settings');
// // };

// // export const goToProfile = (): void => {
// //   $router.set({ route: 'profile' });
// //   updateURL('/profile');
// // };

// // export const goToLogin = (): void => {
// //   $router.set({ route: 'login' });
// //   updateURL('/login');
// // };

// // export const goToModule = (id: number): void => {
// //   $router.set({ 
// //     route: 'module', 
// //     params: { id: id.toString() } 
// //   });
// //   updateURL(`/module/${id}`);
// // };

// // // Helper to update browser URL
// // const updateURL = (path: string): void => {
// //   if (typeof window !== 'undefined' && window.location.pathname !== path) {
// //     window.history.pushState({}, '', path);
// //   }
// // };

// // // Parse current URL and set initial route
// // const parseCurrentURL = (): RouterPage => {
// //   if (typeof window === 'undefined') {
// //     return { route: 'home' };
// //   }
  
// //   const path = window.location.pathname;
  
// //   if (path === '/') {
// //     return { route: 'home' };
// //   } else if (path === '/settings') {
// //     return { route: 'settings' };
// //   } else if (path === '/profile') {
// //     return { route: 'profile' };
// //   } else if (path === '/login') {
// //     return { route: 'login' };
// //   } else if (path.startsWith('/module/')) {
// //     const moduleId = path.split('/')[2];
// //     return { 
// //       route: 'module', 
// //       params: { id: moduleId || '1' } 
// //     };
// //   }
  
// //   return { route: 'home' };
// // };

// // // Initialize router
// // if (typeof window !== 'undefined') {
// //   // Set initial route based on current URL
// //   $router.set(parseCurrentURL());

// //   // Listen to browser back/forward buttons
// //   window.addEventListener('popstate', (): void => {
// //     $router.set(parseCurrentURL());
// //   });
// // }

// // src/stores/router.ts - Simple router implementation with proper types
// import { atom } from "nanostores";

// export interface RouteParams {
//   id?: string;
//   [key: string]: string | undefined;
// }

// export interface RouterPage {
//   route: string;
//   params?: RouteParams;
// }

// export type RouteName = 'home' | 'login' | 'settings' | 'profile' | 'module';

// // Create a simple router atom
// export const $router = atom<RouterPage>({ route: 'home' });

// // Helper functions for navigation
// export const goHome = (): void => {
//   $router.set({ route: 'home' });
//   updateURL('/');
// };

// export const goToSettings = (): void => {
//   $router.set({ route: 'settings' });
//   updateURL('/settings');
// };

// export const goToProfile = (): void => {
//   $router.set({ route: 'profile' });
//   updateURL('/profile');
// };

// export const goToLogin = (): void => {
//   $router.set({ route: 'login' });
//   updateURL('/login');
// };

// export const goToModule = (id: number): void => {
//   $router.set({ 
//     route: 'module', 
//     params: { id: id.toString() } 
//   });
//   updateURL(`/module/${id}`);
// };

// // Helper to update browser URL
// const updateURL = (path: string): void => {
//   if (typeof window !== 'undefined' && window.location.pathname !== path) {
//     window.history.pushState({}, '', path);
//   }
// };

// // Parse current URL and set initial route
// const parseCurrentURL = (): RouterPage => {
//   if (typeof window === 'undefined') {
//     return { route: 'home' };
//   }
  
//   const path = window.location.pathname;
  
//   if (path === '/') {
//     return { route: 'home' };
//   } else if (path === '/settings') {
//     return { route: 'settings' };
//   } else if (path === '/profile') {
//     return { route: 'profile' };
//   } else if (path === '/login') {
//     return { route: 'login' };
//   } else if (path.startsWith('/module/')) {
//     const moduleId = path.split('/')[2];
//     return { 
//       route: 'module', 
//       params: { id: moduleId || '1' } 
//     };
//   }
  
//   return { route: 'home' };
// };

// // Initialize router
// if (typeof window !== 'undefined') {
//   // Set initial route based on current URL
//   $router.set(parseCurrentURL());

//   // Listen to browser back/forward buttons
//   window.addEventListener('popstate', (): void => {
//     $router.set(parseCurrentURL());
//   });
// }


// src/stores/router.ts - Debug version with console logs
import { atom } from "nanostores";

interface RouterState {
  route: string;
  moduleId?: number;
}

export const $router = atom<RouterState>({ route: 'home' });

export const goHome = () => {
  console.log('🏠 Navigating to home');
  $router.set({ route: 'home' });
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', '/');
  }
};

export const goToSettings = () => {
  console.log('⚙️ Navigating to settings');
  $router.set({ route: 'settings' });
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', '/settings');
  }
};

export const goToProfile = () => {
  console.log('👤 Navigating to profile');
  $router.set({ route: 'profile' });
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', '/profile');
  }
};

export const goToLogin = () => {
  console.log('🔑 Navigating to login');
  $router.set({ route: 'login' });
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', '/login');
  }
};

export const goToModule = (id: number) => {
  console.log(`📚 Navigating to module ${id}`);
  $router.set({ route: 'module', moduleId: id });
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', `/module/${id}`);
  }
};

// Parse URL and set initial route
const initializeRouter = () => {
  if (typeof window === 'undefined') return;
  
  const path = window.location.pathname;
  console.log('🔄 Initializing router for path:', path);
  
  if (path === '/') {
    console.log('📍 Setting route to home');
    $router.set({ route: 'home' });
  } else if (path === '/settings') {
    console.log('📍 Setting route to settings');
    $router.set({ route: 'settings' });
  } else if (path === '/profile') {
    console.log('📍 Setting route to profile');
    $router.set({ route: 'profile' });
  } else if (path === '/login') {
    console.log('📍 Setting route to login');
    $router.set({ route: 'login' });
  } else if (path.startsWith('/module/')) {
    const moduleId = parseInt(path.split('/')[2] || '1');
    console.log(`📍 Setting route to module ${moduleId}`);
    $router.set({ route: 'module', moduleId });
  } else {
    console.log('📍 Unknown path, defaulting to home');
    $router.set({ route: 'home' });
  }
};

// Handle browser navigation
const handlePopState = () => {
  console.log('🔙 Browser back/forward detected');
  initializeRouter();
};

// Initialize when the module loads
if (typeof window !== 'undefined') {
  initializeRouter();
  window.addEventListener('popstate', handlePopState);
  
  // Debug: Log router state changes
  $router.subscribe((state) => {
    console.log('🔄 Router state changed to:', state);
  });
}