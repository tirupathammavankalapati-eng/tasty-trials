import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export async function myOrders(req, res) {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate("items.itemId");
  res.json(orders);
}

export async function createFromCart(req, res) {
  // Create an order with status pending using current cart items
  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.itemId");
  if (!cart || (cart.items || []).length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  const items = cart.items.map((ci) => ({
    itemId: ci.itemId._id,
    qty: ci.qty,
    priceAtPurchase: ci.itemId.price ?? 0,
  }));
  const total = items.reduce((s, it) => s + it.priceAtPurchase * it.qty, 0);
  const status = process.env.AUTO_APPROVE_ORDERS === 'true' ? 'approved' : 'pending';
  const order = await Order.create({ userId: req.user._id, items, total, status });
  // Clear cart after order is created
  cart.items = [];
  await cart.save();
  const populated = await Order.findById(order._id).populate("items.itemId");
  res.status(201).json(populated);
}

// Simple admin guard helper (expects req.user.role to be 'admin')
function ensureAdmin(req, res) {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return false;
  }
  return true;
}

export async function adminList(req, res) {
  if (!ensureAdmin(req, res)) return;
  const orders = await Order.find().sort({ createdAt: -1 }).populate("items.itemId userId");
  res.json(orders);
}

export async function approve(req, res) {
  if (!ensureAdmin(req, res)) return;
  const { id } = req.params;
  const o = await Order.findByIdAndUpdate(id, { status: "approved" }, { new: true }).populate("items.itemId userId");
  if (!o) return res.status(404).json({ message: "Order not found" });
  res.json(o);
}

export async function reject(req, res) {
  if (!ensureAdmin(req, res)) return;
  const { id } = req.params;
  const o = await Order.findByIdAndUpdate(id, { status: "rejected" }, { new: true }).populate("items.itemId userId");
  if (!o) return res.status(404).json({ message: "Order not found" });
  res.json(o);
}
