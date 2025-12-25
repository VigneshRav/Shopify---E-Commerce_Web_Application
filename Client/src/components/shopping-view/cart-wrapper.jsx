import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const isCartEmpty = !cartItems || cartItems.length === 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col">
      <SheetHeader>
        <SheetTitle className="font-bold">Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-5 space-y-4 flex-1 overflow-y-auto">
        {isCartEmpty ? (
          <img
            className="mt-30"
            src="https://vitanami.com/public//assets/img/adt/empty-cart.png"
            alt=" Your cart is empty ☹"
          />
        ) : (
          cartItems.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))
        )}
      </div>

      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
        disabled={isCartEmpty}
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
