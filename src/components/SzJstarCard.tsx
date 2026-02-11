import type { SzJstar } from "@/types";

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

export default function SzJstarCard({ item }: { item: SzJstar }) {
    return (
        <div className="group relative rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-indigo-500/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/80">
            {/* 标题 - 使用 break-words 确保长文本换行 */}
            <div className="mb-3">
                <h3 className="text-[15px] font-medium leading-relaxed text-zinc-900 break-words group-hover:text-indigo-600 transition-colors dark:text-zinc-100 dark:group-hover:text-indigo-300">
                    {item.Hrefs ? (
                        <a
                            href={item.Hrefs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline underline-offset-4"
                        >
                            {item.TitleText || "无标题"}
                        </a>
                    ) : (
                        item.TitleText || "无标题"
                    )}
                </h3>
            </div>

            {/* 底部信息 - 包含时间 */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                {item.PublishTime && (
                    <span className="flex items-center gap-1.5 leading-none">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        发布: {formatDate(item.PublishTime)}
                    </span>
                )}
                <span className="flex items-center gap-1.5 leading-none">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    入库: {formatDate(item.InsertTime)}
                </span>
            </div>

            {/* 装饰线 */}
            <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-xl bg-indigo-500 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gradient-to-b dark:from-indigo-500 dark:to-purple-600" />
        </div>
    );
}
