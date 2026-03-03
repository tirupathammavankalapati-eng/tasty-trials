import React, { useEffect, useState } from "react";
import api from "../api";
import FoodCard from "../components/foodcard.jsx";

const PLACEHOLDER = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60";
const onErr = (e) => { e.currentTarget.src = PLACEHOLDER; e.currentTarget.onerror = null; };

export default function Saved() {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState({ items: [] });
  const [selected, setSelected] = useState(new Set());
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("az");

  useEffect(() => {
    (async () => {
      const me = await api.get("/auth/me");
      setUser(me.data.user);
      await refreshSaved();
    })();
  }, []);

  async function refreshSaved() {
    const s = await api.get("/saved");
    setSaved(s.data || { items: [] });
    setSelected(new Set());
  }

  async function remove(id) {
    await api.delete(`/saved/${id}`);
    await refreshSaved();
  }

  async function addToCart(id) {
    await api.post("/cart", { itemId: id, qty: 1 });
    alert("Added to cart");
  }

  function toggle(id) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function selectAll() {
    setSelected(new Set((saved.items || []).map((it) => it._id)));
  }

  function clearSel() {
    setSelected(new Set());
  }

  async function addSelectedToCart() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    await Promise.all(ids.map((id) => api.post("/cart", { itemId: id, qty: 1 })));
    alert("Added selected to cart");
    clearSel();
  }

  async function removeSelected() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    await Promise.all(ids.map((id) => api.delete(`/saved/${id}`)));
    await refreshSaved();
  }

  const items = saved.items || [];
  const visible = items.filter((it) => (it.name || "").toLowerCase().includes(query.toLowerCase()));
  const sortedVisible = [...visible].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    const priceA = Number(a.price || 0);
    const priceB = Number(b.price || 0);
    switch (sortBy) {
      case "za":
        return nameB.localeCompare(nameA);
      case "priceAsc":
        return priceA - priceB;
      case "priceDesc":
        return priceB - priceA;
      case "az":
      default:
        return nameA.localeCompare(nameB);
    }
  });

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-3 items-center gap-4 mb-5">
          <div />
          <div className="justify-self-center w-full max-w-xl">
            <div className="border-2 border-orange-500 rounded-lg bg-white">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600 text-center py-2">Saved Items</h1>
            </div>
          </div>
          <div />
        </div>

        {items.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selected.size > 0 && selected.size === items.length}
                onChange={(e) => (e.target.checked ? selectAll() : clearSel())}
              />
              <span className="text-sm">Select all</span>
            </label>
            <button
              className="px-3 py-1.5 text-sm border rounded bg-[#ffad33] text-white hover:bg-[#ffa31a] border-[#ffad33] disabled:opacity-50"
              disabled={selected.size === 0}
              onClick={addSelectedToCart}
            >
              Add Selected to Cart
            </button>
            <button
              className="px-3 py-1.5 text-sm border rounded bg-white hover:bg-orange-50 border-[#ffad33] text-gray-800 disabled:opacity-50"
              disabled={selected.size === 0}
              onClick={removeSelected}
            >
              Remove Selected
            </button>
            {selected.size > 0 && (
              <button
                className="px-3 py-1.5 text-sm border rounded bg-white hover:bg-orange-50 border-[#ffad33] text-gray-800"
                onClick={clearSel}
              >
                Clear Selection ({selected.size})
              </button>
            )}
          </div>
        )}

        <div className="mb-4">
          <div className="border rounded-lg bg-white p-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved items..."
              className="flex-1 outline-none text-sm border rounded px-3 py-2 sm:border-0 sm:px-0 sm:py-0"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-white"
              >
                <option value="az">A–Z</option>
                <option value="za">Z–A</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              <div className="text-xs text-gray-500 whitespace-nowrap">{sortedVisible.length} results</div>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-md text-center border border-[#ffad33] rounded-lg p-6 bg-white">
            <img src={PLACEHOLDER} alt="Empty" className="w-full h-48 object-cover rounded mb-4" />
            <div className="font-medium">No saved items yet</div>
            <div className="text-sm text-gray-600">Browse items and tap the bookmark to save your favorites.</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedVisible.map((it) => (
              <div key={it._id} className="relative">
                <div className="absolute top-2 left-2 bg-white/90 rounded px-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selected.has(it._id)}
                    onChange={() => toggle(it._id)}
                  />
                </div>
                <FoodCard
                  name={it.name}
                  image={it.image}
                  price={it.price}
                  showActions
                  onAddToCart={() => addToCart(it._id)}
                  onRemove={() => remove(it._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}