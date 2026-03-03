import Saved from "../models/Saved.js";

export async function getSaved(req, res) {
  let saved = await Saved.findOne({ userId: req.user._id }).populate("items");
  if (!saved) saved = await Saved.create({ userId: req.user._id, items: [] });
  res.json(saved);
}

export async function toggleSave(req, res) {
  const { itemId } = req.params;
  let saved = await Saved.findOne({ userId: req.user._id });
  if (!saved) saved = await Saved.create({ userId: req.user._id, items: [] });
  const exists = saved.items.find((id) => String(id) === String(itemId));
  if (exists) {
    saved.items = saved.items.filter((id) => String(id) !== String(itemId));
  } else {
    saved.items.push(itemId);
  }
  await saved.save();
  const populated = await Saved.findById(saved._id).populate("items");
  res.json(populated);
}

export async function removeSaved(req, res) {
  const { itemId } = req.params;
  const saved = await Saved.findOne({ userId: req.user._id });
  if (!saved) return res.json({ items: [] });
  saved.items = saved.items.filter((id) => String(id) !== String(itemId));
  await saved.save();
  const populated = await Saved.findById(saved._id).populate("items");
  res.json(populated);
}
