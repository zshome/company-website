"use client";

import Link from "next/link";
import { useCompany } from "@/contexts/CompanyContext";

export default function Footer() {
  const { company } = useCompany();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-brand-green">
              {company.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {company.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-brand-green">关于我们</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-brand-green">服务项目</Link></li>
              <li><Link href="/cases" className="text-muted-foreground hover:text-brand-green">案例展示</Link></li>
              <li><Link href="/news" className="text-muted-foreground hover:text-brand-green">新闻资讯</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">服务项目</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services#wall-renovation" className="text-muted-foreground hover:text-brand-green">墙面翻新</Link></li>
              <li><Link href="/services#old-house-renovation" className="text-muted-foreground hover:text-brand-green">旧房改造</Link></li>
              <li><Link href="/services#commercial-space" className="text-muted-foreground hover:text-brand-green">商业空间</Link></li>
              <li><Link href="/services#custom-service" className="text-muted-foreground hover:text-brand-green">定制服务</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">联系我们</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>服务热线：{company.phone}</li>
              <li>公司地址：{company.address}</li>
              <li>邮箱：{company.email}</li>
              <li>工作时间：{company.business_hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 {company.name} 版权所有</p>
        </div>
      </div>
    </footer>
  );
}
