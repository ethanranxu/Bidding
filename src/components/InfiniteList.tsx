"use client";

import { useRef, useCallback, useEffect, type ReactNode } from "react";

interface InfiniteListProps {
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    children: ReactNode;
}

export default function InfiniteList({
    loading,
    hasMore,
    onLoadMore,
    children,
}: InfiniteListProps) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                onLoadMore();
            }
        },
        [hasMore, loading, onLoadMore]
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(handleIntersect, {
            rootMargin: "200px",
        });
        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [handleIntersect]);

    return (
        <div>
            {children}

            <div ref={sentinelRef} className="flex justify-center py-8">
                {loading && (
                    <div className="flex items-center gap-3 text-zinc-400">
                        <svg
                            className="h-5 w-5 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        <span>加载中...</span>
                    </div>
                )}
                {!hasMore && !loading && (
                    <span className="text-zinc-500 text-sm">已加载全部数据</span>
                )}
            </div>
        </div>
    );
}
