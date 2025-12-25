import React, { useEffect, useState } from "react";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist } from "@/lib/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import ProductDetailsDialog from "../../components/shopping-view/product-details";

function Wishlist() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlist = await fetchWishlist();
        setWishlistItems(wishlist);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
        toast.error("Failed to load wishlist.");
      }
    };

    loadWishlist();
  }, []);

  const handleGetProductDetails = (product) => {
    if (product) {
      setSelectedProduct(product);
      setOpenDialog(true);
    } else {
      toast.error("Product not found");
    }
  };

  const handleAddtoCart = async (product) => {
    if (!user || !user.id) {
      toast.error("User not loaded. Please refresh or log in again.");
      return;
    }

    try {
      await dispatch(
        addToCart({
          userId: user.id,
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();

      await dispatch(fetchCartItems(user.id));
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Add to cart failed from Wishlist:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  if (!user) {
    return (
      <p className="text-muted-foreground">
        Please log in to view your wishlist.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>

      {wishlistItems?.length === 0 ? (
        <p className="text-muted-foreground">No items in your wishlist yet.</p>
      ) : (
        <div className="grid gap-4 sm:gap-4 grid-cols-1 md:gap-4 lg:gap-3 xl:gap-3 md:grid-cols-3 xl:grid-cols-5">
          {wishlistItems.map((product) => (
            <ShoppingProductTile
              key={product._id}
              product={product}
              handleGetProductDetails={() => handleGetProductDetails(product)}
              handleAddtoCart={() => handleAddtoCart(product)}
              onRemoveFromWishlist={() => handleRemoveFromWishlist(product._id)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsDialog
          open={openDialog}
          setOpen={setOpenDialog}
          productDetails={selectedProduct}
        />
      )}
    </div>
  );
}

export default Wishlist;