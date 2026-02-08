const DEFAULT_BITRATE = 128;
const MP3_FRAME_SIZE = 1152;

/**
 * Converts a Float32Array sample to Int16 for MP3 encoding.
 */
function floatTo16BitPCM(sample: number): number {
    return Math.max(-32768, Math.min(32767, Math.round(sample * 32768)));
}

/**
 * Gets the AudioContext constructor with Safari fallback.
 */
function getAudioContext(): typeof AudioContext {
    return window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
}

/**
 * Encodes an AudioBuffer to MP3 format using lamejs.
 */
export async function encodeToMp3(
    audioBuffer: AudioBuffer,
    bitrate: number = DEFAULT_BITRATE
): Promise<Blob> {
    const { Mp3Encoder } = await import('@breezystack/lamejs');

    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const encoder = new Mp3Encoder(channels, sampleRate, bitrate);

    const mp3Data: ArrayBuffer[] = [];

    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = channels > 1 ? audioBuffer.getChannelData(1) : null;

    const numSamples = leftChannel.length;
    const leftInt16 = new Int16Array(numSamples);
    const rightInt16 = rightChannel ? new Int16Array(numSamples) : null;

    for (let i = 0; i < numSamples; i++) {
        leftInt16[i] = floatTo16BitPCM(leftChannel[i]);
        if (rightInt16 && rightChannel) {
            rightInt16[i] = floatTo16BitPCM(rightChannel[i]);
        }
    }

    for (let i = 0; i < numSamples; i += MP3_FRAME_SIZE) {
        const leftChunk = leftInt16.subarray(i, Math.min(i + MP3_FRAME_SIZE, numSamples));

        let mp3buf: Int8Array;
        if (rightInt16) {
            const rightChunk = rightInt16.subarray(i, Math.min(i + MP3_FRAME_SIZE, numSamples));
            mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
        } else {
            mp3buf = encoder.encodeBuffer(leftChunk);
        }

        if (mp3buf.length > 0) {
            mp3Data.push(new Uint8Array(mp3buf).buffer);
        }
    }

    const finalBuffer = encoder.flush();
    if (finalBuffer.length > 0) {
        mp3Data.push(new Uint8Array(finalBuffer).buffer);
    }

    return new Blob(mp3Data, { type: 'audio/mpeg' });
}

/**
 * Extracts a region from an audio file or URL and encodes it to MP3.
 */
export async function extractRegion(
    source: File | string,
    startTime: number,
    endTime: number,
    bitrate: number = DEFAULT_BITRATE
): Promise<Blob> {
    const AudioContextClass = getAudioContext();
    const audioContext = new AudioContextClass();

    try {
        let arrayBuffer: ArrayBuffer;

        if (typeof source === 'string') {
            const response = await fetch(source);
            if (!response.ok) {
                throw new Error('Failed to fetch audio from URL');
            }
            arrayBuffer = await response.arrayBuffer();
        } else {
            arrayBuffer = await source.arrayBuffer();
        }

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const sampleRate = audioBuffer.sampleRate;
        const startSample = Math.floor(startTime * sampleRate);
        const endSample = Math.floor(endTime * sampleRate);
        const regionLength = endSample - startSample;

        const channels = audioBuffer.numberOfChannels;
        const trimmedBuffer = audioContext.createBuffer(
            channels,
            regionLength,
            sampleRate
        );

        for (let channel = 0; channel < channels; channel++) {
            const sourceData = audioBuffer.getChannelData(channel);
            const targetData = trimmedBuffer.getChannelData(channel);
            for (let i = 0; i < regionLength; i++) {
                targetData[i] = sourceData[startSample + i];
            }
        }

        return await encodeToMp3(trimmedBuffer, bitrate);
    } finally {
        await audioContext.close();
    }
}
