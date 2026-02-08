import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Vukara",
  description: "Crowdsourcing platform for women entrepreneurs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
