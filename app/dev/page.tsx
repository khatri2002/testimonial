import { ThemeProvider } from "@/components/theme-provider";
import Loading from "../dashboard/[slug]/(sidebar-layout)/components/loading";

export default function Dev() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Loading />
    </ThemeProvider>
  );
}
