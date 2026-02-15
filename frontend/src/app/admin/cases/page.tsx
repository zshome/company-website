"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus, Edit, Trash2, Star, X, Upload, Eye, MapPin, Ruler, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaseItem {
  id: number;
  title: string;
  description: string;
  location: string;
  service_type: string;
  area: string;
  cover_image: string | null;
  images: string[];
  is_featured: number;
  created_at: string;
}

export default function CasesAdminPage() {
  const [casesList, setCasesList] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showDetail, setShowDetail] = useState<CaseItem | null>(null);
  const [editingCase, setEditingCase] = useState<CaseItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    service_type: "墙面翻新",
    area: "",
    cover_image: "",
    images: [] as string[],
    is_featured: 0,
  });

  const API_URL = "http://localhost:8000/api/v1";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cases/`);
      if (response.ok) {
        const data = await response.json();
        setCasesList(data.map((item: any) => ({
          ...item,
          images: item.images ? (typeof item.images === 'string' ? JSON.parse(item.images) : item.images) : []
        })));
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const serviceTypes = ["全部", "墙面翻新", "旧房改造", "商业空间", "定制服务"];

  const filteredCases = casesList.filter((c) => {
    const matchesFilter = filter === "全部" || c.service_type === filter;
    const matchesSearch = c.title.includes(searchTerm) || c.location.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (caseItem: CaseItem) => {
    setEditingCase(caseItem);
    setFormData({
      title: caseItem.title,
      description: caseItem.description || "",
      location: caseItem.location || "",
      service_type: caseItem.service_type || "墙面翻新",
      area: caseItem.area || "",
      cover_image: caseItem.cover_image || "",
      images: caseItem.images || [],
      is_featured: caseItem.is_featured,
    });
    setShowEditor(true);
  };

  const handleAdd = () => {
    setEditingCase(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      service_type: "墙面翻新",
      area: "",
      cover_image: "",
      images: [],
      is_featured: 0,
    });
    setShowEditor(true);
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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData({ ...formData, cover_image: url });
    }
    setUploading(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingCase) {
        const response = await fetch(`${API_URL}/cases/${editingCase.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchCases();
          setShowEditor(false);
        }
      } else {
        const response = await fetch(`${API_URL}/cases/`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchCases();
          setShowEditor(false);
        }
      }
    } catch (error) {
      console.error("Error saving case:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个案例吗？")) return;
    try {
      const response = await fetch(`${API_URL}/cases/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        fetchCases();
      }
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const caseItem = casesList.find((c) => c.id === id);
    if (!caseItem) return;
    
    try {
      const response = await fetch(`${API_URL}/cases/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_featured: caseItem.is_featured === 1 ? 0 : 1 }),
      });
      if (response.ok) {
        fetchCases();
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">案例管理</h1>
        <Button onClick={handleAdd} className="bg-brand-green hover:bg-brand-green-dark">
          <Plus className="h-4 w-4 mr-2" />
          添加案例
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索案例标题或地点..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            />
          </div>
          <div className="flex gap-2">
            {serviceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === type ? "bg-brand-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            加载中...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredCases.map((caseItem) => (
              <div key={caseItem.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                <div className="aspect-video bg-gradient-to-br from-brand-green/20 to-brand-green/10 flex items-center justify-center relative">
                  {caseItem.cover_image ? (
                    <img src={caseItem.cover_image} alt={caseItem.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-brand-green/40" />
                  )}
                  {caseItem.is_featured === 1 && (
                    <div className="absolute top-2 right-2 bg-brand-green text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      精选
                    </div>
                  )}
                  {caseItem.images && caseItem.images.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded text-xs">
                      {caseItem.images.length} 张图片
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1">{caseItem.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{caseItem.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{caseItem.location}</span>
                    <span className="flex items-center gap-1"><Ruler className="h-3 w-3" />{caseItem.area}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{caseItem.service_type}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowDetail(caseItem)} className="p-1.5 text-gray-400 hover:text-blue-500" title="查看详情">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleToggleFeatured(caseItem.id)} className={`p-1.5 rounded ${caseItem.is_featured === 1 ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}`} title="设为精选">
                        <Star className={`h-4 w-4 ${caseItem.is_featured === 1 ? "fill-current" : ""}`} />
                      </button>
                      <button onClick={() => handleEdit(caseItem)} className="p-1.5 text-gray-400 hover:text-brand-green" title="编辑">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(caseItem.id)} className="p-1.5 text-gray-400 hover:text-red-500" title="删除">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-brand-green/20 to-brand-green/10 flex items-center justify-center">
                {showDetail.cover_image ? (
                  <img src={showDetail.cover_image} alt={showDetail.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-16 w-16 text-brand-green/40" />
                )}
              </div>
              <button onClick={() => setShowDetail(null)} className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white">
                <X className="h-5 w-5" />
              </button>
              {showDetail.is_featured === 1 && (
                <div className="absolute top-2 left-2 bg-brand-green text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  精选案例
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold">{showDetail.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{showDetail.location}</span>
                <span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{showDetail.area}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded">{showDetail.service_type}</span>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">案例描述</h3>
                <p className="text-gray-600 leading-relaxed">{showDetail.description}</p>
              </div>
              {showDetail.images && showDetail.images.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">装修展示 ({showDetail.images.length}张)</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {showDetail.images.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <img src={img} alt={`图片${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-400">
                创建时间：{showDetail.created_at ? new Date(showDetail.created_at).toLocaleDateString() : "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingCase ? "编辑案例" : "添加案例"}</h2>
                <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案例标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入案例标题"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">服务类型</label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    >
                      <option value="墙面翻新">墙面翻新</option>
                      <option value="旧房改造">旧房改造</option>
                      <option value="商业空间">商业空间</option>
                      <option value="定制服务">定制服务</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">面积</label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="如：120㎡"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地点</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="如：福州市鼓楼区"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案例描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入案例描述"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-24 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {formData.cover_image ? (
                        <img src={formData.cover_image} alt="封面" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-300" />
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      上传封面
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">装修展示图片 (可多选)</label>
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 mb-3"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    上传展示图片
                  </button>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-100 rounded overflow-hidden group">
                          <img src={img} alt={`图片${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured === 1}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
                    className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  <label htmlFor="is_featured" className="text-sm text-gray-700 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    设为精选案例
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving || uploading} className="flex-1 bg-brand-green hover:bg-brand-green-dark">
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />保存中...</> : (editingCase ? "保存修改" : "添加")}
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
