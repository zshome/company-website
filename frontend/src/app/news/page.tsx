import { Metadata } from "next";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const metadata: Metadata = {
  title: "新闻资讯 - 福建省宜然焕新科技有限公司",
  description: "了解最新的行业动态、公司新闻和装修知识",
};

interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  cover_image: string | null;
  view_count: number;
  created_at: string;
}

async function getNews(): Promise<News[]> {
  try {
    const res = await fetch(`${API_URL}/news?skip=0&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const categories = ["全部", "公司新闻", "行业动态", "装修知识"];

export default async function NewsPage() {
  const news = await getNews();
  const featuredNews = news[0];
  const otherNews = news.slice(1);

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">新闻资讯</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              了解最新动态，获取装修知识
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "全部" ? "default" : "outline"}
                className={category === "全部" ? "bg-brand-green hover:bg-brand-green-dark" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          {news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无新闻数据</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Link
                  href={`/news/${featuredNews?.id}`}
                  className="group block overflow-hidden rounded-lg border bg-card shadow-sm"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {featuredNews?.cover_image ? (
                      <img
                        src={featuredNews.cover_image}
                        alt={featuredNews.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-green/10">
                        <svg className="h-16 w-16 text-brand-green/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute right-2 top-2 rounded bg-brand-green px-2 py-1 text-xs font-medium text-white">
                      置顶
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
                      {featuredNews?.category}
                    </span>
                    <h2 className="mt-3 text-xl font-semibold group-hover:text-brand-green">
                      {featuredNews?.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">{featuredNews?.summary}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {featuredNews?.created_at?.split("T")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {featuredNews?.view_count}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">最新资讯</h3>
                {otherNews.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group block rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 shrink-0 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.cover_image ? (
                          <img
                            src={item.cover_image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-2 group-hover:text-brand-green">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">{item.created_at?.split("T")[0]}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold">更多资讯</h2>
          {otherNews.length === 0 ? (
            <div className="mt-8 text-center py-8">
              <p className="text-muted-foreground">暂无更多资讯</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {item.cover_image ? (
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-green/10">
                        <svg className="h-10 w-10 text-brand-green/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-brand-green/10 px-2 py-0.5 text-xs font-medium text-brand-green">
                      {item.category}
                    </span>
                    <h3 className="mt-2 font-semibold line-clamp-2 group-hover:text-brand-green">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.created_at?.split("T")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.view_count}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              加载更多
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-brand-green py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            订阅我们的资讯
          </h2>
          <p className="mt-4 text-white/80">
            获取最新行业动态和装修知识
          </p>
          <div className="mt-6 flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="请输入您的邮箱"
              className="flex-1 rounded-md border-0 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-white"
            />
            <Button variant="secondary">订阅</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
