import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/lib/utils";
import { toast } from "react-toastify";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  onRemoveFromWishlist,
}) {
  /* ---------------- CART STATE ---------------- */
  const cartItems = useSelector((state) => state.shopCart.cartItems || {});
  const existingCartItem = cartItems.items?.find(
    (item) => item.productId === product?._id
  );

  const isInCart = Boolean(existingCartItem);

  const alreadyAddedQty = existingCartItem?.quantity || 0;
  const availableQty = Math.max(
    (product?.totalStock || 0) - alreadyAddedQty,
    0
  );

  /* ---------------- WISHLIST STATE ---------------- */
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlist = await fetchWishlist();
        setWishlistIds(wishlist.map((item) => item._id));
      } catch (err) {
        console.error("Error loading wishlist", err);
      }
    };

    loadWishlist();
  }, []);

  const isWishlisted = wishlistIds.includes(product._id);

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        setWishlistIds((prev) => prev.filter((id) => id !== product._id));
        toast.warn("Removed from wishlist");

        if (onRemoveFromWishlist) {
          onRemoveFromWishlist(product._id);
        }
      } else {
        const updated = await addToWishlist(product._id);
        setWishlistIds(updated.map((id) => id._id || id));
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong while updating wishlist");
      console.error("Wishlist error:", error);
    }
  };

  return (
    <Card className="w-full max-w-xs mx-auto relative">
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart
          className={`w-5 h-5 ${
            isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
          }`}
        />
      </button>

      {/* Product Image */}
      <div
        className="w-full h-[200px] bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => handleGetProductDetails(product._id)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full object-contain p-2"
        />
      </div>

      {/* Product Info */}
      <CardContent
        className="px-3 pt-2 pb-1 cursor-pointer"
        onClick={() => handleGetProductDetails(product._id)}
      >
        <div className="font-semibold text-base truncate">{product.title}</div>

        <div className="my-1">
          {product.totalStock === 0 ? (
            <Badge variant="destructive">Out Of Stock</Badge>
          ) : product.totalStock < 10 ? (
            <Badge variant="warning">Only {product.totalStock} left</Badge>
          ) : (
            <Badge variant="secondary">Sale</Badge>
          )}
        </div>

        <p className="text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="text-xs text-muted-foreground mt-1">
          {categoryOptionsMap[product.category]} •{" "}
          {brandOptionsMap[product.brand]}
        </div>

        <div className="flex gap-2 items-center mt-1">
          <span
            className={`${
              product.salePrice > 0
                ? "line-through text-muted-foreground"
                : "text-primary"
            } text-sm font-semibold`}
          >
            ${product.price}
          </span>

          {product.salePrice > 0 && (
            <span className="text-green-600 font-semibold text-sm">
              ${product.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Add to Cart Button */}
      <CardFooter className="p-3 pt-1">
        {product.totalStock === 0 ? (
          <Button
            disabled
            className="w-full text-sm opacity-60 cursor-not-allowed"
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            className={`w-full text-sm ${
              isInCart ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={isInCart}
            onClick={() => handleAddtoCart(product)}
          >
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
