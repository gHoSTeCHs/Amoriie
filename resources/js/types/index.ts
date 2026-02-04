export type * from './auth';
export type * from './media';
export type * from './navigation';
export type * from './template';
export type * from './ui';
export type * from './valentine';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};
