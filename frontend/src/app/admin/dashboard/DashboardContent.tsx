"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Users, FileText, Briefcase, Eye, MessageSquare, Loader2, TrendingUp, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Stats {
  pending_contacts: number;
  total_contacts: number;
  total_news: number;
  total_cases: number;
  total_services: number;
  contacts_this_month: number;
}

interface PageViewStats {
  total_views: number;
  today_views: number;
  yesterday_views: number;
  week_views: number;
  month_views: number;
  daily_stats: { date: string; count: number }[];
  page_stats: { page: string; count: number }[];
}

interface RecentContact {
  id: number;
  name: string;
  phone: string;
  service_type: string | null;
  status: string;
  created_at: string | null;
}

const statusMap: { [key: string]: { label: string; className: string } } = {
  pending: { label: "待处理", className: "bg-yellow-100 text-yellow-800" },
  processing: { label: "处理中", className: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", className: "bg-green-100 text-green-800" },
};

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString("zh-CN");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [pageViewStats, setPageViewStats] = useState<PageViewStats | null>(null);
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, contactsRes, pageViewsRes] = await Promise.all([
          fetch(`${API_URL}/dashboard/stats`, { headers }),
          fetch(`${API_URL}/dashboard/recent-contacts?limit=5`, { headers }),
          fetch(`${API_URL}/page-views/stats`, { headers }),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        if (contactsRes.ok) {
          setRecentContacts(await contactsRes.json());
        }
        if (pageViewsRes.ok) {
          setPageViewStats(await pageViewsRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "咨询总数", value: stats?.total_contacts ?? 0, icon: Users, color: "bg-blue-500" },
    { label: "待处理咨询", value: stats?.pending_contacts ?? 0, icon: MessageSquare, color: "bg-orange-500" },
    { label: "新闻总数", value: stats?.total_news ?? 0, icon: FileText, color: "bg-green-500" },
    { label: "案例总数", value: stats?.total_cases ?? 0, icon: Briefcase, color: "bg-purple-500" },
  ];

  const viewStatCards = [
    { label: "今日访问", value: pageViewStats?.today_views ?? 0, icon: Eye, color: "bg-cyan-500" },
    { label: "昨日访问", value: pageViewStats?.yesterday_views ?? 0, icon: TrendingUp, color: "bg-indigo-500" },
    { label: "本周访问", value: pageViewStats?.week_views ?? 0, icon: BarChart3, color: "bg-pink-500" },
    { label: "总访问量", value: pageViewStats?.total_views ?? 0, icon: Eye, color: "bg-teal-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  const maxDailyViews = Math.max(...(pageViewStats?.daily_stats?.map(s => s.count) || [1]), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-500">欢迎回来，{user?.username}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand-green" />
          访问量统计
        </h2>
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {viewStatCards.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color.replace('bg-', 'text-')}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {pageViewStats?.daily_stats && pageViewStats.daily_stats.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">近7天访问趋势</h3>
            <div className="flex items-end gap-2 h-32">
              {pageViewStats.daily_stats.map((stat, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-brand-green/20 rounded-t hover:bg-brand-green/40 transition-colors relative group"
                    style={{ height: `${(stat.count / maxDailyViews) * 100}%`, minHeight: stat.count > 0 ? '8px' : '4px' }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {stat.count}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{formatDate(stat.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold">最新咨询</h2>
            <a href="/admin/contacts" className="text-sm text-brand-green hover:underline">查看全部</a>
          </div>
          {recentContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">暂无咨询记录</div>
          ) : (
            <div className="divide-y">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                      <span className="text-brand-green font-medium">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        statusMap[contact.status]?.className || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusMap[contact.status]?.label || contact.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{formatTimeAgo(contact.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">快捷操作</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <a
              href="/admin/contacts"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <Users className="h-8 w-8 mx-auto text-blue-500" />
              <p className="mt-2 font-medium">查看咨询</p>
            </a>
            <a
              href="/admin/news"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <FileText className="h-8 w-8 mx-auto text-green-500" />
              <p className="mt-2 font-medium">发布新闻</p>
            </a>
            <a
              href="/admin/cases"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <Briefcase className="h-8 w-8 mx-auto text-purple-500" />
              <p className="mt-2 font-medium">添加案例</p>
            </a>
            <a
              href="/"
              target="_blank"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <Eye className="h-8 w-8 mx-auto text-orange-500" />
              <p className="mt-2 font-medium">访问官网</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
