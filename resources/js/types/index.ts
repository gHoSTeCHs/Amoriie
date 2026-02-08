export type * from './auth';
export type * from './customizations';
export type * from './media';
export type * from './navigation';
export type * from './publish';
export type * from './template';
export type * from './ui';
export type * from './valentine';
export type * from './viewer';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
};
