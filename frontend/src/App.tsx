import { useNotificationSocket } from "./hooks/use-notification-socket";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useNotificationSocket();
  return <AppRoutes />;
}

export default App;
