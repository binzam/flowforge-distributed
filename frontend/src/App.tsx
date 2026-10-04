import { AuthProvider } from "./features/auth/providers/AuthProvider";
import { NotificationSocketWrapper } from "./features/notifications/components/NotificationSocketWrapper";
import AppRoutes from "./routes/AppRoutes";
import { OnboardingProvider } from "./tour/OnboardingProvider";

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <NotificationSocketWrapper>
          <AppRoutes />
        </NotificationSocketWrapper>
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;
