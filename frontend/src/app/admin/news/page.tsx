"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus, Edit, Trash2, X, Upload, Eye, Calendar, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  cover_image: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
}

export default function NewsAdminPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [showDetail, setShowDetail] = useState<NewsItem | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentImageRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "公司新闻",
    summary: "",
    content: "",
    cover_image: "",
    is_published: true,
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
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/news/`);
      if (response.ok) {
        const data = await response.json();
        setNewsList(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["全部", "公司新闻", "行业动态", "装修知识"];

  const filteredNews = newsList.filter((news) => {
    const matchesFilter = filter === "全部" || news.category === filter;
    const matchesSearch = news.title.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (news: NewsItem) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      category: news.category,
      summary: news.summary || "",
      content: news.content || "",
      cover_image: news.cover_image || "",
      is_published: news.is_published,
    });
    setShowEditor(true);
  };

  const handleAdd = () => {
    setEditingNews(null);
    setFormData({
      title: "",
      category: "公司新闻",
      summary: "",
      content: "",
      cover_image: "",
      is_published: true,
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

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const url = await uploadImage(file);
    if (url && contentTextareaRef.current) {
      const textarea = contentTextareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const imageMarkdown = `![图片](${url})`;
      const newContent = formData.content.substring(0, start) + imageMarkdown + formData.content.substring(end);
      setFormData({ ...formData, content: newContent });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingNews) {
        const response = await fetch(`${API_URL}/news/${editingNews.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchNews();
          setShowEditor(false);
        }
      } else {
        const response = await fetch(`${API_URL}/news/`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchNews();
          setShowEditor(false);
        }
      }
    } catch (error) {
      console.error("Error saving news:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这篇新闻吗？")) return;
    try {
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleTogglePublish = async (id: number) => {
    const news = newsList.find((n) => n.id === id);
    if (!news) return;
    
    try {
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_published: !news.is_published }),
      });
      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(!\[.*?\]\([^)]+\))/g);
    return parts.map((part, idx) => {
      const match = part.match(/!\[(.*?)\]\(([^)]+)\)/);
      if (match) {
        return (
          <img key={idx} src={match[2]} alt={match[1]} className="max-w-full h-auto rounded my-2" />
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">新闻管理</h1>
        <Button onClick={handleAdd} className="bg-brand-green hover:bg-brand-green-dark">
          <Plus className="h-4 w-4 mr-2" />
          发布新闻
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索新闻标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === cat ? "bg-brand-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">标题</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">浏览量</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">发布时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredNews.map((news) => (
                  <tr key={news.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                          {news.cover_image ? (
                            <img src={news.cover_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{news.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{news.summary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">{news.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(news.id)}
                        className={`px-2 py-1 rounded text-sm ${news.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                      >
                        {news.is_published ? "已发布" : "草稿"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{news.view_count}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {news.created_at ? new Date(news.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowDetail(news)} className="p-1 text-gray-400 hover:text-blue-500">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEdit(news)} className="p-1 text-gray-400 hover:text-brand-green">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(news.id)} className="p-1 text-gray-400 hover:text-red-500">
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

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="absolute top-2 left-2 flex gap-2">
                <span className="px-2 py-0.5 bg-white/80 rounded text-xs">{showDetail.category}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${showDetail.is_published ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                  {showDetail.is_published ? "已发布" : "草稿"}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold">{showDetail.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{showDetail.created_at ? new Date(showDetail.created_at).toLocaleDateString() : "-"}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{showDetail.view_count} 次浏览</span>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">摘要</h3>
                <p className="text-gray-600">{showDetail.summary}</p>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">正文</h3>
                <div className="text-gray-600 leading-relaxed">{renderContent(showDetail.content || "")}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingNews ? "编辑新闻" : "发布新闻"}</h2>
                <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入新闻标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                  >
                    <option value="公司新闻">公司新闻</option>
                    <option value="行业动态">行业动态</option>
                    <option value="装修知识">装修知识</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入新闻摘要"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">正文</label>
                    <div className="flex gap-2">
                      <input ref={contentImageRef} type="file" accept="image/*" className="hidden" onChange={handleContentImageUpload} />
                      <button
                        onClick={() => contentImageRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
                      >
                        {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                        插入图片
                      </button>
                    </div>
                  </div>
                  <textarea
                    ref={contentTextareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green font-mono text-sm"
                    placeholder="请输入新闻内容，点击插入图片可在光标位置插入图片"
                  />
                  <p className="text-xs text-gray-400 mt-1">提示：使用 ![描述](图片链接) 格式插入图片</p>
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
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      上传封面
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  <label htmlFor="is_published" className="text-sm text-gray-700">立即发布</label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving || uploading} className="flex-1 bg-brand-green hover:bg-brand-green-dark">
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />保存中...</> : (editingNews ? "保存修改" : "发布")}
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
