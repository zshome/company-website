"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Star, X, Upload, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceItem {
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
  created_at: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    features: [] as string[],
    price_range: "",
    duration: "",
    is_featured: false,
    sort_order: 0,
  });
  const [newFeature, setNewFeature] = useState("");

  const API_URL = "http://localhost:8000/api/v1";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return null;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/services/`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(
    (s) => s.name.includes(searchTerm) || s.slug.includes(searchTerm)
  );

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || "",
      icon: service.icon || "",
      image: service.image || "",
      features: service.features || [],
      price_range: service.price_range || "",
      duration: service.duration || "",
      is_featured: service.is_featured,
      sort_order: service.sort_order,
    });
    setShowEditor(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      image: "",
      features: [],
      price_range: "",
      duration: "",
      is_featured: false,
      sort_order: 0,
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setSaving(true);
    try {
      if (editingService) {
        const response = await fetch(`${API_URL}/services/${editingService.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchServices();
          setShowEditor(false);
        } else {
          const error = await response.json();
          alert(error.detail || "保存失败");
        }
      } else {
        const response = await fetch(`${API_URL}/services/`, {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchServices();
          setShowEditor(false);
        } else {
          const error = await response.json();
          alert(error.detail || "添加失败");
        }
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("操作失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个服务项目吗？")) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers,
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ is_featured: !service.is_featured }),
      });
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const generateSlug = (name: string) => {
    const slugMap: { [key: string]: string } = {
      "墙面翻新": "wall-renovation",
      "旧房改造": "old-house-renovation",
      "商业空间": "commercial-space",
      "外墙翻新": "exterior-renovation",
      "定制服务": "custom-service",
    };
    return slugMap[name] || name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">服务项目管理</h1>
        <Button onClick={handleAdd} className="bg-brand-green hover:bg-brand-green-dark">
          <Plus className="h-4 w-4 mr-2" />
          添加服务
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索服务名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            加载中...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">排序</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">服务名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">标识</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">价格范围</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">工期</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">精选</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">{service.sort_order}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{service.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{service.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{service.price_range || "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{service.duration || "-"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleFeatured(service.id)}
                        className={`p-1 rounded ${service.is_featured ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`}
                      >
                        <Star className={`h-5 w-5 ${service.is_featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(service)} className="p-1 text-gray-400 hover:text-brand-green">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="p-1 text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingService ? "编辑服务" : "添加服务"}</h2>
                <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">服务名称</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({ ...formData, name, slug: generateSlug(name) });
                      }}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="如：墙面翻新"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL标识</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="如：wall-renovation"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入服务描述"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">价格范围</label>
                    <input
                      type="text"
                      value={formData.price_range}
                      onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="如：15-35元/㎡"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">施工工期</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="如：1-3天"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务特色</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                      className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="输入特色后按回车添加"
                    />
                    <Button type="button" onClick={addFeature} variant="outline">添加</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {feature}
                        <button onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务图片</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-24 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {formData.image ? (
                        <img src={formData.image} alt="服务图片" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-sm">暂无图片</span>
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <span className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        上传图片
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                    />
                    <label htmlFor="is_featured" className="text-sm text-gray-700 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      设为精选服务
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 bg-brand-green hover:bg-brand-green-dark">
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />保存中...</> : (editingService ? "保存修改" : "添加")}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditor(false)}>
                    取消
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
