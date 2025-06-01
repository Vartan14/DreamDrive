import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Deprecated/Login";
import LoginPage from "./pages/Auth/LoginPage";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Landing/Pricing";
import Branches from "./pages/Landing/Branches";
import About from "./pages/Landing/About";
import Reviews from "./pages/Landing/Reviews";
import FAQ from "./pages/Landing/FAQ";
import Contact from "./pages/Landing/Contact";

// Admin Dashboard Routes
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import LearningMaterials from "./pages/Instructor/LearningMaterials";
import Tests from "./pages/Tests/Tests";
import Payments from "./pages/Payments/Payments";
import Schedule from "./pages/Schedule/Schedule";

// New Instructor Pages
import InstructorGroups from "./pages/Instructor/InstructorGroups";
import InstructorStudentProgress from "./pages/Instructor/InstructorStudentProgress";
import InstructorSchedule from "./pages/Schedule/InstructorSchedule";

// New Admin Management Pages
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminGroupManagement from "./pages/Admin/AdminGroupManagement";
import AdminScheduleManagement from "./pages/Schedule/AdminScheduleManagement";
import AdminBranchManagement from "./pages/Admin/AdminBranchManagement";
import AdminPaymentOverview from "./pages/Admin/AdminPaymentOverview";
import AdminReviewManagement from "./pages/Admin/AdminReviewManagement";
import AdminTestManagement from "./pages/Admin/AdminTestManagement";

// New Content Management Pages
import Materials from "./pages/Materials/Materials";
import TestsManagement from "./pages/Tests/TestsManagement";

// Test Taking Pages
import TestTaking from "./pages/Tests/TestTaking";
import TestResults from "./pages/Tests/TestResults";
import TestCreation from "./pages/Tests/TestCreation";
import TestPerformance from "./pages/Tests/TestPerformance";
import TestHistory from "./pages/Tests/TestHistory";
import TestResultDetails from "./pages/Tests/TestResultDetails";

// Lessons Management
import Lessons from "./pages/Deprecated/Lessons";
import AuthProvider from "./providers/AuthProvider";
import PaymentForm from "./pages/Payments/PaymentForm";
import PaymentResult from "./pages/Payments/PaymentResult";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password/reset/confirm/:uidb64/:token/" element={<ResetPassword />} />
            
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/pay" element={<PaymentForm />} />
            <Route path="/payments/result" element={<PaymentResult />} />

            
            {/* Tests Routes */}
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/random" element={<TestTaking />} />
            <Route path="/tests/topic/:topicId" element={<TestTaking />} />
            <Route path="/tests/custom/:customId" element={<TestTaking />} />
            <Route path="/tests/results" element={<TestResults />} />
            <Route path="/tests/topic/:topicId/results" element={<TestResults />} />
            <Route path="/tests/custom/:customId/results" element={<TestResults />} />
            <Route path="/tests/results/:id" element={<TestResultDetails />} />
            <Route path="/tests/history" element={<TestHistory />} />

            <Route path="/materials" element={<Materials />} />
            <Route path="/schedule" element={<Schedule />} />

            {/* Instructor Routes */}
            <Route path="/instructor/groups" element={<InstructorGroups />} />
            <Route path="/instructor/students/:studentId" element={<InstructorStudentProgress />} />
            <Route path="/instructor/tests" element={<TestsManagement />} />
            <Route path="/instructor/tests/create" element={<TestCreation />} />
            <Route path="/instructor/tests/edit/:testId" element={<TestCreation />} />
            <Route path="/instructor/tests/performance/:testId" element={<TestPerformance />} />
            <Route path="/instructor/schedule" element={<InstructorSchedule />} />
            
            {/* Admin Management Routes */}
            {/* <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/groups" element={<AdminGroupManagement />} />
            <Route path="/admin/schedule" element={<AdminScheduleManagement />} />
            <Route path="/admin/branches" element={<AdminBranchManagement />} />
            <Route path="/admin/payments" element={<AdminPaymentOverview />} />
            <Route path="/admin/reviews" element={<AdminReviewManagement />} />
            <Route path="/admin/materials" element={<Materials />} />
            <Route path="/admin/tests" element={<AdminTestManagement />} /> */}
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
