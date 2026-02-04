import AppRouter from "./AppRouter";
import { TimerProvider } from "./TimerProvider";

export default function App() {
  return (
    <TimerProvider>
      <AppRouter />
    </TimerProvider>
  );
}
