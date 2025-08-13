"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  description: string | null;
  creditCost: number;
  enabled: boolean;
  _count?: { usages: number };
}

export default function AdminModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use admin endpoint to ensure we can see all
      const res = await fetch("/api/ai-models", { cache: "no-store" });
      if (!res.ok) throw new Error("Unauthorized or failed to load models");
      const data = await res.json();
      setModels(data.models || []);
    } catch (e: any) {
      setError(e.message || "Failed to load models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (m: Partial<AIModel> & { id?: string }) => {
    if (!m.id) return;
    const res = await fetch(`/api/admin/ai-models/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: m.name,
        provider: m.provider,
        modelId: m.modelId,
        description: m.description,
        creditCost: m.creditCost,
        enabled: m.enabled,
      })
    });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/ai-models/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  };

  return (
    <AppLayout>
      <div className="w-full p-4 text-[#f5f5f7]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-semibold">Admin · AI Models</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-7 px-2 text-xs" onClick={load}>Refresh</Button>
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
                  <th className="px-3 py-2 text-left font-medium">Provider</th>
                  <th className="px-3 py-2 text-left font-medium">Model ID</th>
                  <th className="px-3 py-2 text-left font-medium">Credit Cost</th>
                  <th className="px-3 py-2 text-left font-medium">Enabled</th>
                  <th className="px-3 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m, idx) => (
                  <tr key={m.id} className="border-t border-white/10">
                    <td className="px-3 py-2 w-44">
                      <Input defaultValue={m.name} className="h-7 text-xs bg-transparent border-white/20" onChange={(e) => (models[idx].name = e.target.value)} />
                    </td>
                    <td className="px-3 py-2 w-40">
                      <Input defaultValue={m.provider} className="h-7 text-xs bg-transparent border-white/20" onChange={(e) => (models[idx].provider = e.target.value)} />
                    </td>
                    <td className="px-3 py-2 w-56">
                      <Input defaultValue={m.modelId} className="h-7 text-xs bg-transparent border-white/20" onChange={(e) => (models[idx].modelId = e.target.value)} />
                    </td>
                    <td className="px-3 py-2 w-28">
                      <Input type="number" defaultValue={m.creditCost} className="h-7 text-xs bg-transparent border-white/20" onChange={(e) => (models[idx].creditCost = Number(e.target.value))} />
                    </td>
                    <td className="px-3 py-2">
                      <Switch defaultChecked={m.enabled} onCheckedChange={(v) => (models[idx].enabled = v)} />
                    </td>
                    <td className="px-3 py-2 space-x-2">
                      <Button className="h-7 px-2 text-xs" onClick={() => save(models[idx])}>Save</Button>
                      <Button variant="destructive" className="h-7 px-2 text-xs" onClick={() => remove(m.id)}>Delete</Button>
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
