<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    @php
        $ogTitle = $page['props']['og_title'] ?? 'Amoriie — Create Beautiful Love Letters & Valentines';
        $ogDescription = $page['props']['og_description'] ?? 'Create beautiful, personalized love letters and valentines for your special someone. Choose from stunning themes, add music, and share your feelings.';
        $ogImage = $page['props']['og_image_url'] ?? asset('ogimage.jpg');
        $ogUrl = $page['props']['og_url'] ?? url()->current();
    @endphp

    <title inertia>{{ $ogTitle }}</title>

    <meta property="og:type" content="website">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $ogDescription }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="{{ $ogUrl }}">
    <meta property="og:site_name" content="Amoriie">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $ogTitle }}">
    <meta name="twitter:description" content="{{ $ogDescription }}">
    <meta name="twitter:image" content="{{ $ogImage }}">
    <meta property="og:logo" content="{{ asset('apple-touch-icon.png') }}">

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link
        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|dancing-script:400,500,600,700|cormorant-garamond:400,500,600,700|italiana:400|pinyon-script:400|great-vibes:400|crimson-text:400,600,700|homemade-apple:400|special-elite:400|courier-prime:400,700|ibm-plex-mono:400,500,600|cinzel-decorative:400,700|playfair-display:400,500,600,700|eb-garamond:400,500,600|allura:400|lavishly-yours:400|parisienne:400|lora:400,500,600,700|libre-baskerville:400,700|pacifico:400|inter:400,500,600|source-sans-pro:400,600|caveat:400,500,600,700|nothing-you-could-do:400|merriweather:400,700|alex-brush:400|cormorant:400,500,600"
        rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>
