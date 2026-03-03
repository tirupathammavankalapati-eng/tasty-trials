import React from "react";

export default function CartDrawer({ open, onClose, items = [], total = 0, onRemove, onPlaceOrder }) {
  const hasItems = (items?.length ?? 0) > 0;
  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="font-semibold">Cart</div>
        <button className="px-2 py-1 text-sm border rounded bg-white hover:bg-orange-50 border-[#ffad33] text-gray-800" onClick={onClose}>Close</button>
      </div>
      <div className="p-4 text-sm flex flex-col h-[calc(100%-56px)]">
        <div className="mb-3">Welcome to Food App. Browse categories and add items to cart.</div>
        <div className="space-y-2 flex-1 overflow-auto">
          {items.map((i) => (
            <div key={i.itemId?._id || i._id} className="flex items-center justify-between gap-2">
              <div className="truncate flex-1">{i.itemId?.name || i.name}</div>
              <div className="text-gray-600">x{i.qty}</div>
              {onRemove && (
                <button
                  className="px-2 py-1 text-xs border rounded bg-white hover:bg-orange-50 border-[#ffad33] text-gray-800"
                  onClick={() => onRemove(i.itemId?._id || i._id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-semibold">Total: ₹{total}</div>
          {onPlaceOrder && (
            <button
              className={`px-3 py-2 text-sm rounded ${hasItems ? "bg-[#ffad33] text-white hover:bg-[#ffa31a] border border-[#ffad33]" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              disabled={!hasItems}
              onClick={onPlaceOrder}
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
