import { Metadata } from "next";
import { MapPin, Home, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const metadata: Metadata = {
  title: "案例展示 - 福建省宜然焕新科技有限公司",
  description: "查看我们的成功案例，了解专业的焕新服务效果",
};

interface Case {
  id: number;
  title: string;
  description: string;
  location: string;
  service_type: string;
  area: string;
  cover_image: string | null;
  is_featured: number;
}

async function getCases(): Promise<Case[]> {
  try {
    const res = await fetch(`${API_URL}/cases?skip=0&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const serviceTypes = ["全部", "墙面翻新", "旧房改造", "商业空间", "定制服务"];

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">案例展示</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              精选成功案例，见证焕新效果
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {serviceTypes.map((type) => (
              <Button
                key={type}
                variant={type === "全部" ? "default" : "outline"}
                className={type === "全部" ? "bg-brand-green hover:bg-brand-green-dark" : ""}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          {cases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无案例数据</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}`}
                  className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {caseItem.cover_image ? (
                      <img
                        src={caseItem.cover_image}
                        alt={caseItem.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-green/10">
                        <Home className="h-12 w-12 text-brand-green/40" />
                      </div>
                    )}
                    {caseItem.is_featured === 1 && (
                      <div className="absolute right-2 top-2 rounded bg-brand-green px-2 py-1 text-xs font-medium text-white">
                        精选案例
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold group-hover:text-brand-green">
                      {caseItem.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {caseItem.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {caseItem.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        {caseItem.area}
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-xs font-medium text-brand-green">
                        {caseItem.service_type}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">客户好评</h2>
            <p className="mt-4 text-muted-foreground">
              真实客户反馈，口碑见证品质
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "张先生",
                location: "福州市鼓楼区",
                content: "施工团队非常专业，三天就完成了全屋翻新，而且完全没有异味，当天就入住了，非常满意！",
                rating: 5,
              },
              {
                name: "李女士",
                location: "厦门市思明区",
                content: "办公室焕新选择宜然焕新是正确的决定，周末施工周一正常上班，同事们都说环境焕然一新。",
                rating: 5,
              },
              {
                name: "王先生",
                location: "泉州市丰泽区",
                content: "老房改造工程量大，但团队有条不紊地完成了，质量很好，价格也合理，推荐！",
                rating: 5,
              },
            ].map((review, index) => (
              <div key={index} className="rounded-lg border bg-white p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">{review.content}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-medium">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-green py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            想要同样的焕新效果？
          </h2>
          <p className="mt-4 text-white/80">
            联系我们，获取专属焕新方案
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link href="/contact">免费咨询</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
