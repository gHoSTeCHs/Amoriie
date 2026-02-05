import type { TemplateModule } from '../registry';

function PolaroidBuilder() {
    return (
        <div className="flex min-h-[300px] items-center justify-center text-rose-100/60">
            <p>Polaroid Builder - Coming in Phase 4</p>
        </div>
    );
}

function PolaroidViewer() {
    return (
        <div className="flex min-h-[300px] items-center justify-center text-rose-100/60">
            <p>Polaroid Viewer - Coming in Phase 5</p>
        </div>
    );
}

function getDefaultCustomizations(): Record<string, unknown> {
    return {
        style: 'classic',
        background: 'cork-board',
        polaroids: [],
        message: '',
    };
}

const polaroidMemoriesModule: TemplateModule = {
    Builder: PolaroidBuilder,
    Viewer: PolaroidViewer,
    getDefaultCustomizations,
};

export default polaroidMemoriesModule;
