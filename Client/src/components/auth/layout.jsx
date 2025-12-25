import { Outlet, useLocation } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Package, Tag } from "lucide-react";

function FloatingIcon({ Icon, className }) {
  return <Icon className={`absolute text-white/30 ${className}`} size={42} />;
}

function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes("register");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-100">
      <div
        className={`absolute inset-0 grid grid-cols-1 lg:grid-cols-2 transition-all duration-700 ${
          isRegister ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* BANNER SIDE */}
        <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-purple-600" />

          {/* Floating icons */}
          <FloatingIcon
            Icon={ShoppingBag}
            className="top-20 left-20 rotate-12"
          />
          <FloatingIcon
            Icon={ShoppingCart}
            className="bottom-12 left-32 -rotate-12"
          />
          <FloatingIcon Icon={Package} className="top-40 right-24 rotate-6" />
          <FloatingIcon Icon={Tag} className="bottom-24 right-40 -rotate-6" />

          {/* Content */}
          <div className="relative z-10 max-w-xl px-12 text-white text-center">
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Welcome to <br />
              <span className="text-white/90">Shopify</span>
            </h1>

            <p className="text-lg opacity-90 mb-8">
              Start selling/buying smarter. Build your brand, manage products
              and grow your business as a seller & choose your products, place an
              order and make a payment as a buyer. <span className="font-bold mt-2">All from one powerful
              ecommerce platform</span>.
            </p>

            <div className="flex justify-center gap-6 text-sm opacity-90">
              <span>🛍 Sell/Buy Anytime</span>
              <span>🚀 Scale Faster</span>
              <span>📦 Easy Payment</span>
            </div>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
