import { Metadata } from "next";
import { Paintbrush, Home, Building, Settings, CheckCircle, Wrench, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const metadata: Metadata = {
  title: "服务项目 - 福建省宜然焕新科技有限公司",
  description: "为您提供墙面翻新、旧房改造、商业空间焕新、定制服务等全方位焕新解决方案",
};

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  features: string[];
  price_range: string | null;
  duration: string | null;
  is_featured: boolean;
  sort_order: number;
}

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services?skip=0&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const iconMap: { [key: string]: React.ReactNode } = {
  paintbrush: <Paintbrush className="h-10 w-10" />,
  home: <Home className="h-10 w-10" />,
  building: <Building className="h-10 w-10" />,
  settings: <Settings className="h-10 w-10" />,
  wrench: <Wrench className="h-10 w-10" />,
  refresh: <RefreshCw className="h-10 w-10" />,
  sparkles: <Sparkles className="h-10 w-10" />,
};

const serviceProcess = [
  { step: 1, title: "在线咨询", description: "通过电话或在线表单联系我们，描述您的需求" },
  { step: 2, title: "免费上门", description: "专业人员上门测量，了解现场情况" },
  { step: 3, title: "方案设计", description: "根据需求定制专属焕新方案和报价" },
  { step: 4, title: "签订合同", description: "确认方案后签订服务合同" },
  { step: 5, title: "专业施工", description: "经验丰富的团队按标准流程施工" },
  { step: 6, title: "验收交付", description: "客户验收满意后交付，享受质保服务" },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">服务项目</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              为您提供全方位的焕新解决方案
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无服务项目数据</p>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  id={service.slug}
                  className="rounded-lg border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                      {service.icon && iconMap[service.icon] ? iconMap[service.icon] : <Wrench className="h-10 w-10" />}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{service.name}</h2>
                      {service.description && (
                        <p className="mt-2 text-muted-foreground">{service.description}</p>
                      )}
                    </div>
                  </div>
                  {service.features && service.features.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 font-semibold">服务内容</h3>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-brand-green" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {service.price_range && (
                      <span className="text-sm text-muted-foreground">
                        价格范围：<span className="font-medium text-foreground">{service.price_range}</span>
                      </span>
                    )}
                    {service.duration && (
                      <span className="text-sm text-muted-foreground">
                        施工周期：<span className="font-medium text-foreground">{service.duration}</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-6">
                    <Button asChild className="bg-brand-green hover:bg-brand-green-dark">
                      <Link href={`/contact?service=${service.slug}`}>立即咨询</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">服务流程</h2>
            <p className="mt-4 text-muted-foreground">
              标准化流程，让您省心省力
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {serviceProcess.map((item) => (
              <div key={item.step} className="relative">
                <div className="rounded-lg border bg-white p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-lg border bg-card p-8">
            <h2 className="text-2xl font-bold">服务承诺</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                <div>
                  <h3 className="font-medium">环保材料</h3>
                  <p className="text-sm text-muted-foreground">使用三棵树环保涂料，无毒无味</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                <div>
                  <h3 className="font-medium">当天入住</h3>
                  <p className="text-sm text-muted-foreground">快速施工，最快当天即可入住</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                <div>
                  <h3 className="font-medium">十年质保</h3>
                  <p className="text-sm text-muted-foreground">提供十年质保，终身维护服务</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                <div>
                  <h3 className="font-medium">价格透明</h3>
                  <p className="text-sm text-muted-foreground">报价清晰透明，无隐形消费</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-green py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            需要焕新服务？
          </h2>
          <p className="mt-4 text-white/80">
            立即联系我们，获取免费上门评估和报价
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link href="/contact">在线预约</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
