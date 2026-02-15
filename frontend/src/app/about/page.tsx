import { Metadata } from "next";
import { Shield, Clock, Award, Users, Target, Heart } from "lucide-react";
import { advantages, stats, companyInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: `关于我们 - ${companyInfo.name}`,
  description: companyInfo.description,
};

const iconMap: { [key: string]: React.ReactNode } = {
  shield: <Shield className="h-8 w-8" />,
  clock: <Clock className="h-8 w-8" />,
  award: <Award className="h-8 w-8" />,
  users: <Users className="h-8 w-8" />,
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">关于我们</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {companyInfo.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">公司简介</h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  {companyInfo.name}是一家专注于室内焕新服务的专业公司，
                  与三棵树涂料深度合作，致力于为家庭和商业客户提供高品质的墙面翻新、
                  旧房改造等一站式焕新服务。
                </p>
                <p>
                  我们秉承"让每个家庭都能享受环保焕新"的理念，选用三棵树环保涂料，
                  确保施工过程无毒无味，让客户最快当天即可入住，真正实现"马上住"的服务承诺。
                </p>
                <p>
                  公司拥有一支经验丰富、技术精湛的专业施工团队，建立了标准化的施工流程
                  和严格的质量管理体系，确保每一个项目都能达到客户的期望。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-center"
                >
                  <span className="text-3xl font-bold text-brand-green">{stat.value}</span>
                  <span className="mt-2 text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">我们的优势</h2>
            <p className="mt-4 text-muted-foreground">
              专业团队 · 环保材料 · 贴心服务
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  {iconMap[item.icon]}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">企业文化</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
                <Target className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="text-lg font-semibold">企业愿景</h3>
              <p className="mt-2 text-muted-foreground">
                成为福建省最受信赖的室内焕新服务品牌，让每个家庭都能享受环保、健康的居住环境。
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
                <Heart className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="text-lg font-semibold">企业使命</h3>
              <p className="mt-2 text-muted-foreground">
                以环保材料和精湛工艺，为客户提供高品质的焕新服务，创造健康美好的居住空间。
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
                <Users className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="text-lg font-semibold">核心价值观</h3>
              <p className="mt-2 text-muted-foreground">
                诚信为本、品质至上、客户第一、持续创新。我们始终将客户满意度作为衡量工作的标准。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-green py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            期待与您合作
          </h2>
          <p className="mt-4 text-white/80">
            联系我们，获取免费上门评估服务
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            服务热线：{companyInfo.phone}
          </p>
        </div>
      </section>
    </main>
  );
}
