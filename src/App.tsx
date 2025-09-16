import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthRoute } from "@/components/AuthRoute";

// Client Pages
import ClientHome from "./pages/ClientHome";
import ClientSearch from "./pages/ClientSearch";
import ClientMatching from "./pages/ClientMatching";
import ClientMatches from "./pages/ClientMatches";
import ClientAddReview from "./pages/ClientAddReview";
import ClientProfile from "./pages/ClientProfile";

// Restaurant Pages
import RestaurantHome from "./pages/RestaurantHome";
import RestaurantProfile from "./pages/RestaurantProfile";
import RestaurantMenu from "./pages/RestaurantMenu";
import RestaurantReviews from "./pages/RestaurantReviews";
import RestaurantSettings from "./pages/RestaurantSettings";

// Shared Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RestaurantDetails from "./pages/RestaurantDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
          
          {/* Root Route - Handled by ProtectedRoute for smart redirection */}
          <Route path="/" element={<ProtectedRoute><ClientHome /></ProtectedRoute>} />
          
          {/* Client Routes */}
          <Route path="/client/home" element={<ProtectedRoute><ClientHome /></ProtectedRoute>} />
          <Route path="/client/search" element={<ProtectedRoute><ClientSearch /></ProtectedRoute>} />
          <Route path="/client/matching" element={<ProtectedRoute><ClientMatching /></ProtectedRoute>} />
          <Route path="/client/matches" element={<ProtectedRoute><ClientMatches /></ProtectedRoute>} />
          <Route path="/client/add-review" element={<ProtectedRoute><ClientAddReview /></ProtectedRoute>} />
          <Route path="/client/profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
          
          {/* Restaurant Routes */}
          <Route path="/restaurant/home" element={<ProtectedRoute><RestaurantHome /></ProtectedRoute>} />
          <Route path="/restaurant/profile" element={<ProtectedRoute><RestaurantProfile /></ProtectedRoute>} />
          <Route path="/restaurant/menu" element={<ProtectedRoute><RestaurantMenu /></ProtectedRoute>} />
          <Route path="/restaurant/reviews" element={<ProtectedRoute><RestaurantReviews /></ProtectedRoute>} />
          <Route path="/restaurant/settings" element={<ProtectedRoute><RestaurantSettings /></ProtectedRoute>} />
          
          {/* Legacy/Backward Compatibility Routes */}
          <Route path="/search" element={<ProtectedRoute><ClientSearch /></ProtectedRoute>} />
          <Route path="/matching" element={<ProtectedRoute><ClientMatching /></ProtectedRoute>} />
          <Route path="/my-matches" element={<ProtectedRoute><ClientMatches /></ProtectedRoute>} />
          <Route path="/add-review" element={<ProtectedRoute><ClientAddReview /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
          
          {/* Shared Routes */}
          <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantDetails /></ProtectedRoute>} />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;