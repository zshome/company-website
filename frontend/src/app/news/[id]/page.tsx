import { Metadata } from "next";
import { Calendar, Eye, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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

async function getNews(id: number): Promise<News | null> {
  try {
    const res = await fetch(`${API_URL}/news/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const newsItem = await getNews(parseInt(params.id));
  if (!newsItem) {
    return {
      title: "新闻不存在 - 福建省宜然焕新科技有限公司",
    };
  }
  return {
    title: `${newsItem.title} - 新闻资讯 - 福建省宜然焕新科技有限公司`,
    description: newsItem.summary,
  };
}

function renderContent(content: string) {
  const parts = content.split(/(!\[.*?\]\([^)]+\))/g);
  
  return parts.map((part, idx) => {
    const match = part.match(/!\[(.*?)\]\(([^)]+)\)/);
    if (match) {
      return (
        <figure key={idx} className="my-6">
          <img 
            src={match[2]} 
            alt={match[1]} 
            className="w-full h-auto rounded-lg shadow-md"
          />
          {match[1] && match[1] !== '图片' && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {match[1]}
            </figcaption>
          )}
        </figure>
      );
    }
    if (part.trim()) {
      return (
        <p key={idx} className="mb-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {part}
        </p>
      );
    }
    return null;
  });
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const newsItem = await getNews(parseInt(params.id));

  if (!newsItem) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-12">
        <div className="container">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回新闻列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{newsItem.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {newsItem.created_at?.split("T")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {newsItem.view_count} 次浏览
            </span>
          </div>
          <div className="mt-4">
            <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-sm font-medium text-brand-green">
              {newsItem.category}
            </span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {newsItem.cover_image ? (
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={newsItem.cover_image}
                    alt={newsItem.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-brand-green/10">
                  <FileText className="h-24 w-24 text-brand-green/40" />
                </div>
              )}

              <div className="mt-8">
                <div className="prose prose-lg max-w-none">
                  {newsItem.content ? (
                    renderContent(newsItem.content)
                  ) : (
                    <p className="text-muted-foreground">{newsItem.summary}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">文章信息</h3>
                <dl className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">分类</dt>
                    <dd className="font-medium">{newsItem.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">发布时间</dt>
                    <dd className="font-medium">{newsItem.created_at?.split("T")[0]}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">浏览量</dt>
                    <dd className="font-medium">{newsItem.view_count}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg bg-brand-green p-6 text-white">
                <h3 className="font-semibold">需要焕新服务？</h3>
                <p className="mt-2 text-white/80">
                  联系我们，获取专属焕新方案
                </p>
                <Button asChild className="mt-4 w-full" variant="secondary">
                  <Link href="/contact">免费咨询</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
