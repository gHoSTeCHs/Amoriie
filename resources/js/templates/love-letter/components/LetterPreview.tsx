import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

type LetterPreviewProps = {
    text: string;
    paperColor: string;
    inkColor: string;
    headingFont: string;
    bodyFont: string;
    showDropCap: boolean;
    className?: string;
};

const fontFamilyMap: Record<string, string> = {
    'Pinyon Script': "'Pinyon Script', cursive",
    'Great Vibes': "'Great Vibes', cursive",
    'Cormorant Garamond': "'Cormorant Garamond', serif",
    'Crimson Text': "'Crimson Text', serif",
    'Homemade Apple': "'Homemade Apple', cursive",
    'Dancing Script': "'Dancing Script', cursive",
    'Special Elite': "'Special Elite', monospace",
    'Courier Prime': "'Courier Prime', monospace",
    'IBM Plex Mono': "'IBM Plex Mono', monospace",
    'Cinzel Decorative': "'Cinzel Decorative', serif",
    'Playfair Display': "'Playfair Display', serif",
    'EB Garamond': "'EB Garamond', serif",
    'Allura': "'Allura', cursive",
    'Lavishly Yours': "'Lavishly Yours', cursive",
    'Parisienne': "'Parisienne', cursive",
    'Lora': "'Lora', serif",
    'Libre Baskerville': "'Libre Baskerville', serif",
    'Pacifico': "'Pacifico', cursive",
    'Caveat': "'Caveat', cursive",
    'Nothing You Could Do': "'Nothing You Could Do', cursive",
    'Merriweather': "'Merriweather', serif",
    'Alex Brush': "'Alex Brush', cursive",
};

function getFontFamily(fontName: string): string {
    return fontFamilyMap[fontName] || `'${fontName}', serif`;
}

function LetterPreviewComponent({
    text,
    paperColor,
    inkColor,
    headingFont,
    bodyFont,
    showDropCap,
    className,
}: LetterPreviewProps) {
    const displayText = useMemo(() => {
        const trimmed = text.trim();
        if (trimmed.length <= 150) return trimmed;
        return trimmed.slice(0, 147) + '...';
    }, [text]);

    const firstChar = displayText.charAt(0);
    const restOfText = displayText.slice(1);

    if (!text.trim()) {
        return (
            <div
                className={cn(
                    'relative overflow-hidden rounded-lg p-4',
                    'shadow-md shadow-black/20',
                    'min-h-[120px]',
                    className
                )}
                style={{ backgroundColor: paperColor }}
            >
                <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNiIvPjwvc3ZnPg==')] opacity-60" />

                <p
                    className="relative text-center text-sm italic opacity-40"
                    style={{
                        color: inkColor,
                        fontFamily: getFontFamily(bodyFont),
                    }}
                >
                    Your letter will appear here...
                </p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg',
                'shadow-md shadow-black/20',
                'ring-1 ring-black/5',
                className
            )}
            style={{ backgroundColor: paperColor }}
        >
            <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNiIvPjwvc3ZnPg==')] opacity-60" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-black/5 to-transparent" />

            <div className="relative p-4">
                <p
                    className="text-sm leading-relaxed"
                    style={{
                        color: inkColor,
                        fontFamily: getFontFamily(bodyFont),
                    }}
                >
                    {showDropCap && firstChar ? (
                        <>
                            <span
                                className="float-left mr-1.5 mt-0.5 text-3xl leading-none"
                                style={{
                                    fontFamily: getFontFamily(headingFont),
                                    color: inkColor,
                                }}
                            >
                                {firstChar}
                            </span>
                            {restOfText}
                        </>
                    ) : (
                        displayText
                    )}
                </p>
            </div>

            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 23px,
                        ${inkColor} 23px,
                        ${inkColor} 24px
                    )`,
                }}
            />
        </div>
    );
}

export const LetterPreview = memo(LetterPreviewComponent);
