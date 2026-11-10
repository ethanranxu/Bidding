"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { User, Lock, Eye, EyeOff, Sun, Moon, Laptop, ShieldCheck } from "lucide-react";
import { verifyCredentials, saveStoredUser } from "@/lib/auth";

interface LoginFormProps {
  onLoginSuccess: (user: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("请输入账号和密码");
      return;
    }

    setLoading(true);

    // 简单轻微延迟以提供自然的交互反馈
    setTimeout(() => {
      const res = verifyCredentials(username, password);
      if (res.success && res.user) {
        saveStoredUser(res.user);
        onLoginSuccess(res.user);
      } else {
        setError("账号或密码错误，请重新输入");
        setLoading(false);
      }
    }, 200);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 transition-colors duration-300 dark:bg-zinc-950">
      {/* 顶部工具栏：主题切换 */}
      <div className="absolute right-6 top-6">
        <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
              theme === "light"
                ? "bg-zinc-100 text-indigo-600 shadow-sm dark:bg-zinc-800"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
            title="明亮模式"
          >
            <Sun size={14} />
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
              theme === "dark"
                ? "bg-zinc-800 text-indigo-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
            title="黑暗模式"
          >
            <Moon size={14} />
          </button>
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
              theme === "system"
                ? "bg-zinc-200 text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
            title="跟随系统"
          >
            <Laptop size={14} />
          </button>
        </div>
      </div>

      {/* 登录卡片 */}
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 transition-all dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none">
          {/* Logo与标题 */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <ShieldCheck size={26} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              招标信息平台
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              请输入内部授权账号以访问平台内容
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                账号
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <User size={16} />
                </div>
                <input
                  id="username"
                  type="text"
                  autoFocus
                  autoComplete="username"
                  placeholder="请输入您的账号"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:focus:border-indigo-500/50 dark:focus:bg-zinc-950"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                密码
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="请输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:focus:border-indigo-500/50 dark:focus:bg-zinc-950"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? "正在验证..." : "登 录"}
            </button>
          </form>

          {/* 底部备注 */}
          <div className="mt-6 border-t border-zinc-100 pt-4 text-center text-[12px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
            内部系统受访问保护 · 请使用预设账号登录
          </div>
        </div>
      </div>
    </div>
  );
}

