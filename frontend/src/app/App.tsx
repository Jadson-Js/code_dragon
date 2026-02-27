import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { TimerProvider } from "./TimerProvider";

export default function App() {
  return (
    <TimerProvider>
      <Toaster position="top-right" richColors />
      <AppRouter />
    </TimerProvider>
  );
}
