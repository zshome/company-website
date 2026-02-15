"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockNews = [
  { id: 1, title: "三棵树涂料荣获2024年度环保涂料十大品牌", category: "行业动态", summary: "三棵树涂料凭借卓越的环保性能和品质，再次荣获年度环保涂料十大品牌称号。", content: "详细内容...", is_published: true, view_count: 1256, created_at: "2024-01-15" },
  { id: 2, title: "宜然焕新完成福州某大型商业综合体焕新项目", category: "公司新闻", summary: "近日，我司成功完成福州某大型商业综合体的整体焕新项目。", content: "详细内容...", is_published: true, view_count: 892, created_at: "2024-01-12" },
  { id: 3, title: "墙面翻新需要注意的五个要点", category: "装修知识", summary: "墙面翻新看似简单，但其中有很多细节需要注意。", content: "详细内容...", is_published: true, view_count: 2341, created_at: "2024-01-10" },
  { id: 4, title: "如何选择环保墙面漆？", category: "装修知识", summary: "市面上墙面漆品牌众多，如何选择真正环保的产品？", content: "详细内容...", is_published: true, view_count: 1876, created_at: "2024-01-08" },
  { id: 5, title: "宜然焕新与三棵树达成深度战略合作", category: "公司新闻", summary: "宜然焕新与三棵树涂料正式签署深度战略合作协议。", content: "详细内容...", is_published: false, view_count: 0, created_at: "2024-01-05" },
];

const categories = ["全部", "公司新闻", "行业动态", "装修知识"];

export default function NewsContent() {
  const [newsList, setNewsList] = useState(mockNews);
  const [filter, setFilter] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingNews, setEditingNews] = useState<typeof mockNews[0] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "公司新闻",
    summary: "",
    content: "",
    is_published: true,
  });

  const filteredNews = newsList.filter((news) => {
    const matchesFilter = filter === "全部" || news.category === filter;
    const matchesSearch = news.title.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (news: typeof mockNews[0]) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      category: news.category,
      summary: news.summary,
      content: news.content,
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
      is_published: true,
    });
    setShowEditor(true);
  };

  const handleSave = () => {
    if (editingNews) {
      setNewsList(
        newsList.map((n) =>
          n.id === editingNews.id
            ? { ...n, ...formData }
            : n
        )
      );
    } else {
      const newNews = {
        id: Math.max(...newsList.map((n) => n.id)) + 1,
        ...formData,
        view_count: 0,
        created_at: new Date().toISOString().split("T")[0],
      };
      setNewsList([newNews, ...newsList]);
    }
    setShowEditor(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这篇新闻吗？")) {
      setNewsList(newsList.filter((n) => n.id !== id));
    }
  };

  const handleTogglePublish = (id: number) => {
    setNewsList(
      newsList.map((n) =>
        n.id === id ? { ...n, is_published: !n.is_published } : n
      )
    );
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
                  filter === cat
                    ? "bg-brand-green text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

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
                    <p className="font-medium line-clamp-1">{news.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{news.summary}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {news.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(news.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        news.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {news.is_published ? "已发布" : "草稿"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{news.view_count}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{news.created_at}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(news)}
                        className="p-1 text-gray-400 hover:text-brand-green"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(news.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingNews ? "编辑新闻" : "发布新闻"}
                </h2>
                <button
                  onClick={() => setShowEditor(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入新闻内容"
                  />
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
                  <Button onClick={handleSave} className="flex-1 bg-brand-green hover:bg-brand-green-dark">
                    {editingNews ? "保存修改" : "发布"}
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
