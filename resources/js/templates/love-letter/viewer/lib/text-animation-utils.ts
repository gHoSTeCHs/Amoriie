export type TextSegment = {
    type: 'paragraph' | 'linebreak';
    content?: string;
};

export type WordSegment = {
    type: 'word' | 'space';
    chars: string[];
};

/**
 * Parses text into paragraph and linebreak segments.
 * Handles both single line breaks within paragraphs and double line breaks between paragraphs.
 * Used for all text animation components.
 */
export function parseText(text: string): TextSegment[] {
    const segments: TextSegment[] = [];
    const paragraphs = text.split(/\n\n+/);

    paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
            const lines = paragraph.split(/\n/);
            lines.forEach((line, lineIndex) => {
                if (line) {
                    segments.push({ type: 'paragraph', content: line });
                }
                if (lineIndex < lines.length - 1) {
                    segments.push({ type: 'linebreak' });
                }
            });
        }
        if (index < paragraphs.length - 1) {
            segments.push({ type: 'linebreak' });
            segments.push({ type: 'linebreak' });
        }
    });

    return segments;
}

/**
 * Splits text into word segments for character-by-character animation
 * while preserving natural word boundaries for proper text wrapping.
 */
export function splitTextForAnimation(text: string): WordSegment[] {
    const segments: WordSegment[] = [];
    const parts = text.split(/(\s+)/);

    for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
            segments.push({ type: 'space', chars: [' '] });
        } else {
            segments.push({ type: 'word', chars: part.split('') });
        }
    }
    return segments;
}
