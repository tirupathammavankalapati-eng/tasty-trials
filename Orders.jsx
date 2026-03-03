import React, { useEffect, useState } from "react";
import api from "../api";
import Header from "../components/Header.jsx";

const PLACEHOLDER = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60";

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const me = await api.get("/auth/me");
      const u = me.data.user;
      setUser(u);
      const endpoint = u?.role === 'admin' ? '/orders/admin' : '/orders/my';
      const o = await api.get(endpoint);
      setOrders(o.data);
    })();
  }, []);

  const [imgMsg, setImgMsg] = useState("");
  function showMsg(m){ setImgMsg(m); setTimeout(()=>setImgMsg(""), 2000); }

  async function refreshImagesFor(category){
    try{
      const qs = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
      const r = await api.post(`/items/refresh-images${qs}`);
      showMsg(`Updated ${r.data.updated}/${r.data.total} images${category&&category!=='all'?` in ${category}`:''}`);
    }catch{ showMsg('Failed to refresh images'); }
  }

  async function refresh() {
    try {
      const me = await api.get("/auth/me");
      const u = me.data.user;
      setUser(u);
      const endpoint = u?.role === 'admin' ? '/orders/admin' : '/orders/my';
      const o = await api.get(endpoint);
      setOrders(o.data);
    } catch {}
  }

  async function handleApprove(id) {
    try {
      await api.post(`/orders/${id}/approve`);
      await refresh();
    } catch {}
  }

  async function handleReject(id) {
    try {
      await api.post(`/orders/${id}/reject`);
      await refresh();
    } catch {}
  }

  return (
    <div>
      <Header user={user} />
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold">My Orders</div>
          {user?.role === 'admin' && (
            <div className="flex items-center gap-2 text-sm">
              <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={()=>refreshImagesFor('all')}>Refresh Images: All</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={()=>refreshImagesFor('veg')}>Veg</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={()=>refreshImagesFor('non-veg')}>Non‑Veg</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={()=>refreshImagesFor('seafood')}>Seafood</button>
              <button className="px-2 py-1 border rounded hover:bg-gray-50" onClick={()=>refreshImagesFor('chinese')}>Chinese</button>
            </div>
          )}
        </div>
        {imgMsg && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">{imgMsg}</div>}
        {orders.length === 0 ? (
          <div className="mx-auto max-w-md text-center border rounded-lg p-6 bg-white">
            <img src={PLACEHOLDER} alt="No orders" className="w-full h-48 object-cover rounded mb-4" />
            <div className="font-medium">No orders yet</div>
            <div className="text-sm text-gray-600">Place your first order to see it here.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="border rounded p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2">
                    <span>Order #{o._id.slice(-6)}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${o.status === 'approved' ? 'bg-green-100 text-green-700' : o.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.status || 'pending'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Total: ₹{o.total}</div>
                </div>
                {user?.role === 'admin' && o.status === 'pending' && (
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => handleApprove(o._id)} className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700">Approve</button>
                    <button onClick={() => handleReject(o._id)} className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700">Reject</button>
                  </div>
                )}
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex gap-3 border rounded-lg overflow-hidden">
                      <div className="w-24 h-16 bg-gray-100">
                        <img src={it.itemId?.image || PLACEHOLDER} alt={it.itemId?.name || "item"} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <div className="font-medium">{it.itemId?.name || "Item"}</div>
                        <div className="text-sm text-gray-600">Qty: {it.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
