import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProfileProvider } from "@/shared/context/ProfileContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <Toaster position="top-right" richColors />
        <AppRouter />
      </ProfileProvider>
    </QueryClientProvider>
  );
}
