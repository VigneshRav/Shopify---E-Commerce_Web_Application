import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "../../store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "../../store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
      dispatch(fetchCartItems(user?.id));
    }
  }, [productDetails, user?.id, dispatch]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  const [isAdded, setIsAdded] = useState(false);
  function handleAddToCart(productId, totalStock) {
    const existingCartItem = cartItems.items?.find(
      (item) => item.productId === productId
    );

    const currentQty = existingCartItem?.quantity || 0;
    const availableQty = totalStock - currentQty;

    if (availableQty <= 0) {
      toast({
        title: "Out of stock",
        variant: "destructive",
      });
      return;
    }

    // ✅ IF ITEM EXISTS → UPDATE QUANTITY
    if (existingCartItem) {
      dispatch(
        updateCartQuantity({
          productId,
          quantity: currentQty + 1,
        })
      ).then(() => {
        dispatch(fetchCartItems(user?.id));
        setIsAdded(true);
      });

      return;
    }

    // ✅ ELSE → ADD NEW ITEM
    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
        });
        setIsAdded(true);
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    const payload = {
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    };

    dispatch(addReview(payload)).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      } else {
        toast({
          title: data?.payload?.message || "Failed to submit review",
          variant: "destructive",
        });
      }
    });
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const existingCartItem = cartItems.items?.find(
    (item) => item.productId === productDetails?._id
  );
  const alreadyAddedQty = existingCartItem?.quantity || 0;

  const availableQty = Math.max(
    (productDetails?.totalStock || 0) - alreadyAddedQty,
    0
  );

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:p-6 md:p-8 lg:p-10 xl:p-12 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] overflow-y-auto max-h-[95vh] scrollbar-hide">
        <div className="relative overflow-hidden rounded-lg w-full">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="aspect-square w-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-xl sm:text-2xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-xl sm:text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground text-sm">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          <div className="mt-5 mb-5">
            <Button
              className={`w-full ${
                availableQty <= 0
                  ? "bg-red-600 text-white cursor-not-allowed opacity-60"
                  : alreadyAddedQty > 0
                  ? "bg-gray-600 text-white cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
              onClick={() =>
                handleAddToCart(productDetails?._id, productDetails?.totalStock)
              }
              disabled={availableQty <= 0 || alreadyAddedQty > 0}
            >
              {availableQty <= 0
                ? "Out of Stock"
                : alreadyAddedQty > 0
                ? "Added to Cart"
                : "Add to Cart"}
            </Button>
          </div>

          <h3
            className={`text-sm sm:text-base font-bold ${
              availableQty <= 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            Qty: {productDetails?.totalStock} &nbsp;|&nbsp; In Cart:{" "}
            {alreadyAddedQty} &nbsp;|&nbsp; Available: {availableQty}
          </h3>

          <br />
          <Separator className="my-4" />

          <div className="max-h-[300px] overflow-auto scrollbar-hide">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div key={reviewItem._id} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
