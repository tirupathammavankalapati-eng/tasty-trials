import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import Saved from "./pages/Saved.jsx";
import Orders from "./pages/Orders.jsx";
import Veg from "./pages/veg.jsx";
import NonVeg from "./pages/Nonveg.jsx";
import Seafood from "./pages/Seafood.jsx";
import Chinese from "./pages/Chinese.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/home/category/:slug" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/items/:id" element={<RequireAuth><ItemDetail /></RequireAuth>} />
      <Route path="/saved" element={<RequireAuth><Saved /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />

      {/* Category pages (protected) */}
      <Route path="/veg" element={<RequireAuth><Veg /></RequireAuth>} />
      <Route path="/non-veg" element={<RequireAuth><NonVeg /></RequireAuth>} />
      <Route path="/seafood" element={<RequireAuth><Seafood /></RequireAuth>} />
      <Route path="/chinese" element={<RequireAuth><Chinese /></RequireAuth>} />
    </Routes>
  );
}