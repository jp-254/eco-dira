// client/src/pages/AdminDashboard.tsx
// client/src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { getToken, clearToken } from "../services/auth";

type Client = {
  _id: string;
  client_id?: string;
  name?: string;
  houseNumber?: string;
  pointsBalance?: number;
};
type Redemption = {
  _id: string;
  clientId: string;
  pointsUsed: number;
  rewardDesc: string;
  status: string;
};

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(false);

  // Build headers safely using token from getToken()
  function makeHeaders(): HeadersInit {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function handleUnauthorized() {
    // Clear and redirect to login (keeps behavior same as your logout)
    clearToken();
    window.location.href = "/admin-login";
  }

  async function loadData() {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_BASE;

      // Clients fetch
      const clientsRes = await fetch(`${base}/api/clients`, {
        headers: makeHeaders(),
      });
      if (clientsRes.status === 401) {
        await handleUnauthorized();
        return;
      }
      if (!clientsRes.ok) {
        const txt = await clientsRes.text().catch(() => clientsRes.statusText);
        throw new Error(`Failed to load clients: ${txt}`);
      }
      const clientsJson = await clientsRes.json().catch(() => ({}));
      // Support both { data: [...] } and direct array responses
      setClients(Array.isArray(clientsJson) ? clientsJson : clientsJson.data ?? []);

      // Pending redemptions fetch
      const redRes = await fetch(`${base}/api/points/pending`, {
        headers: makeHeaders(),
      });
      if (redRes.status === 401) {
        await handleUnauthorized();
        return;
      }
      if (!redRes.ok) {
        // If backend doesn't have /pending, it might return all redemptions; try to parse anyway
        const txt = await redRes.text().catch(() => redRes.statusText);
        throw new Error(`Failed to load redemptions: ${txt}`);
      }
      const redJson = await redRes.json().catch(() => ([]));
      setRedemptions(Array.isArray(redJson) ? redJson : redJson.data ?? []);
    } catch (err) {
      console.error(err);
      // optional: show user-friendly message
      // alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function approve(id: string) {
    try {
      const base = import.meta.env.VITE_API_BASE;
      const res = await fetch(`${base}/api/points/redeem/${id}/approve`, {
        method: "POST",
        headers: makeHeaders(),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Approve failed");
      }

      // reload after successful approve
      await loadData();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  const logout = () => {
    clearToken();
    window.location.href = "/admin-login";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Clients</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-2">
            {clients.map((c) => (
              <div key={c._id} className="flex justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{c.name ?? "—"}</div>
                  <div className="text-sm text-gray-500">{c.houseNumber ?? c.client_id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    Points: <strong>{c.pointsBalance ?? 0}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Pending Redemptions</h2>
        {redemptions.length === 0 ? (
          <div>No pending redemptions</div>
        ) : (
          <div className="grid gap-2">
            {redemptions.map((r) => (
              <div key={r._id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.rewardDesc}</div>
                  <div className="text-sm text-gray-500">
                    Client: {r.clientId} • Points: {r.pointsUsed}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => approve(r._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
