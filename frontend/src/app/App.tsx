import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <AppRouter />
    </>
  );
}
