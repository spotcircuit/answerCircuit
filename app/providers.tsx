'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { NotificationProvider } from "@/context/NotificationContext";
import { SettingsProvider } from "@/context/SettingsContext";
import NotificationsContainer from "@/components/ui/NotificationsContainer";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <NotificationProvider>
          {children}
          <NotificationsContainer />
        </NotificationProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}