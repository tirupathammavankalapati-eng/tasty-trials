import Category from "../models/Category.js";
import Item from "../models/Item.js";


export async function listCategories(req, res) {
  const cats = await Category.find({}).sort("name");
  res.json(cats);
}

export async function listItems(req, res) {
  const { category } = req.query;
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (!cat) return res.json([]);
    const items = await Item.find({ categoryId: cat._id });
    return res.json(items);
  }
  const items = await Item.find({});
  res.json(items);
}

export async function getItem(req, res) {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
}

// Create or fetch an item by name in a category
// Deterministic image map by dish name
const IMAGE_MAP = {
  // Veg
  "Fresh Salad Bowl": "https://source.unsplash.com/800x600/?fresh%20salad,bowl&sig=1",
  "Stir-fry Greens": "https://source.unsplash.com/800x600/?stir%20fry,greens,vegetables&sig=2",
  "Pasta Primavera": "https://source.unsplash.com/800x600/?pasta,primavera,vegetarian&sig=3",
  "Margherita Pizza": "https://source.unsplash.com/800x600/?margherita,pizza&sig=4",
  "Tomato Basil Soup": "https://source.unsplash.com/800x600/?tomato,basil,soup&sig=5",
  "Avocado Toast": "https://source.unsplash.com/800x600/?avocado,toast&sig=6",
  "Roasted Vegetables": "https://source.unsplash.com/800x600/?roasted,vegetables&sig=7",
  "Veg Hakka Noodles": "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200&auto=format&fit=crop&q=60",
  "Paneer Tikka": "https://source.unsplash.com/800x600/?paneer,tikka,skewers&sig=9",
  "Veg Pulao": "https://source.unsplash.com/800x600/?pulao,vegetable,rice&sig=10",
  "Buddha Bowl": "https://source.unsplash.com/800x600/?buddha,bowl,vegetarian&sig=11",
  "Aloo Gobi": "https://source.unsplash.com/800x600/?aloo,gobi,cauliflower,potato,curry&sig=12",
  "Chana Masala": "https://source.unsplash.com/800x600/?chana,masala,chickpea,curry&sig=13",
  "Palak Paneer": "https://source.unsplash.com/800x600/?palak,paneer,spinach,curry&sig=14",
  "Veg Biryani": "https://source.unsplash.com/800x600/?vegetable,biryani,rice&sig=15",
  "Veg Manchurian": "https://images.unsplash.com/photo-1589308078051-c7a3c1fbd9f5?w=1200&auto=format&fit=crop&q=60",
  "Masala Dosa": "https://source.unsplash.com/800x600/?masala,dosa,south%20indian&sig=17",
  "Idli Sambar": "https://source.unsplash.com/800x600/?idli,sambar,south%20indian&sig=18",
  // Non-Veg
  "Chicken Tikka": "https://source.unsplash.com/800x600/?chicken,tikka,tandoori&sig=101",
  "Mutton Biryani": "https://source.unsplash.com/800x600/?mutton,biryani,rice&sig=102",
  "Grilled Chicken": "https://source.unsplash.com/800x600/?grilled,chicken&sig=103",
  "Chicken Curry": "https://source.unsplash.com/800x600/?chicken,curry,indian&sig=104",
  "Chicken Wings": "https://source.unsplash.com/800x600/?chicken,wings&sig=105",
  "Lamb Chops": "https://source.unsplash.com/800x600/?lamb,chops,grilled&sig=106",
  "Butter Chicken": "https://source.unsplash.com/800x600/?butter,chicken,indian&sig=107",
  "Tandoori Chicken": "https://source.unsplash.com/800x600/?tandoori,chicken&sig=108",
  "Chicken Kebab": "https://source.unsplash.com/800x600/?chicken,kebab,skewers&sig=109",
  "Beef Steak": "https://source.unsplash.com/800x600/?beef,steak&sig=110",
  "Mutton Curry": "https://source.unsplash.com/800x600/?mutton,curry&sig=111",
  "Chicken Biryani": "https://source.unsplash.com/800x600/?chicken,biryani,rice&sig=112",
  // Seafood
  "Grilled Salmon": "https://source.unsplash.com/800x600/?grilled,salmon,seafood&sig=201",
  "Prawn Platter": "https://source.unsplash.com/800x600/?prawn,shrimp,platter&sig=202",
  "Fish Curry": "https://source.unsplash.com/800x600/?fish,curry,indian&sig=203",
  "Calamari Rings": "https://source.unsplash.com/800x600/?calamari,rings,fried&sig=204",
  "Garlic Butter Shrimp": "https://source.unsplash.com/800x600/?garlic,butter,shrimp&sig=205",
  "Seafood Paella": "https://source.unsplash.com/800x600/?seafood,paella&sig=206",
  "Lobster Tail": "https://source.unsplash.com/800x600/?lobster,tail&sig=207",
  "Crab Masala": "https://source.unsplash.com/800x600/?crab,masala,curry&sig=208",
  "Fish Fry": "https://source.unsplash.com/800x600/?fish,fry,seafood&sig=209",
  "Shrimp Tacos": "https://source.unsplash.com/800x600/?shrimp,tacos&sig=210",
  // Chinese (deterministic photo IDs)
  "Hakka Noodles": "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200&auto=format&fit=crop&q=60",
  "Spring Rolls": "https://images.unsplash.com/photo-1544025162-3f4d0b7f1e3a?w=1200&auto=format&fit=crop&q=60",
  "Chilli Paneer": "https://images.unsplash.com/photo-1604908177077-091c88e3a67e?w=1200&auto=format&fit=crop&q=60",
  "Fried Rice": "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&auto=format&fit=crop&q=60",
  "Schezwan Noodles": "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200&auto=format&fit=crop&q=60",
  "Kung Pao Veg": "https://images.unsplash.com/photo-1604908176973-9b9d40805b3e?w=1200&auto=format&fit=crop&q=60",
  "Dumplings": "https://images.unsplash.com/photo-1604908812140-809ad1e5f8fd?w=1200&auto=format&fit=crop&q=60",
  "Hot and Sour Soup": "https://images.unsplash.com/photo-1505575972945-2801179cc74e?w=1200&auto=format&fit=crop&q=60",
  "Schezwan Fried Rice": "https://images.unsplash.com/photo-1540316264016-6296d9f0f2f4?w=1200&auto=format&fit=crop&q=60",
  "Veg Chow Mein": "https://images.unsplash.com/photo-1617195737448-4d0d1c3d8d1a?w=1200&auto=format&fit=crop&q=60",
  "Tofu Stir Fry": "https://images.unsplash.com/photo-1604908177093-9a1f50bbdc2d?w=1200&auto=format&fit=crop&q=60"
};

export async function refreshImages(req, res) {
  try {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const { category } = req.query; // optional slug

    let filter = {};
    if (category && category !== 'all') {
      // try to filter by category slug if Category model exists
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.categoryId = cat._id;
    }

    const items = await Item.find(filter);
    let updated = 0;
    for (const it of items) {
      const url = IMAGE_MAP[it.name];
      if (url && it.image !== url) {
        it.image = url;
        await it.save();
        updated++;
      }
    }
    res.json({ updated, total: items.length });
  } catch (e) {
    console.error('refreshImages error', e);
    res.status(500).json({ message: 'Failed to refresh images' });
  }
}

export async function createItem(req, res) {
  try {
    const { name, price, image, categorySlug } = req.body;
    if (!name || price == null || !categorySlug) {
      return res.status(400).json({ message: "name, price and categorySlug are required" });
    }
    const cat = await Category.findOne({ slug: categorySlug });
    if (!cat) return res.status(400).json({ message: "Invalid categorySlug" });

    // Try to find existing by case-insensitive name within the category
    const existing = await Item.findOne({
      categoryId: cat._id,
      name: { $regex: `^${name}$`, $options: "i" }
    });
    if (existing) return res.json(existing);

    const item = await Item.create({ name, price, image, categoryId: cat._id });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: "Failed to create item" });
  }
}
