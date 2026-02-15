"use client";

import { useState, useEffect } from "react";
import { Search, Phone, Mail, MapPin, MessageSquare, Check, Clock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  service_type: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const statusOptions = [
  { value: "all", label: "全部" },
  { value: "pending", label: "待处理" },
  { value: "processing", label: "处理中" },
  { value: "completed", label: "已完成" },
];

const statusMap: { [key: string]: { label: string; className: string; bgClass: string } } = {
  pending: { label: "待处理", className: "text-yellow-800", bgClass: "bg-yellow-100" },
  processing: { label: "处理中", className: "text-blue-800", bgClass: "bg-blue-100" },
  completed: { label: "已完成", className: "text-green-800", bgClass: "bg-green-100" },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [updating, setUpdating] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        setError("未登录，请先登录");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/contacts?skip=0&limit=100`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          setError("登录已过期，请重新登录");
        } else {
          setError(errorData.detail || `请求失败: ${response.status}`);
        }
        return;
      }
      
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setError("网络错误，请检查后端服务是否运行");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === "all" || contact.status === filter;
    const matchesSearch = 
      contact.name.includes(searchTerm) || 
      contact.phone.includes(searchTerm) || 
      (contact.service_type && contact.service_type.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`${API_URL}/contacts/${id}/status?status=${newStatus}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">咨询管理</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-gray-900">{error}</p>
            <Button onClick={fetchContacts} className="mt-4 bg-brand-green hover:bg-brand-green-dark">
              重试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">咨询管理</h1>
        <span className="text-sm text-gray-500">共 {filteredContacts.length} 条记录</span>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索姓名、电话或服务类型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            />
          </div>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === option.value ? "bg-brand-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无咨询记录</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">姓名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">电话</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">服务类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">提交时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{contact.name}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {contact.service_type || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${statusMap[contact.status]?.bgClass || "bg-gray-100"} ${statusMap[contact.status]?.className || "text-gray-800"}`}>
                        {statusMap[contact.status]?.label || contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(contact.created_at)}</td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" onClick={() => setSelectedContact(contact)}>查看详情</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">咨询详情</h2>
                <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center">
                    <span className="text-brand-green font-bold text-lg">{selectedContact.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedContact.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${statusMap[selectedContact.status]?.bgClass || "bg-gray-100"} ${statusMap[selectedContact.status]?.className || "text-gray-800"}`}>
                      {statusMap[selectedContact.status]?.label || selectedContact.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4" /><span>{selectedContact.phone}</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><Mail className="h-4 w-4" /><span>{selectedContact.email || "未填写"}</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4" /><span>{selectedContact.address || "未填写"}</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><Clock className="h-4 w-4" /><span>{formatDate(selectedContact.created_at)}</span></div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">服务类型</p>
                  <p className="font-medium">{selectedContact.service_type || "未选择"}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2"><MessageSquare className="h-4 w-4 inline mr-1" />留言内容</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedContact.message || "无留言"}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">更新状态</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={selectedContact.status === "pending" ? "default" : "outline"} 
                      className={selectedContact.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""} 
                      onClick={() => handleStatusChange(selectedContact.id, "pending")}
                      disabled={updating}
                    >待处理</Button>
                    <Button 
                      size="sm" 
                      variant={selectedContact.status === "processing" ? "default" : "outline"} 
                      className={selectedContact.status === "processing" ? "bg-blue-500 hover:bg-blue-600" : ""} 
                      onClick={() => handleStatusChange(selectedContact.id, "processing")}
                      disabled={updating}
                    >处理中</Button>
                    <Button 
                      size="sm" 
                      variant={selectedContact.status === "completed" ? "default" : "outline"} 
                      className={selectedContact.status === "completed" ? "bg-green-500 hover:bg-green-600" : ""} 
                      onClick={() => handleStatusChange(selectedContact.id, "completed")}
                      disabled={updating}
                    ><Check className="h-4 w-4 mr-1" />已完成</Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <a href={`tel:${selectedContact.phone}`} className="flex-1"><Button className="w-full bg-brand-green hover:bg-brand-green-dark"><Phone className="h-4 w-4 mr-2" />拨打电话</Button></a>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedContact(null)}>关闭</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
