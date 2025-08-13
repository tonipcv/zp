"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  credits: number;
  maxCredits: number;
  trialActivated: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Unauthorized or error loading users");
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateUser = async (u: Partial<AdminUser> & { id: string }) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, plan: u.plan, credits: u.credits, maxCredits: u.maxCredits })
    });
    if (res.ok) {
      await load();
    }
  };

  return (
    <AppLayout>
      <div className="w-full p-4 text-[#f5f5f7]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-semibold">Admin · Users</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-7 px-2 text-xs" onClick={load}>Refresh</Button>
            <Link href="/whatsapp" className="text-xs text-[#9aa0a6] hover:text-white">Back</Link>
          </div>
        </div>

        {loading ? null : error ? (
          <div className="text-xs text-red-400">{error}</div>
        ) : (
          <div className="overflow-auto border border-white/10 rounded-md">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Plan</th>
                  <th className="px-3 py-2 text-left font-medium">Credits</th>
                  <th className="px-3 py-2 text-left font-medium">Max Credits</th>
                  <th className="px-3 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="px-3 py-2">{u.name || "-"}</td>
                    <td className="px-3 py-2">{u.email || "-"}</td>
                    <td className="px-3 py-2">
                      <Select defaultValue={u.plan} onValueChange={(v) => (u.plan = v)}>
                        <SelectTrigger className="h-7 w-36 text-xs bg-transparent border-white/20">
                          <SelectValue placeholder="plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {['free','trial','premium','enterprise','superadmin'].map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 w-28">
                      <Input defaultValue={u.credits} type="number" className="h-7 text-xs bg-transparent border-white/20" onChange={(e) => (u.credits = Number(e.target.value))} />
                    </td>
                    <td className="px-3 py-2 w-28">
                      <Input defaultValue={u.maxCredits} type="number" className="h-7 text-xs bg-transparent border-white/20" onChange={(e) => (u.maxCredits = Number(e.target.value))} />
                    </td>
                    <td className="px-3 py-2">
                      <Button className="h-7 px-2 text-xs" onClick={() => updateUser(u)}>Save</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
