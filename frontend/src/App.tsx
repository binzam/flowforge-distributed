import { NotificationSocketWrapper } from "./features/notifications/components/NotificationSocketWrapper";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <NotificationSocketWrapper>
      <AppRoutes />
    </NotificationSocketWrapper>
  );
}

export default App;
