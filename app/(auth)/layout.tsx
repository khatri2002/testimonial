import { ThemeProvider } from "@/components/theme-provider";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
    </ThemeProvider>
  );
}
