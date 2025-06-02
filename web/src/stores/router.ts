// src/stores/router.ts 

import { BASE_URL } from "@/env";
import { logger } from "@nanostores/logger";
import { createRouter } from "@nanostores/router";

const DEBUG = true; // Enable for debugging

const pages = {
  home: `${BASE_URL}/`,
  login: `${BASE_URL}/login`, 
  module: `${BASE_URL}/module/:id`,
  settings: `${BASE_URL}/settings`,
  profile: `${BASE_URL}/profile`,
};

export type Page = keyof typeof pages;

export type Params = {
  id?: string;
};

export const $router = createRouter(pages);

// Enable logging for debugging
if (DEBUG) {
  logger({ $router });
}

// Helper functions for navigation - Fixed API usage
export const openPage = (page: Page) => {
  $router.open(page);
}

export const openModule = (id: number) => {
  $router.open('/module/' + id);
}

export const goHome = () => {
  $router.open('/');
}

export const goToSettings = () => {
  $router.open('/settings');
}

export const goToProfile = () => {
  $router.open('/profile');
}

export const goToLogin = () => {
  $router.open('/login');
}