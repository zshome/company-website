"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockCases = [
  { id: 1, title: "福州某小区全屋翻新", description: "120平米三居室全屋墙面翻新，采用三棵树净味墙面漆，施工周期3天，业主当天入住。", location: "福州市鼓楼区", service_type: "墙面翻新", area: "120㎡", is_featured: 1, created_at: "2024-01-15" },
  { id: 2, title: "厦门办公室焕新改造", description: "200平米办公空间整体焕新，包含墙面、吊顶、地面处理，周末施工不影响正常办公。", location: "厦门市思明区", service_type: "商业空间", area: "200㎡", is_featured: 1, created_at: "2024-01-12" },
  { id: 3, title: "泉州老房整体改造", description: "80平米老房整体改造，水电改造、厨卫翻新、墙面处理一站式服务，焕然一新。", location: "泉州市丰泽区", service_type: "旧房改造", area: "80㎡", is_featured: 1, created_at: "2024-01-10" },
  { id: 4, title: "漳州别墅外墙翻新", description: "独栋别墅外墙全面翻新，防水处理加环保外墙漆，美观耐用。", location: "漳州市龙文区", service_type: "墙面翻新", area: "300㎡", is_featured: 0, created_at: "2024-01-08" },
  { id: 5, title: "莆田餐饮店装修焕新", description: "连锁餐饮店铺快速焕新，品牌形象升级，营业不受影响。", location: "莆田市城厢区", service_type: "商业空间", area: "150㎡", is_featured: 0, created_at: "2024-01-05" },
];

const serviceTypes = ["全部", "墙面翻新", "旧房改造", "商业空间", "定制服务"];

export default function CasesContent() {
  const [casesList, setCasesList] = useState(mockCases);
  const [filter, setFilter] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingCase, setEditingCase] = useState<typeof mockCases[0] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    service_type: "墙面翻新",
    area: "",
    is_featured: 0,
  });

  const filteredCases = casesList.filter((c) => {
    const matchesFilter = filter === "全部" || c.service_type === filter;
    const matchesSearch = c.title.includes(searchTerm) || c.location.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (caseItem: typeof mockCases[0]) => {
    setEditingCase(caseItem);
    setFormData({
      title: caseItem.title,
      description: caseItem.description,
      location: caseItem.location,
      service_type: caseItem.service_type,
      area: caseItem.area,
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
      is_featured: 0,
    });
    setShowEditor(true);
  };

  const handleSave = () => {
    if (editingCase) {
      setCasesList(
        casesList.map((c) =>
          c.id === editingCase.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newCase = {
        id: Math.max(...casesList.map((c) => c.id)) + 1,
        ...formData,
        created_at: new Date().toISOString().split("T")[0],
      };
      setCasesList([newCase, ...casesList]);
    }
    setShowEditor(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这个案例吗？")) {
      setCasesList(casesList.filter((c) => c.id !== id));
    }
  };

  const handleToggleFeatured = (id: number) => {
    setCasesList(
      casesList.map((c) =>
        c.id === id ? { ...c, is_featured: c.is_featured === 1 ? 0 : 1 } : c
      )
    );
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
                  filter === type
                    ? "bg-brand-green text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-brand-green/20 to-brand-green/10 flex items-center justify-center relative">
                <span className="text-brand-green/40">案例图片</span>
                {caseItem.is_featured === 1 && (
                  <div className="absolute top-2 right-2 bg-brand-green text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    精选
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1">{caseItem.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{caseItem.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>{caseItem.location}</span>
                  <span>{caseItem.area}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{caseItem.service_type}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(caseItem.id)}
                      className={`p-1 rounded ${
                        caseItem.is_featured === 1 ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${caseItem.is_featured === 1 ? "fill-current" : ""}`} />
                    </button>
                    <button onClick={() => handleEdit(caseItem)} className="p-1 text-gray-400 hover:text-brand-green">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(caseItem.id)} className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                  <Button onClick={handleSave} className="flex-1 bg-brand-green hover:bg-brand-green-dark">
                    {editingCase ? "保存修改" : "添加"}
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
