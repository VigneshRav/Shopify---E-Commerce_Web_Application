// --- Tailwind Utility ---
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Wishlist Utilities ---

import axiosInstance from "../config/index";
export const fetchWishlist = async () => {
  const res = await axiosInstance.get("/wishlist");
  return res.data;
};

export const addToWishlist = async (productId) => {
  const res = await axiosInstance.post("/wishlist", { _id: productId });
  return res.data.wishlist;
};

export const removeFromWishlist = async (productId) => {
  await axiosInstance.delete(`/wishlist/${productId}`);
};
