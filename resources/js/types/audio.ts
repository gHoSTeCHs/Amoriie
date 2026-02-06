export type AudioTrack = {
    id: number;
    name: string;
    artist: string | null;
    duration: number;
    formattedDuration: string;
    url: string;
    category: string;
    mood: string;
};

export type AudioLibraryResponse = {
    tracks: AudioTrack[];
};
