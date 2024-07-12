import ModalProvider from './modal-provider';
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
      <ModalProvider />
      {children}
    </ThemeProvider>
  );
}
