import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nova - The Universal Trust Layer for AI",
  description: "Intelligent, real-time gateway that acts as a universal firewall and quality control system for AI models.",
  keywords: ["AI", "security", "trust", "gateway", "firewall", "LLM", "safety"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} h-full bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('nova-ui-theme') || 'dark';
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark', 'h-full');
                  } else {
                    document.documentElement.classList.add('light', 'h-full');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark', 'h-full');
                }
                
                // Suppress hydration warnings caused by browser extensions
                if (typeof window !== 'undefined') {
                  const originalError = console.error;
                  console.error = function(...args) {
                    if (args[0] && typeof args[0] === 'string' && 
                        (args[0].includes('hydration') || args[0].includes('bis_skin_checked'))) {
                      return;
                    }
                    originalError.apply(console, args);
                  };
                }
              })();
            `,
          }}
        />
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
