#!/usr/bin/env node

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load font from local file or fetch from URL
 */
async function loadFont(fontPath) {
    if (fontPath.startsWith('http')) {
        const response = await fetch(fontPath);
        return Buffer.from(await response.arrayBuffer());
    }
    return readFileSync(fontPath);
}

/**
 * Generate the OG image SVG element structure
 */
function createOgElement(data) {
    const { recipientName, title, senderName } = data;

    const displayTitle = title || `A Valentine for ${recipientName}`;
    const subtitle = senderName ? `With love from ${senderName}` : 'Someone has a surprise for you';

    return {
        type: 'div',
        props: {
            style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0c0607 0%, #1a0a0e 50%, #0c0607 100%)',
                fontFamily: 'Cormorant Garamond',
                position: 'relative',
                overflow: 'hidden',
            },
            children: [
                {
                    type: 'div',
                    props: {
                        style: {
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            background: 'radial-gradient(circle at 30% 40%, rgba(244, 63, 94, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                        },
                    },
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px',
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '80px',
                                        filter: 'drop-shadow(0 0 30px rgba(244, 63, 94, 0.5))',
                                    },
                                    children: '💕',
                                },
                            },
                        ],
                    },
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            fontSize: '56px',
                            fontWeight: 500,
                            color: '#ffffff',
                            textAlign: 'center',
                            marginBottom: '16px',
                            maxWidth: '900px',
                            lineHeight: 1.2,
                            textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
                        },
                        children: displayTitle,
                    },
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            fontSize: '28px',
                            color: 'rgba(253, 242, 248, 0.7)',
                            textAlign: 'center',
                            fontStyle: 'italic',
                        },
                        children: subtitle,
                    },
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            position: 'absolute',
                            bottom: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '20px',
                                    },
                                    children: '❤️',
                                },
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontSize: '22px',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        letterSpacing: '2px',
                                    },
                                    children: 'amoriie.com',
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };
}

async function generateOgImage(inputPath, outputPath) {
    const inputData = JSON.parse(readFileSync(inputPath, 'utf-8'));

    const fontPath = join(__dirname, '..', 'public', 'fonts', 'CormorantGaramond-Medium.ttf');
    let fontBuffer;

    try {
        fontBuffer = await loadFont(fontPath);
    } catch {
        const fontUrl = 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjQWlhvuQWJ5heb_w.ttf';
        fontBuffer = await loadFont(fontUrl);
    }

    const element = createOgElement(inputData);

    const svg = await satori(element, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: 'Cormorant Garamond',
                data: fontBuffer,
                weight: 500,
                style: 'normal',
            },
        ],
    });

    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();

    writeFileSync(outputPath, png);

    return { success: true, outputPath };
}

const args = process.argv.slice(2);
let inputPath = null;
let outputPath = null;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
        inputPath = args[i + 1];
        i++;
    } else if (args[i] === '--output' && args[i + 1]) {
        outputPath = args[i + 1];
        i++;
    }
}

if (!inputPath || !outputPath) {
    console.error('Usage: node og-generator.js --input <input.json> --output <output.png>');
    console.error('');
    console.error('Input JSON format:');
    console.error('  { "recipientName": "string", "title": "string|null", "senderName": "string|null" }');
    process.exit(1);
}

generateOgImage(inputPath, outputPath)
    .then((result) => {
        console.log(JSON.stringify(result));
        process.exit(0);
    })
    .catch((error) => {
        console.error(JSON.stringify({ success: false, error: error.message }));
        process.exit(1);
    });
