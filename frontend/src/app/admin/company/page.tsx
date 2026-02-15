"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Upload, Loader2, Building, Phone, Mail, MapPin, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CompanyData {
  id: number;
  name: string;
  short_name: string | null;
  logo: string | null;
  description: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  wechat: string | null;
  weibo: string | null;
  copyright_text: string | null;
  icp: string | null;
  business_hours: string | null;
  banner_images: string[];
  latitude: number | null;
  longitude: number | null;
}

export default function CompanyPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CompanyData>({
    id: 0,
    name: "",
    short_name: "",
    logo: null,
    description: "",
    phone: "",
    email: "",
    address: "",
    wechat: "",
    weibo: "",
    copyright_text: "",
    icp: "",
    business_hours: "",
    banner_images: [],
    latitude: null,
    longitude: null,
  });
  const router = useRouter();

  const API_URL = "http://localhost:8000/api/v1";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return null;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/company/`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...data,
          banner_images: data.banner_images || [],
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        });
      }
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const token = localStorage.getItem("admin_token");
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    
    try {
      const response = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });
      
      if (response.ok) {
        const data = await response.json();
        return `http://localhost:8000${data.url}`;
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    return null;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData({ ...formData, logo: url });
    }
    setUploading(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) {
        newImages.push(url);
      }
    }
    
    setFormData({ ...formData, banner_images: [...formData.banner_images, ...newImages] });
    setUploading(false);
  };

  const removeBannerImage = (index: number) => {
    setFormData({
      ...formData,
      banner_images: formData.banner_images.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/company/`, {
        method: "PUT",
        headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("保存成功！");
        fetchCompany();
      } else if (response.status === 401) {
        alert("登录已过期，请重新登录");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.push("/admin/login");
      } else if (response.status === 403) {
        alert("权限不足，只有管理员可以修改公司信息");
      } else {
        const error = await response.json();
        alert(error.detail || "保存失败");
      }
    } catch (error) {
      console.error("Error saving company:", error);
      alert("保存失败，请检查网络连接");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">公司信息</h1>
        <Button onClick={handleSave} disabled={saving || uploading} className="bg-brand-green hover:bg-brand-green-dark">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              保存
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-brand-green" />
            基本信息
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Building className="h-8 w-8 text-gray-300" />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      上传Logo
                    </span>
                  </label>
                  {formData.logo && (
                    <button
                      onClick={() => setFormData({ ...formData, logo: null })}
                      className="block text-sm text-red-500 hover:text-red-600"
                    >
                      移除Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">简称</label>
              <input
                type="text"
                value={formData.short_name || ""}
                onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                placeholder="显示在网站顶部的简称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司简介</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-brand-green" />
            联系方式
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="h-4 w-4" />
                联系电话
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                电子邮箱
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                公司地址
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">营业时间</label>
              <input
                type="text"
                value={formData.business_hours || ""}
                onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                placeholder="如：周一至周日 8:00-20:00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">微信公众号</label>
                <input
                  type="text"
                  value={formData.wechat || ""}
                  onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">微博账号</label>
                <input
                  type="text"
                  value={formData.weibo || ""}
                  onChange={(e) => setFormData({ ...formData, weibo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-green" />
            地图位置
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              配置公司在地图上的位置，用于前台联系我们页面展示。可通过
              <a href="https://lbs.amap.com/tools/picker" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline mx-1">高德地图坐标拾取器</a>
              获取经纬度坐标。
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">纬度 (Latitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude || ""}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  placeholder="如：26.0745"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经度 (Longitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude || ""}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  placeholder="如：119.2965"
                />
              </div>
            </div>
            
            {formData.latitude && formData.longitude && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  当前坐标：<span className="font-mono">{formData.latitude}, {formData.longitude}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  此坐标将用于在联系我们页面显示公司位置地图
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-green" />
            首页轮播图片
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">上传图片将显示在首页轮播区域，建议尺寸：800x800像素</p>
            
            <input ref={bannerInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleBannerUpload} />
            <button
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              上传轮播图片
            </button>
            
            {formData.banner_images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                {formData.banner_images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                    <img src={img} alt={`轮播图${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeBannerImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">网站设置</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">版权信息</label>
              <input
                type="text"
                value={formData.copyright_text || ""}
                onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ICP备案号</label>
              <input
                type="text"
                value={formData.icp || ""}
                onChange={(e) => setFormData({ ...formData, icp: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                placeholder="如：闽ICP备XXXXXXXX号"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
