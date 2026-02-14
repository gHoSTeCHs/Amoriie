import { Head } from '@inertiajs/react';

export type OgMetaProps = {
    title: string;
    description: string;
    image?: string | null;
    url: string;
    type?: 'website' | 'article';
    twitterCard?: 'summary' | 'summary_large_image';
    siteName?: string;
};

export function OgMeta({
    title,
    description,
    image,
    url,
    type = 'website',
    twitterCard = 'summary_large_image',
    siteName = 'Amoriie',
}: OgMetaProps) {
    const ogImage = image || '/images/og-default.png';

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={siteName} />

            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Head>
    );
}
