<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Mariachi Colombia Show en Guadalajara. Contrata serenatas, cumpleaños y eventos con música en vivo. Atención inmediata por WhatsApp o llamada.">
        <meta name="keywords" content="Mariachi Colombia Show, mariachi colombiano Guadalajara, serenata mariachi Guadalajara, contratar mariachi Guadalajara, mariachi para eventos">
        <meta name="author" content="Mariachi Colombia Show">
        <meta property="og:title" content="Mariachi Colombia Show | Mariachi Colombiano en Guadalajara">
        <meta property="og:description" content="Contrata Mariachi Colombia Show para serenatas y eventos en Guadalajara. Música en vivo profesional con atención inmediata.">
        <meta property="og:image" content="https://mariachicolombiashow.com/images/imagenFondo.png">
        <meta property="og:type" content="website">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        <title inertia>{{ config('app.name', 'Mariachi Colombia Show') }}</title>

        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "name": "Mariachi Colombia Show",
            "image": "https://mariachicolombiashow.com/images/imagenFondo.png",
            "url": "https://mariachicolombiashow.com",
            "telephone": "+523339490021",
            "email": "contacto@mariachiguadalajara.com",
            "priceRange": "$$",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Guadalajara",
                "addressRegion": "Jalisco",
                "addressCountry": "MX"
            },
            "areaServed": [
                "Guadalajara",
                "Zapopan",
                "Tlaquepaque",
                "Tonalá"
            ],
            "description": "Mariachi Colombia Show ofrece serenatas, bodas, cumpleaños, XV años y eventos con mariachi en vivo en Guadalajara y zona metropolitana."
        }
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
