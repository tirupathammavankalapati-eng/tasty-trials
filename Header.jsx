import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header.jsx";
import CartDrawer from "../components/CartDrawer.jsx";
import VideoHero from "../components/VideoHero.jsx";
import { Link } from "react-router-dom";

const CAT_IMG = {
  "veg": "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop&cb=veg-cover",
  "non-veg": "https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop&cb=nonveg-cover",
  "seafood": "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop&cb=seafood-cover",
  "chinese": "https://images.pexels.com/photos/7393877/pexels-photo-7393877.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop&cb=chinese-cover",
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60";
const onErr = (e) => { e.currentTarget.src = PLACEHOLDER; e.currentTarget.onerror = null; };

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/auth/me");
        if (!me.data || !me.data.user) {
          // user is not authenticated → go to login
          navigate("/login", { replace: true });
          return;
        }
        setUser(me.data.user);

        const c = await api.get("/items/categories");
        setCats(c.data);

        const crt = await api.get("/cart");
        setCart(crt.data);

      } catch (err) {
        console.error("Home page load error:", err);
        setError("Failed to load user/home data");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;

  const total = (cart.items || []).reduce((s, i) => s + (i.itemId?.price || 0) * (i.qty || 0), 0);

  return (
    <div>
      <Header user={user} />
      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <VideoHero />

        {/* Categories & Cart Button */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-semibold">Explore by Category</div>
            <button
              className="px-3 py-1 border rounded bg-[#ffad33] text-white hover:bg-[#ffa31a] border-[#ffad33]"
              onClick={() => setOpenCart(true)}
            >
              View Cart ({(cart.items || []).length})
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cats.map((c) => {
              const img = CAT_IMG[c.slug] || PLACEHOLDER;
              return (
                <Link
                  to={`/items?category=${c.slug}`}
                  key={c._id}
                  className="border rounded overflow-hidden hover:shadow bg-white"
                >
                  <div className="h-24 sm:h-28 overflow-hidden">
                    <img src={img} onError={onErr} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-center font-medium">{c.name}</div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* About / Story Section */}
        <section className="mt-16">
          <div className="text-2xl font-semibold mb-4">Our Story</div>
          <p className="text-gray-700">
            Welcome, {user.name || user.email}! At [Your Restaurant Name] we believe in fresh ingredients, bold flavours and unforgettable meals.
          </p>
        </section>
      </div>

      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        items={cart.items || []}
        total={total}
      />
    </div>
  );
}
