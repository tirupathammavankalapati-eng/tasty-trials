import Cart from "../models/Cart.js";
import Item from "../models/Item.js";
import Order from "../models/Order.js";

export async function confirmPayment(req, res) {
  const { nameOnCard, cardNumber, expiry, cvv } = req.body;
  if (!nameOnCard || !cardNumber || !expiry || !cvv) return res.status(400).json({ message: "Payment details required" });

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const itemsFull = await Promise.all(
    cart.items.map(async (ci) => {
      const it = await Item.findById(ci.itemId);
      return { itemId: ci.itemId, qty: ci.qty, priceAtPurchase: it.price };
    })
  );
  const total = itemsFull.reduce((s, x) => s + x.qty * x.priceAtPurchase, 0);
  const order = await Order.create({
    userId: req.user._id,
    items: itemsFull,
    total,
    status: "paid",
    paymentRef: "MOCK-" + Date.now()
  });
  cart.items = [];
  await cart.save();
  res.json({ success: true, message: "Payment successful", orderId: order._id });
}
