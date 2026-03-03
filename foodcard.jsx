import React, { useEffect, useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60";

function slugifyName(str = "") {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function localCandidates(name = "") {
  const slug = slugifyName(name);
  const bases = [
    "/images/veg/",
    "/images/non-veg/",
    "/images/seafood/",
    "/images/chinese/",
    "/images/dishes/",
    "/images/",
  ];
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  const list = [];
  for (const b of bases) for (const e of exts) list.push(`${b}${slug}${e}`);
  return list;
}

function MultiSrcImage({ sources = [], alt = "", fallback, className = "", ...rest }) {
  const [idx, setIdx] = useState(0);
  const src = sources[idx] || fallback;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => {
        if (idx + 1 < sources.length) setIdx(idx + 1);
        else if (fallback && src !== fallback) setIdx(sources.length);
      }}
      className={className}
      referrerPolicy="no-referrer"
      {...rest}
    />
  );
}

export default function FoodCard({
  name,
  image,
  price,
  onAddToCart,
  onRemove,
  onSave,
  saved,
  defaultSaved = false,
  showActions = false,
}) {
  const isControlled = typeof saved === "boolean";
  const [localSaved, setLocalSaved] = useState(isControlled ? saved : defaultSaved);

  useEffect(() => {
    if (isControlled) setLocalSaved(saved);
  }, [isControlled, saved]);

  const handleSaveClick = () => {
    if (!isControlled) setLocalSaved((s) => !s);
    if (onSave) onSave();
  };

  const sources = [...localCandidates(name)];
  if (image) sources.push(image);

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden relative">
      <div className="h-44 rounded-t-xl overflow-hidden relative">
        <MultiSrcImage
          sources={sources}
          alt={name}
          className="w-full h-full object-cover"
          fallback={FALLBACK}
        />
        {onSave && (
          <button
            type="button"
            aria-label="Save"
            className={`absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 ${localSaved ? "text-red-500" : "text-gray-400"} hover:bg-white shadow flex items-center justify-center`}
            onClick={handleSaveClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.017C4.688 15.36 3 13.027 3 10.5 3 8.015 4.97 6 7.375 6c1.417 0 2.727.657 3.625 1.68C11.898 6.657 13.208 6 14.625 6 17.03 6 19 8.015 19 10.5c0 2.527-1.688 4.86-3.989 7.16a25.18 25.18 0 01-4.244 3.017 15.247 15.247 0 01-.383.218l-.022.012-.007.003-.003.002a.75.75 0 01-.694 0l-.003-.002z" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-3">
        <div className="font-semibold text-gray-900">{name}</div>
        {price != null && (
          <div className="text-sm text-gray-600">₹{price}</div>
        )}
        {showActions && (
          <div className="mt-3 flex gap-2">
            {onAddToCart && (
              <button className="px-3 py-1.5 border rounded bg-[#ffad33] text-white hover:bg-[#ffa31a] border-[#ffad33]" onClick={onAddToCart}>
                Add to Cart
              </button>
            )}
            {onRemove && (
              <button className="px-3 py-1.5 border rounded bg-white hover:bg-orange-50 border-[#ffad33] text-gray-800" onClick={onRemove}>
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
