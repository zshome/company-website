"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, Navigation } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Service {
  id: number;
  name: string;
  slug: string;
}

export default function ContactPage() {
  const { company } = useCompany();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service_type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("提交失败，请稍后重试");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openMapNavigation = () => {
    if (company.latitude && company.longitude) {
      const url = `https://uri.amap.com/marker?position=${company.longitude},${company.latitude}&name=${encodeURIComponent(company.name)}`;
      window.open(url, '_blank');
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen">
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                <CheckCircle className="h-8 w-8 text-brand-green" />
              </div>
              <h1 className="text-2xl font-bold">提交成功！</h1>
              <p className="mt-4 text-muted-foreground">
                感谢您的咨询，我们的工作人员将在24小时内与您联系。
              </p>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    service_type: "",
                    message: "",
                  });
                }}
                className="mt-6 bg-brand-green hover:bg-brand-green-dark"
              >
                继续咨询
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const latitude = company.latitude || 26.0745;
  const longitude = company.longitude || 119.2965;

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">联系我们</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              期待与您的合作，我们将竭诚为您服务
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-card p-8">
                <h2 className="text-2xl font-bold">在线咨询</h2>
                <p className="mt-2 text-muted-foreground">
                  填写以下表单，我们将尽快与您联系
                </p>
                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-input bg-background px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                        placeholder="请输入您的姓名"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                        电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-input bg-background px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                        placeholder="请输入您的联系电话"
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        邮箱
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                        placeholder="请输入您的邮箱（选填）"
                      />
                    </div>
                    <div>
                      <label htmlFor="service_type" className="mb-2 block text-sm font-medium">
                        服务类型
                      </label>
                      <select
                        id="service_type"
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                      >
                        <option value="">请选择服务类型</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.name}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="mb-2 block text-sm font-medium">
                      地址
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                      placeholder="请输入您的地址（选填）"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium">
                      留言内容
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                      placeholder="请描述您的需求（选填）"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-green hover:bg-brand-green-dark"
                  >
                    {isSubmitting ? (
                      "提交中..."
                    ) : (
                      <>
                        提交咨询
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">联系方式</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                    <div>
                      <p className="font-medium">服务热线</p>
                      <a href={`tel:${company.phone}`} className="text-muted-foreground hover:text-brand-green">
                        {company.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                    <div>
                      <p className="font-medium">电子邮箱</p>
                      <a href={`mailto:${company.email}`} className="text-muted-foreground hover:text-brand-green">
                        {company.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                    <div>
                      <p className="font-medium">公司地址</p>
                      <p className="text-muted-foreground">{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                    <div>
                      <p className="font-medium">工作时间</p>
                      <p className="text-muted-foreground">{company.business_hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">服务承诺</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-brand-green" />
                    免费上门测量评估
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-brand-green" />
                    专业方案设计
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-brand-green" />
                    透明报价无隐形消费
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-brand-green" />
                    十年质保终身维护
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-brand-green p-6 text-white">
                <h3 className="text-lg font-semibold">快速咨询</h3>
                <p className="mt-2 text-white/80">
                  拨打服务热线，立即获取专业咨询
                </p>
                <a
                  href={`tel:${company.phone}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-medium text-brand-green hover:bg-white/90"
                >
                  <Phone className="h-4 w-4" />
                  {company.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container">
          <div className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">公司位置</h3>
              <Button variant="outline" size="sm" onClick={openMapNavigation} className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                导航前往
              </Button>
            </div>
            <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100">
              <iframe
                title="公司位置"
                src={`https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodeURIComponent(company.name || '公司位置')}&coordinate=gaode&callnative=1`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-brand-green" />
              <span>{company.address}</span>
              {company.latitude && company.longitude && (
                <span className="text-xs text-gray-400 ml-2">
                  (坐标: {company.latitude.toFixed(4)}, {company.longitude.toFixed(4)})
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
