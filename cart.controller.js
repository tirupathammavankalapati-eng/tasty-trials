import Cart from "../models/Cart.js";

export async function getCart(req, res) {
  let cart = await Cart.findOne({ userId: req.user._id }).populate("items.itemId");
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  res.json(cart);
}

export async function addToCart(req, res) {
  const { itemId, qty } = req.body;
  if (!itemId) return res.status(400).json({ message: "itemId required" });
  const q = Math.max(1, Number(qty || 1));
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  const idx = cart.items.findIndex((i) => String(i.itemId) === String(itemId));
  if (idx >= 0) cart.items[idx].qty += q;
  else cart.items.push({ itemId, qty: q });
  await cart.save();
  const populated = await Cart.findById(cart._id).populate("items.itemId");
  res.json(populated);
}

export async function removeFromCart(req, res) {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ items: [] });
  cart.items = cart.items.filter((i) => String(i.itemId) !== String(itemId));
  await cart.save();
  const populated = await Cart.findById(cart._id).populate("items.itemId");
  res.json(populated);
}
