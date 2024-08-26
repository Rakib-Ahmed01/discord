import { Toaster } from '@/components/ui/sonner';
import ModalProvider from './modal-provider';
import SocketProvider from './socket-provider';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="discord-theme"
    >
      <SocketProvider>
        <ModalProvider />
        <Toaster richColors closeButton />
        {children}
      </SocketProvider>
    </ThemeProvider>
  );
}
