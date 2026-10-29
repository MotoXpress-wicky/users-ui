import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { UserProfilePage } from "@/features/user/page/UserProfilePage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPassword";
import { PartsPage } from "@/features/catalog/pages/PartsPage";
import { PartDetailPage } from "@/features/catalog/pages/PartDetailPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/checkout/pages/CheckoutPage";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { OrderDetailPage } from "@/features/orders/pages/OrderDetailPage";
import { RootLayout } from "./RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public pages: anyone can look for parts (BR1). A login is needed only to order.
      { path: "/", element: <HomePage /> },
      { path: "/parts", element: <PartsPage /> },
      { path: "/parts/:id", element: <PartDetailPage /> },
      { path: "/cart", element: <CartPage /> },

      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <UserProfilePage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:orderNo", element: <OrderDetailPage /> },
        ],
      },

      { path: "*", element: <p>Page not found</p> },
    ],
  },
]);
