import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "./pages/SplashScreen";
import WelcomeScreen from "./pages/WelcomeScreen";
import GenderSelection from "./pages/GenderSelection";
import GoalSelection from "./pages/GoalSelection";
import PhysicalStats from "./pages/PhysicalStats";
import DifficultySelection from "./pages/DifficultySelection";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import CravingControl from "./pages/CravingControl";
import CravingActive from "./pages/CravingActive";
import CravingDefeated2 from "./pages/CravingDefeated2";
import NotificationSamples from "./pages/NotificationSamples";
import PremiumUpgrade from "./pages/PremiumUpgrade";
import SettingsScreen from "./pages/SettingsScreen";
import ExerciseTracker from "./pages/Exercise-tracker";
import CalorieDetailBreakdown from "./pages/calorie_detail_breakdown";
import AiFoodScanner from "./pages/Ai-Food-Scanner";
import AuthOptions from "./pages/AuthOptions";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import AdminControl from "./pages/AdminControl";
import FoodHistory from "./pages/FoodHistory";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/auth" element={<AuthOptions />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminControl />} />
          <Route path="/onboarding/gender" element={<GenderSelection />} />
          <Route path="/onboarding/stats" element={<PhysicalStats />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route
            path="/onboarding/difficulty"
            element={<DifficultySelection />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/food-analysis" element={<AiFoodScanner />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/craving-control" element={<CravingControl />} />
          <Route path="/craving-active" element={<CravingActive />} />
          <Route path="/craving-defeat" element={<CravingDefeated2 />} />
          <Route path="/notifications" element={<NotificationSamples />} />
          <Route path="/premium-upgrade" element={<PremiumUpgrade />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/exercise-tracker" element={<ExerciseTracker />} />
          <Route path="/calorie-detail-breakdown" element={<CalorieDetailBreakdown />} />
          <Route path="/ai-food-scanner" element={<AiFoodScanner />} />
          <Route path="/food-history" element={<FoodHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
