import { useState, useEffect } from "react";
import type { ZbArticle } from "@/types";

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const stateColors: Record<string, string> = {
    招标: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    中标: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    变更: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400",
    废标: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
    流标: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
};

function getStateBadge(state: string | null) {
    if (!state) return null;
    const cls = stateColors[state] || "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-700/50 dark:text-zinc-300 dark:border-zinc-600";
    return (
        <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${cls}`}>
            {state}
        </span>
    );
}

export default function ZbArticleCard({ item }: { item: ZbArticle }) {
    const [isVisited, setIsVisited] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(`visited_zb_${item.id}`)) {
            setIsVisited(true);
        }
    }, [item.id]);

    const handleMarkVisited = () => {
        setIsVisited(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`visited_zb_${item.id}`, '1');
        }
    };

    return (
        <div className={`group relative rounded-lg border transition-all hover:shadow-sm p-3 sm:px-4 ${
            isVisited 
                ? "border-zinc-200/50 bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-900/20" 
                : "border-zinc-200 bg-white hover:border-cyan-500/40 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/80"
        }`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div className="flex-1 flex gap-2 items-center">
                    {/* Badge */}
                    <div className={`shrink-0 flex items-center gap-1.5 ${isVisited ? 'opacity-50' : ''}`}>
                        {getStateBadge(item.zbState)}
                    </div>
                    {/* Title */}
                    <h3 className={`text-[14px] font-medium leading-snug break-words transition-colors text-zinc-900 group-hover:text-cyan-600 dark:text-zinc-100 dark:group-hover:text-cyan-400`}>
                        {item.detailUrl ? (
                            <a
                                href={item.detailUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseDown={handleMarkVisited}
                                className="hover:underline underline-offset-4"
                            >
                                {item.title || "无标题"}
                            </a>
                        ) : (
                            <span onMouseDown={handleMarkVisited} className="cursor-pointer">{item.title || "无标题"}</span>
                        )}
                    </h3>
                </div>
            </div>

            {/* Sub info line */}
            <div className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-500 dark:text-zinc-500 ${isVisited ? 'opacity-50' : ''}`}>
                {item.address && (
                    <span className="flex items-center gap-1 text-[11px]">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.address}
                    </span>
                )}
                {item.fromWebSite && (
                    <span className="flex items-center gap-1 text-[11px]">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {item.fromWebSite}
                    </span>
                )}
                {item.articleTime && (
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(item.articleTime)}
                    </span>
                )}
                

            </div>

            <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-lg bg-cyan-500 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gradient-to-b dark:from-cyan-500 dark:to-blue-600" />
        </div>
    );
}
