"use client";

import { useState } from "react";
import { Search, Phone, Mail, MapPin, MessageSquare, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockContacts = [
  { id: 1, name: "张先生", phone: "13812345678", email: "zhang@example.com", address: "福州市鼓楼区xxx路", service_type: "墙面翻新", message: "想咨询全屋墙面翻新服务，房子面积约120平米", status: "pending", created_at: "2024-01-15 10:30" },
  { id: 2, name: "李女士", phone: "13987654321", email: "li@example.com", address: "厦门市思明区xxx路", service_type: "旧房改造", message: "老房子需要整体翻新，包括水电改造", status: "pending", created_at: "2024-01-15 09:20" },
  { id: 3, name: "王先生", phone: "13711112222", email: "wang@example.com", address: "泉州市丰泽区xxx路", service_type: "商业空间", message: "办公室需要焕新，面积约200平米", status: "processing", created_at: "2024-01-14 16:45" },
  { id: 4, name: "赵女士", phone: "13633334444", email: "zhao@example.com", address: "漳州市龙文区xxx路", service_type: "定制服务", message: "儿童房需要环保墙面处理", status: "completed", created_at: "2024-01-14 11:00" },
  { id: 5, name: "陈先生", phone: "13555556666", email: "chen@example.com", address: "莆田市城厢区xxx路", service_type: "墙面翻新", message: "出租房需要快速翻新", status: "completed", created_at: "2024-01-13 14:30" },
];

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

export default function ContactsContent() {
  const [contacts, setContacts] = useState(mockContacts);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null);

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === "all" || contact.status === filter;
    const matchesSearch =
      contact.name.includes(searchTerm) ||
      contact.phone.includes(searchTerm) ||
      contact.service_type.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setContacts(
      contacts.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">咨询管理</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            共 {filteredContacts.length} 条记录
          </span>
        </div>
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
                  filter === option.value
                    ? "bg-brand-green text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

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
                  <td className="px-4 py-3">
                    <span className="font-medium">{contact.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contact.phone}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {contact.service_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        statusMap[contact.status].bgClass
                      } ${statusMap[contact.status].className}`}
                    >
                      {statusMap[contact.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{contact.created_at}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedContact(contact)}
                    >
                      查看详情
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">咨询详情</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center">
                    <span className="text-brand-green font-bold text-lg">
                      {selectedContact.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedContact.name}</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        statusMap[selectedContact.status].bgClass
                      } ${statusMap[selectedContact.status].className}`}
                    >
                      {statusMap[selectedContact.status].label}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{selectedContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{selectedContact.email || "未填写"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedContact.address || "未填写"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{selectedContact.created_at}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">服务类型</p>
                  <p className="font-medium">{selectedContact.service_type}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    留言内容
                  </p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedContact.message || "无留言"}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">更新状态</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedContact.status === "pending" ? "default" : "outline"}
                      className={selectedContact.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                      onClick={() => handleStatusChange(selectedContact.id, "pending")}
                    >
                      待处理
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedContact.status === "processing" ? "default" : "outline"}
                      className={selectedContact.status === "processing" ? "bg-blue-500 hover:bg-blue-600" : ""}
                      onClick={() => handleStatusChange(selectedContact.id, "processing")}
                    >
                      处理中
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedContact.status === "completed" ? "default" : "outline"}
                      className={selectedContact.status === "completed" ? "bg-green-500 hover:bg-green-600" : ""}
                      onClick={() => handleStatusChange(selectedContact.id, "completed")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      已完成
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="flex-1"
                  >
                    <Button className="w-full bg-brand-green hover:bg-brand-green-dark">
                      <Phone className="h-4 w-4 mr-2" />
                      拨打电话
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedContact(null)}
                  >
                    关闭
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
