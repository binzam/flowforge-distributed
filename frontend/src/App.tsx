import { AuthProvider } from "./features/auth/providers/AuthProvider";
import { NotificationSocketWrapper } from "./features/notifications/components/NotificationSocketWrapper";
import AppRoutes from "./routes/AppRoutes";
import { TourProvider } from "./tour";

function App() {
  return (
    <AuthProvider>
      <TourProvider>
        <NotificationSocketWrapper>
          <AppRoutes />
        </NotificationSocketWrapper>
      </TourProvider>
    </AuthProvider>
  );
}

export default App;
