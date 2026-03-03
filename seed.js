import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Category from "../models/Category.js";
import Item from "../models/Item.js";

const cats = [
  { name: "Veg", slug: "veg", icon: "🥗", bgImage: "" },
  { name: "Non-Veg", slug: "non-veg", icon: "🍗", bgImage: "" },
  { name: "Seafood", slug: "seafood", icon: "🦐", bgImage: "" },
  { name: "Chinese", slug: "chinese", icon: "🥡", bgImage: "" },
  { name: "Other", slug: "other", icon: "🍽️", bgImage: "" }
];

const itemsByCat = {
  "veg": [
    { name: "Paneer Tikka", price: 180, image: "", description: "Grilled paneer with spices" }
  ],
  "non-veg": [
    { name: "Chicken Biryani", price: 250, image: "", description: "Aromatic rice with chicken" }
  ],
  "seafood": [
    { name: "Prawn Curry", price: 320, image: "", description: "Spicy coastal curry" }
  ],
  "chinese": [
    { name: "Hakka Noodles", price: 160, image: "", description: "Stir-fried noodles" }
  ],
  "other": [
    { name: "Mixed Salad", price: 120, image: "", description: "Fresh and light" }
  ]
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Category.deleteMany({});
  await Item.deleteMany({});
  const inserted = await Category.insertMany(cats);
  for (const c of inserted) {
    const arr = itemsByCat[c.slug] || [];
    if (arr.length) {
      const docs = arr.map((it) => ({ ...it, categoryId: c._id }));
      await Item.insertMany(docs);
    }
  }
  console.log("Seeded");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
