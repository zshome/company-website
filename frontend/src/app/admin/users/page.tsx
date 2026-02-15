"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, User, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserItem {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_superuser: false,
    is_active: true,
  });

  const API_URL = "http://localhost:8000/api/v1";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${API_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users:", response.status);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) => u.username.includes(searchTerm) || u.email.includes(searchTerm)
  );

  const handleEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      is_superuser: user.is_superuser,
      is_active: user.is_active,
    });
    setShowEditor(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      is_superuser: false,
      is_active: true,
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        const response = await fetch(`${API_URL}/users/${editingUser.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            is_superuser: formData.is_superuser,
            is_active: formData.is_active,
          }),
        });
        
        if (response.ok) {
          fetchUsers();
          setShowEditor(false);
        } else {
          const error = await response.json();
          alert(error.detail || "保存失败");
        }
      } else {
        if (!formData.password) {
          alert("请输入密码");
          setSaving(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });
        
        if (response.ok) {
          fetchUsers();
          setShowEditor(false);
        } else {
          const error = await response.json();
          alert(error.detail || "添加失败");
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("操作失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个账号吗？")) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.detail || "删除失败");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("删除失败");
    }
  };

  const handleToggleActive = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          is_active: !user.is_active,
        }),
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">账号管理</h1>
        <Button onClick={handleAdd} className="bg-brand-green hover:bg-brand-green-dark">
          <Plus className="h-4 w-4 mr-2" />
          添加账号
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户名或邮箱..."
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">用户名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">邮箱</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">角色</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      暂无账号数据
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-brand-green" />
                          </div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        {user.is_superuser ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                            <Shield className="h-3 w-3" />
                            管理员
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">编辑员</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`px-2 py-1 rounded text-sm ${
                            user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "启用" : "禁用"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(user)} className="p-1 text-gray-400 hover:text-brand-green">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                            disabled={user.username === "admin"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{editingUser ? "编辑账号" : "添加账号"}</h2>
                <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入用户名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                    placeholder="请输入邮箱"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green"
                      placeholder="请输入密码"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_superuser}
                      onChange={(e) => setFormData({ ...formData, is_superuser: e.target.checked })}
                      className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                    />
                    <span className="text-sm text-gray-700">管理员权限</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-brand-green focus:ring-brand-green"
                    />
                    <span className="text-sm text-gray-700">启用账号</span>
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSave} 
                    className="flex-1 bg-brand-green hover:bg-brand-green-dark"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      editingUser ? "保存修改" : "添加"
                    )}
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
