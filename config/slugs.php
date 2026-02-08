<?php

return [
    /**
     * Reserved slugs that cannot be used for valentines.
     * These include system routes and common words that could conflict.
     */
    'reserved' => [
        'admin',
        'api',
        'create',
        'for',
        'stats',
        'login',
        'logout',
        'register',
        'settings',
        'preview',
        'dashboard',
        'profile',
        'account',
        'help',
        'support',
        'about',
        'contact',
        'terms',
        'privacy',
        'password',
        'reset',
        'verify',
        'confirmation',
        'valentines',
        'valentine',
    ],

    /**
     * Romantic suffixes used when generating slug suggestions.
     */
    'romantic_suffixes' => [
        '-love',
        '-valentine',
        '-xo',
        '-forever',
        '-always',
        '-hearts',
        '-mine',
        '-yours',
        '-babe',
        '-darling',
        '-sweetheart',
    ],
];
