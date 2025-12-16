export function NewsCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
    const isCompact = variant === 'compact';

    return (
        <div className={`block h-full bg-card border border-border rounded-xl flex ${isCompact ? 'flex-row items-center gap-4 p-3' : 'flex-col p-5'}`}>
            {/* Image Placeholder */}
            <div className={`relative overflow-hidden bg-muted/50 shrink-0 animate-pulse ${isCompact ? 'w-24 h-24 rounded-lg' : 'w-full aspect-video rounded-t-xl mb-4'}`} />

            <div className={`flex flex-col justify-between ${isCompact ? 'flex-1 h-full' : 'w-full'}`}>
                <div className={`flex justify-between items-start gap-4 mb-2 ${!isCompact ? 'mt-2' : ''}`}>
                    <div className="flex-1 space-y-2">
                        {/* Meta Placeholder */}
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
                            <div className="h-3 w-3 bg-muted/50 rounded-full animate-pulse" />
                            <div className="h-3 w-24 bg-muted/50 rounded animate-pulse" />
                        </div>
                        {/* Title Placeholder */}
                        <div className="space-y-1">
                            <div className="h-5 w-full bg-muted/50 rounded animate-pulse" />
                            <div className="h-5 w-3/4 bg-muted/50 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {!isCompact && (
                    <div className="space-y-2 mb-4 mt-2">
                        <div className="h-3 w-full bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-full bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-2/3 bg-muted/50 rounded animate-pulse" />
                    </div>
                )}

                {/* Tags Placeholder */}
                {!isCompact && (
                    <div className="mt-auto pt-3 border-t border-border flex gap-2">
                        <div className="h-6 w-16 bg-muted/50 rounded animate-pulse" />
                        <div className="h-6 w-20 bg-muted/50 rounded animate-pulse" />
                        <div className="h-6 w-14 bg-muted/50 rounded animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
}
