import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header.jsx";

const PLACEHOLDER = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=60";

export default function ItemDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [item, setItem] = useState(null);
  const [payOpen, setPayOpen] = useState(false);
  const [pay, setPay] = useState({ nameOnCard:"", cardNumber:"", expiry:"", cvv:"" });

  useEffect(() => {
    (async () => {
      const me = await api.get("/auth/me");
      setUser(me.data.user);
      const it = await api.get(`/items/${id}`);
      setItem(it.data);
    })();
  }, [id]);

  async function save() {
    await api.post(`/saved/${id}`);
    alert("Saved updated");
  }

  async function addToCart() {
    await api.post("/cart", { itemId: id, qty: 1 });
    alert("Added to cart");
  }

  async function payNow(e) {
    e.preventDefault();
    await api.post("/payments/confirm", pay);
    alert("Payment successful");
    nav("/orders");
  }

  if (!item) return null;

  return (
    <div>
      <Header user={user} />
      <div className="max-w-3xl mx-auto p-4">
        <div className="rounded-xl overflow-hidden mb-4 bg-gray-100">
          <img src={item.image || PLACEHOLDER} alt={item.name} className="w-full h-64 object-cover" />
        </div>
        <div className="flex gap-2 mb-4">
          {[item.image || PLACEHOLDER, PLACEHOLDER, PLACEHOLDER].map((src, i) => (
            <div key={i} className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
              <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="text-2xl font-semibold mb-2">{item.name}</div>
        <div className="text-gray-600 mb-4">{item.description}</div>
        <div className="font-semibold mb-4">₹{item.price}</div>
        <div className="flex gap-3">
          <button className="px-3 py-2 border rounded" onClick={save}>Save</button>
          <button className="px-3 py-2 border rounded" onClick={addToCart}>Add to Cart</button>
          <button className="px-3 py-2 border rounded bg-black text-white" onClick={()=>setPayOpen(true)}>Payment</button>
        </div>

        {payOpen && (
          <div className="fixed inset-0 bg-black/40 grid place-items-center">
            <form onSubmit={payNow} className="bg-white p-6 rounded w-full max-w-md space-y-3">
              <div className="text-lg font-semibold mb-2">Payment Details</div>
              <input className="w-full border px-3 py-2 rounded" placeholder="Name on Card" value={pay.nameOnCard} onChange={e=>setPay({...pay,nameOnCard:e.target.value})} required />
              <input className="w-full border px-3 py-2 rounded" placeholder="Card Number" value={pay.cardNumber} onChange={e=>setPay({...pay,cardNumber:e.target.value})} required />
              <input className="w-full border px-3 py-2 rounded" placeholder="Expiry (MM/YY)" value={pay.expiry} onChange={e=>setPay({...pay,expiry:e.target.value})} required />
              <input className="w-full border px-3 py-2 rounded" placeholder="CVV" value={pay.cvv} onChange={e=>setPay({...pay,cvv:e.target.value})} required />
              <div className="flex justify-end gap-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={()=>setPayOpen(false)}>Cancel</button>
                <button className="px-3 py-2 border rounded bg-black text-white">Confirm Payment</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
