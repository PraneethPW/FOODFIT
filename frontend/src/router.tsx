import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { DietPlanPage } from "./pages/DietPlanPage";
import { WorkoutPlanPage } from "./pages/WorkoutPlanPage";
import { FoodRecommendationsPage } from "./pages/FoodRecommendationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AssistantPage } from "./pages/AssistantPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ChecklistDashboardPage } from "./pages/ChecklistDashboardPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "/dashboard", element: <DashboardPage /> },
              { path: "/profile", element: <ProfilePage /> },
              { path: "/diet-plan", element: <DietPlanPage /> },
              { path: "/workout-plan", element: <WorkoutPlanPage /> },
              { path: "/food-recommendations", element: <FoodRecommendationsPage /> },
              { path: "/analytics", element: <AnalyticsPage /> },
              { path: "/checklist", element: <ChecklistDashboardPage /> },
              { path: "/assistant", element: <AssistantPage /> },
              { path: "/settings", element: <SettingsPage /> }
            ]
          }
        ]
      }
    ]
  }
]);


