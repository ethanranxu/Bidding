"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, Laptop, X } from "lucide-react";
import { fetchSzJstar } from "@/actions/szjstar";
import { fetchZbArticle } from "@/actions/zbArticle";
import InfiniteList from "@/components/InfiniteList";
import SzJstarCard from "@/components/SzJstarCard";
import ZbArticleCard from "@/components/ZbArticleCard";
import type { SzJstar, ZbArticle } from "@/types";

type TabKey = "szjstar" | "zbArticle";

const tabs: { key: TabKey; label: string; desc: string }[] = [
  { key: "szjstar", label: "招标爬取1", desc: "SzJstar 招标信息" },
  { key: "zbArticle", label: "招标爬取2", desc: "zb_article 招标公告" },
];

const FILTER_TAGS = ["医院", "患者", "满意", "体验", "测评", "调查", "第三方", "评价", "评估"];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("szjstar");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 过滤状态：默认 60 天，null 表示全部
  const [filterDays, setFilterDays] = useState<number | undefined>(60);
  // 标签筛选状态
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // SzJstar state
  const [szData, setSzData] = useState<SzJstar[]>([]);
  const [szPage, setSzPage] = useState(1);
  const [szHasMore, setSzHasMore] = useState(true);
  const [szLoading, setSzLoading] = useState(false);
  const [szTotal, setSzTotal] = useState(0);

  // ZbArticle state
  const [zbData, setZbData] = useState<ZbArticle[]>([]);
  const [zbPage, setZbPage] = useState(1);
  const [zbHasMore, setZbHasMore] = useState(true);
  const [zbLoading, setZbLoading] = useState(false);
  const [zbTotal, setZbTotal] = useState(0);

  // 挂载后显示主题切换
  useEffect(() => setMounted(true), []);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const resetAll = useCallback(() => {
    setSzData([]);
    setSzPage(1);
    setSzHasMore(true);
    setSzTotal(0);
    setZbData([]);
    setZbPage(1);
    setZbHasMore(true);
    setZbTotal(0);
  }, []);

  // 搜索或筛选条件变化时重置
  useEffect(() => {
    resetAll();
  }, [debouncedSearch, filterDays, selectedTags, resetAll]);

  // 标签切换处理
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const loadSzJstar = useCallback(async (pageNum?: number) => {
    if (szLoading) return;
    const targetPage = pageNum || szPage;
    setSzLoading(true);
    try {
      const res = await fetchSzJstar(targetPage, debouncedSearch, filterDays, selectedTags);
      setSzData((prev) => (targetPage === 1 ? res.data : [...prev, ...res.data]));
      setSzHasMore(res.hasMore);
      setSzTotal(res.total);
      setSzPage(targetPage + 1);
    } catch (err) {
      console.error("加载 SzJstar 失败:", err);
    } finally {
      setSzLoading(false);
    }
  }, [szPage, szLoading, debouncedSearch, filterDays, selectedTags]);

  const loadZbArticle = useCallback(async (pageNum?: number) => {
    if (zbLoading) return;
    const targetPage = pageNum || zbPage;
    setZbLoading(true);
    try {
      const res = await fetchZbArticle(targetPage, debouncedSearch, filterDays, selectedTags);
      setZbData((prev) => (targetPage === 1 ? res.data : [...prev, ...res.data]));
      setZbHasMore(res.hasMore);
      setZbTotal(res.total);
      setZbPage(targetPage + 1);
    } catch (err) {
      console.error("加载 ZbArticle 失败:", err);
    } finally {
      setZbLoading(false);
    }
  }, [zbPage, zbLoading, debouncedSearch, filterDays, selectedTags]);

  // 当页面初始化或筛选条件重置导致回到第1页时，同时加载两边的数据
  useEffect(() => {
    // 检查 SzJstar 是否需要加载（第1页且无数据时）
    if (szPage === 1 && !szLoading && szData.length === 0) {
      loadSzJstar(1);
    }
    // 检查 ZbArticle 是否需要加载
    if (zbPage === 1 && !zbLoading && zbData.length === 0) {
      loadZbArticle(1);
    }
  }, [szPage, zbPage, szLoading, zbLoading, szData.length, zbData.length, loadSzJstar, loadZbArticle]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-zinc-950">
      {/* Search Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              B
            </div>
            <span className="hidden text-lg font-semibold text-zinc-900 sm:block dark:text-white">
              招标助手
            </span>
          </div>

          {/* Nav Search Box with Date Filter Toggle */}
          <div className="relative flex-1 max-w-xl flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="搜索标题、内容关键词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-24 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-500/40"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-20 flex items-center pr-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={16} />
              </button>
            )}

            {/* Date Filter Toggle */}
            <div className="absolute inset-y-0 right-1 flex items-center">
              <button
                onClick={() => setFilterDays(prev => prev === 60 ? undefined : 60)}
                className={`h-7 px-3 text-xs font-medium rounded-lg transition-colors ${filterDays === 60
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
              >
                {filterDays === 60 ? "最近60天" : "全部数据"}
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="hidden items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1 sm:flex dark:border-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => setTheme("light")}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${theme === "light" ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              title="明亮模式"
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${theme === "dark" ? "bg-zinc-800 text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-100 dark:hover:text-zinc-100"
                }`}
              title="黑暗模式"
            >
              <Moon size={14} />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${theme === "system" ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-sm" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              title="跟随系统"
            >
              <Laptop size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Tab Navigation & Tag Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-zinc-200 pb-0 dark:border-zinc-800/60">
          {/* Tabs */}
          <div className="flex items-end gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${activeTab === tab.key
                  ? "text-indigo-600 bg-indigo-50/50 dark:text-white dark:bg-zinc-900/80"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 dark:hover:text-zinc-300 dark:hover:bg-zinc-900/40"
                  }`}
              >
                {tab.label}
                <span className="ml-2 text-[11px] opacity-70">
                  {tab.key === "szjstar" ? `(${szTotal.toLocaleString()})` : `(${zbTotal.toLocaleString()})`}
                </span>
                {activeTab === tab.key && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-500" />
                )}
              </button>
            ))}
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 pb-2 sm:pb-3">
            {FILTER_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lists */}
        <div className={activeTab === "szjstar" ? "block" : "hidden"}>
          <InfiniteList
            loading={szLoading}
            hasMore={szHasMore}
            onLoadMore={loadSzJstar}
          >
            <div className="grid gap-3">
              {szData.map((item) => (
                <SzJstarCard key={item.Id} item={item} />
              ))}
            </div>
          </InfiniteList>
        </div>

        <div className={activeTab === "zbArticle" ? "block" : "hidden"}>
          <InfiniteList
            loading={zbLoading}
            hasMore={zbHasMore}
            onLoadMore={loadZbArticle}
          >
            <div className="grid gap-3">
              {zbData.map((item) => (
                <ZbArticleCard key={item.id} item={item} />
              ))}
            </div>
          </InfiniteList>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-200 py-8 text-center text-[13px] text-zinc-500 dark:border-zinc-800/40 dark:text-zinc-600">
        <p>© {new Date().getFullYear()} 招标信息助手 · 专业招标信息分拣服务</p>
      </footer>
    </div>
  );
}
