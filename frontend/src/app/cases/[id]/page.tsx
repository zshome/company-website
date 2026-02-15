import { Metadata } from "next";
import { MapPin, Ruler, Calendar, ArrowLeft, Home, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Case {
  id: number;
  title: string;
  description: string;
  location: string;
  service_type: string;
  area: string;
  cover_image: string | null;
  images: string | string[];
  is_featured: number;
  created_at: string;
}

async function getCase(id: number): Promise<Case | null> {
  try {
    const res = await fetch(`${API_URL}/cases/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const caseItem = await getCase(parseInt(params.id));
  if (!caseItem) {
    return {
      title: "案例不存在 - 福建省宜然焕新科技有限公司",
    };
  }
  return {
    title: `${caseItem.title} - 案例展示 - 福建省宜然焕新科技有限公司`,
    description: caseItem.description,
  };
}

function parseImages(images: string | string[] | null | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const caseItem = await getCase(parseInt(params.id));

  if (!caseItem) {
    notFound();
  }

  const images = parseImages(caseItem.images);

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-12">
        <div className="container">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回案例列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{caseItem.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {caseItem.location}
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              {caseItem.area}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {caseItem.created_at?.split("T")[0]}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-sm font-medium text-brand-green">
              {caseItem.service_type}
            </span>
            {caseItem.is_featured === 1 && (
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                精选案例
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {caseItem.cover_image ? (
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={caseItem.cover_image}
                    alt={caseItem.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-brand-green/10">
                  <Home className="h-24 w-24 text-brand-green/40" />
                </div>
              )}

              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">项目详情</h2>
                <div className="prose max-w-none text-muted-foreground">
                  <p className="whitespace-pre-wrap">{caseItem.description}</p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    装修展示 ({images.length}张)
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg bg-gray-100">
                        <div className="aspect-square">
                          <img
                            src={image}
                            alt={`${caseItem.title} - 图片 ${index + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                          <span className="text-xs text-white">图片 {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">项目信息</h3>
                <dl className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">服务类型</dt>
                    <dd className="font-medium">{caseItem.service_type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">项目面积</dt>
                    <dd className="font-medium">{caseItem.area}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">项目地点</dt>
                    <dd className="font-medium">{caseItem.location}</dd>
                  </div>
                  {images.length > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">展示图片</dt>
                      <dd className="font-medium">{images.length} 张</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-lg bg-brand-green p-6 text-white">
                <h3 className="font-semibold">想要同样的焕新效果？</h3>
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
