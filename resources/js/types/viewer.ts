import type { PolaroidCustomizations } from '@/templates/polaroid-memories/schema';

export type ViewerStage = 'intro' | 'envelope' | 'letter' | 'memories' | 'final' | 'celebration' | 'declined';

export type ViewerResponse = 'yes' | 'no';

export type ViewerProps = {
    customizations: PolaroidCustomizations;
    recipientName: string;
    slug: string;
    onResponse?: (response: ViewerResponse) => void;
};

export type ViewerTheme = {
    backgroundClass: string;
    fontFamily: string;
    fontUrl: string;
    polaroidBorderColor: string;
    polaroidShadowClass: string;
    polaroidTextureClass: string;
    isDarkBackground: boolean;
};
