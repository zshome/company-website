"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCompany } from "@/contexts/CompanyContext";
import BannerCarousel from "@/components/ui/BannerCarousel";

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  features: string[];
  price_range: string | null;
  is_featured: boolean;
}

interface CaseItem {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  service_type: string | null;
  area: string | null;
  cover_image: string | null;
  is_featured: number;
}

const iconMap: { [key: string]: React.ElementType } = {
  shield: Shield,
  clock: Clock,
  award: Award,
  users: Users,
};

const advantages = [
  { icon: "shield", title: "环保材料", description: "采用三棵树环保涂料，无毒无味，即刷即住" },
  { icon: "clock", title: "快速施工", description: "专业团队高效作业，最快当天完工" },
  { icon: "award", title: "品质保障", description: "5年质保承诺，终身维护服务" },
  { icon: "users", title: "专业团队", description: "10年以上施工经验，服务超10000+家庭" },
];

const stats = [
  { value: "10000+", label: "服务家庭" },
  { value: "50+", label: "专业师傅" },
  { value: "5年", label: "质保承诺" },
  { value: "98%", label: "客户满意度" },
];

export default function HomePage() {
  const { company } = useCompany();
  const [services, setServices] = useState<Service[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, casesRes] = await Promise.all([
          fetch(`${API_URL}/services?skip=0&limit=100`),
          fetch(`${API_URL}/cases?featured=true&skip=0&limit=6`),
        ]);
        if (servicesRes.ok) {
          setServices(await servicesRes.json());
        }
        if (casesRes.ok) {
          setCases(await casesRes.json());
        }
        
        fetch(`${API_URL}/page-views/record?page=home`, { method: "POST" }).catch(() => {});
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  const bannerImages = (company as any).banner_images || [];

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-20 md:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                专业焕新服务
                <span className="block text-brand-green">让家焕然一新</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                {company.description}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green-dark">
                  <Link href="/contact">免费咨询</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/services">了解服务</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <BannerCarousel images={bannerImages} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">我们的优势</h2>
            <p className="mt-4 text-muted-foreground">专业团队，品质服务，让您的家焕然一新</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map((item, index) => {
              const Icon = iconMap[item.icon] || Shield;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                    <Icon className="h-8 w-8 text-brand-green" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">服务项目</h2>
            <p className="mt-4 text-muted-foreground">为您提供全方位的焕新解决方案</p>
          </div>
          {services.length > 0 ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {services.slice(0, 4).map((service) => (
                <div key={service.id} className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {service.description || "专业服务，品质保障"}
                  </p>
                  {service.price_range && (
                    <p className="mt-2 text-sm font-medium text-brand-green">{service.price_range}</p>
                  )}
                  <Button asChild variant="link" className="mt-4 p-0 text-brand-green">
                    <Link href={`/services#${service.slug}`}>
                      了解详情 <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {["墙面翻新", "旧房改造", "商业空间", "定制服务"].map((name, i) => (
                <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">专业服务，品质保障</p>
                  <Button asChild variant="link" className="mt-4 p-0 text-brand-green">
                    <Link href="/services">了解详情 <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/services">查看全部服务</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">精选案例</h2>
            <p className="mt-4 text-muted-foreground">真实案例，见证品质</p>
          </div>
          {cases.length > 0 ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((caseItem) => (
                <Link key={caseItem.id} href={`/cases/${caseItem.id}`} className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <div className="aspect-video bg-gray-100">
                    {caseItem.cover_image ? (
                      <img src={caseItem.cover_image} alt={caseItem.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-brand-green/10">
                        <span className="text-brand-green/40">案例图片</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-brand-green">{caseItem.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{caseItem.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{caseItem.location}</span>
                      <span>{caseItem.area}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-muted-foreground">暂无案例数据</div>
          )}
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/cases">查看全部案例</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-brand-green py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">立即开始您的焕新之旅</h2>
            <p className="mt-4 text-muted-foreground">
              联系我们，获取免费上门评估和报价
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green-dark">
                <Link href="/contact">免费咨询</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${company.phone}`}>
                  服务热线：{company.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
