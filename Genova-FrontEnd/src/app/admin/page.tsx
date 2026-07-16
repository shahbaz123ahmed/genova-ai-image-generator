"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

type User = {
  id: string;
  first_name: string;
  email: string;
  credits: number;
};

type PlanRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan_name: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "requests">("users");
  
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  const [requests, setRequests] = useState<PlanRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newCredits, setNewCredits] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState<PlanRequest | null>(null);
  const [approvePlan, setApprovePlan] = useState<string>("Pro");
  const [approveMonths, setApproveMonths] = useState<number>(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/auth/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/auth/requests`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchRequests();
    }
  }, [isAuthenticated]);

  const handleUpdateCredits = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/auth/update-credits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: editingUser.id, credits: newCredits }),
      });
      if (res.ok) {
        alert("Credits updated!");
        setEditingUser(null);
        fetchUsers();
      } else {
        alert("Update failed");
      }
    } catch {
      alert("Error updating credits");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete the user account for ${email}?`)) {
      return;
    }
    setIsUpdating(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/auth/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch {
      alert("Error deleting user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApprovePlan = async () => {
    if (!approvingRequest) return;
    setIsUpdating(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/auth/requests/${approvingRequest.id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_name: approvePlan, months: approveMonths }),
      });
      if (res.ok) {
        alert("Plan approved and user updated!");
        setRequests((prev) =>
          prev.map((r) =>
            r.id === approvingRequest.id ? { ...r, status: "approved", plan_name: approvePlan } : r
          )
        );
        setApprovingRequest(null);
        fetchUsers();
      } else {
        alert("Approval failed");
      }
    } catch {
      alert("Error approving plan");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRequest = async (reqId: string) => {
    if (!confirm("Are you sure you want to delete this plan request?")) return;
    setIsUpdating(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${baseUrl}/auth/requests/${reqId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Request deleted successfully!");
        fetchRequests();
      } else {
        alert("Failed to delete request");
      }
    } catch {
      alert("Error deleting request");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === ADMIN_EMAIL && passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid email or password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#131b2c] flex flex-col items-center justify-center p-4">
        <div className="bg-[#181e27] border border-white/5 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
          <div className="flex justify-center mb-6">
             <div className="h-16 w-16 relative">
               <Image src="/icon.png" alt="Logo" fill className="rounded-xl object-contain" />
             </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter admin email..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#131b2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter admin password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#131b2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131b2c] text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#181e27] border-r border-white/5 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => router.push("/")}>
          <div className="h-10 w-10 relative flex-shrink-0">
            <Image src="/icon.png" alt="Logo" fill className="rounded-lg object-contain" />
          </div>
          <span className="text-2xl font-black text-green-400">Genova Admin</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "users" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </button>
          <button onClick={() => setActiveTab("requests")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "requests" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Plan Requests
          </button>
          <a href="/dashboard" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg font-medium transition-colors mt-8">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to App
          </a>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPasswordInput("");
              router.push("/");
            }}
            className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-white/5 px-4 py-3 rounded-lg font-medium transition-colors mt-4 text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout Admin
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "users" && (
            <>
              <header className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                  <p className="text-gray-400">Manually view and manage user credits.</p>
                </div>
                <div className="bg-[#181e27] border border-white/5 px-6 py-3 rounded-xl flex items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Total Users</div>
                    <div className="text-2xl font-bold text-green-400">{users.length}</div>
                  </div>
                </div>
              </header>

              <div className="bg-[#181e27] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-sm">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Credits</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-400">Loading users...</td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-400">No users found.</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-medium text-white">{user.first_name || "N/A"}</td>
                            <td className="p-4 text-gray-300">{user.email}</td>
                            <td className="p-4">
                              <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-sm font-bold">
                                {user.credits}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingUser(user);
                                    setNewCredits(user.credits);
                                  }}
                                  className="text-sm font-medium text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 px-4 py-2 rounded-lg transition-colors"
                                >
                                  Edit Credits
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-lg transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "requests" && (
            <>
              <header className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Plan Requests</h1>
                  <p className="text-gray-400">Users who have submitted a request to buy a plan.</p>
                </div>
                <div className="bg-[#181e27] border border-white/5 px-6 py-3 rounded-xl flex items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Pending Requests</div>
                    <div className="text-2xl font-bold text-yellow-400">{requests.filter(r => r.status === 'pending').length}</div>
                  </div>
                </div>
              </header>

              <div className="bg-[#181e27] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-gray-400 text-sm">
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Phone</th>
                        <th className="p-4 font-medium">Plan Requested</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingRequests ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">Loading requests...</td>
                        </tr>
                      ) : requests.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">No requests found.</td>
                        </tr>
                      ) : (
                        requests.map((req) => (
                          <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 text-gray-400 text-sm">{new Date(req.created_at).toLocaleString()}</td>
                            <td className="p-4 font-medium text-white">{req.name || "N/A"}</td>
                            <td className="p-4 text-gray-300">{req.email}</td>
                            <td className="p-4 text-gray-300">{req.phone}</td>
                            <td className="p-4 text-green-400 font-medium">{req.plan_name}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                {req.status === 'pending' && (
                                  <button
                                    onClick={() => { setApprovingRequest(req); setApprovePlan(req.plan_name || "Pro"); setApproveMonths(1); }}
                                    className="text-sm font-medium text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 px-4 py-2 rounded-lg transition-colors"
                                  >
                                    Approve
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteRequest(req.id, req.email)}
                                  className="text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-lg transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Edit Credits Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#181e27] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <IoClose size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Manage Credits</h2>
            <p className="text-gray-400 text-sm mb-6">
              Update credits for <span className="text-white font-semibold">{editingUser.email}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">New Credit Balance</label>
              <input
                type="number"
                value={newCredits}
                onChange={(e) => setNewCredits(Number(e.target.value))}
                className="w-full bg-[#131b2c] border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/50"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingUser(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCredits}
                disabled={isUpdating}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Request Modal */}
      {approvingRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#181e27] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setApprovingRequest(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <IoClose size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Approve Request</h2>
            <p className="text-gray-400 text-sm mb-6">
              Approving plan for <span className="text-white font-semibold">{approvingRequest.email}</span>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Plan</label>
              <select
                value={approvePlan}
                onChange={(e) => setApprovePlan(e.target.value)}
                className="w-full bg-[#131b2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400/50"
              >
                <option value="Lite">Lite (300 Credits/mo)</option>
                <option value="Pro">Pro (1500 Credits/mo)</option>
                <option value="Enterprise">Enterprise (Unlimited/mo)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Duration (Months)</label>
              <input
                type="number"
                min="1"
                value={approveMonths}
                onChange={(e) => setApproveMonths(Number(e.target.value))}
                className="w-full bg-[#131b2c] border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-green-400/50"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setApprovingRequest(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveRequest}
                disabled={isUpdating}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating ? "Approving..." : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
