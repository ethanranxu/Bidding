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
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
            {state}
        </span>
    );
}

export default function ZbArticleCard({ item }: { item: ZbArticle }) {
    return (
        <div className="group relative rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-cyan-500/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/80">
            {/* 顶部 - 状态 + 关键词 */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
                {getStateBadge(item.zbState)}
                {item.srckeyword && (
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {item.srckeyword}
                    </span>
                )}
            </div>

            {/* 标题 - 使用 break-words 确保自动换行 */}
            <div className="mb-3">
                <h3 className="text-[15px] font-medium leading-relaxed text-zinc-900 break-words group-hover:text-cyan-600 transition-colors dark:text-zinc-100 dark:group-hover:text-cyan-300">
                    {item.detailUrl ? (
                        <a
                            href={item.detailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline underline-offset-4"
                        >
                            {item.title || "无标题"}
                        </a>
                    ) : (
                        item.title || "无标题"
                    )}
                </h3>
            </div>

            {/* 关键信息 - 地址与来源 */}
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                {item.address && (
                    <span className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.address}
                    </span>
                )}
                {item.fromWebSite && (
                    <span className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {item.fromWebSite}
                    </span>
                )}
            </div>

            {/* 时间信息 */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                {item.articleTime && (
                    <span className="flex items-center gap-1.5 leading-none">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        发布: {formatDate(item.articleTime)}
                    </span>
                )}
                <span className="flex items-center gap-1.5 leading-none">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    入库: {formatDate(item.insertTime)}
                </span>
            </div>

            {/* 关键词标签 */}
            {item.keyStr && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.keyStr
                        .split(/[,，;；\s]+/)
                        .filter(Boolean)
                        .slice(0, 5)
                        .map((kw, i) => (
                            <span
                                key={i}
                                className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400"
                            >
                                {kw}
                            </span>
                        ))}
                </div>
            )}

            {/* 装饰线 */}
            <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-xl bg-cyan-500 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gradient-to-b dark:from-cyan-500 dark:to-blue-600" />
        </div>
    );
}
