import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type ImageWithSkeletonProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    aspectRatio?: 'square' | 'video' | 'portrait';
    skeletonClassName?: string;
};

const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
};

export function ImageWithSkeleton({
    className,
    aspectRatio = 'square',
    skeletonClassName,
    onLoad,
    ...props
}: ImageWithSkeletonProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={cn('relative overflow-hidden', aspectClasses[aspectRatio])}>
            {!isLoaded && (
                <Skeleton className={cn('absolute inset-0', skeletonClassName)} />
            )}
            <img
                {...props}
                className={cn(
                    'h-full w-full object-cover transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    className
                )}
                onLoad={(e) => {
                    setIsLoaded(true);
                    onLoad?.(e);
                }}
            />
        </div>
    );
}
