import { AuthProvider } from "./features/auth/providers/AuthProvider";
import { NotificationSocketWrapper } from "./features/notifications/components/NotificationSocketWrapper";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <NotificationSocketWrapper>
        <AppRoutes />
      </NotificationSocketWrapper>
    </AuthProvider>
  );
}

export default App;
