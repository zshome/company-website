"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

interface CompanyInfo {
  name: string;
  short_name: string | null;
  logo: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  wechat: string | null;
  business_hours: string | null;
  description: string | null;
  banner_images: string[];
  latitude: number | null;
  longitude: number | null;
}

const defaultCompany: CompanyInfo = {
  name: "福建省宜然焕新科技有限公司",
  short_name: "宜然焕新",
  logo: null,
  phone: "400-888-8888",
  email: "service@yiran-huanxin.com",
  address: "福建省福州市",
  wechat: "yiran-huanxin",
  business_hours: "周一至周日 8:00-20:00",
  description: "专业墙面翻新、旧房改造服务商，使用三棵树环保涂料，让您当天入住",
  banner_images: [],
  latitude: 26.0745,
  longitude: 119.2965,
};

interface CompanyContextType {
  company: CompanyInfo;
  loading: boolean;
}

const CompanyContext = createContext<CompanyContextType>({
  company: defaultCompany,
  loading: true,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<CompanyInfo>(defaultCompany);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = (window as any).__companyData;
    if (cached) {
      setCompany(cached);
      setLoading(false);
      return;
    }

    let mounted = true;

    fetch(`${API_URL}/company`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (mounted && data) {
          const merged = { 
            ...defaultCompany, 
            ...data, 
            banner_images: data.banner_images || [],
            latitude: data.latitude || defaultCompany.latitude,
            longitude: data.longitude || defaultCompany.longitude,
          };
          (window as any).__companyData = merged;
          setCompany(merged);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ company, loading }), [company, loading]);

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}
