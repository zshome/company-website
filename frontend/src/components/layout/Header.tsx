"use client";

import { memo } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Phone, Menu, Building } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import Link from "next/link";

const navItems = [
  { title: "首页", href: "/" },
  { title: "关于我们", href: "/about" },
  { title: "服务项目", href: "/services" },
  { title: "案例展示", href: "/cases" },
  { title: "新闻资讯", href: "/news" },
  { title: "联系我们", href: "/contact" },
];

function HeaderComponent() {
  const { company } = useCompany();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {company.logo ? (
            <img src={company.logo} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
              <Building className="h-6 w-6 text-brand-green" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-bold text-brand-green leading-tight">
              {company.short_name || company.name}
            </span>
            <span className="text-xs text-muted-foreground">让家焕然一新，让生活更美好</span>
          </div>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href={item.href}>
                  {item.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${company.phone}`}
            className="hidden md:flex items-center gap-2 text-brand-green"
          >
            <Phone className="h-4 w-4" />
            <span className="font-medium">{company.phone}</span>
          </a>
          <Button className="md:hidden" variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default memo(HeaderComponent);
