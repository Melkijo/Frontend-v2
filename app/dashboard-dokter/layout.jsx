import "react-quill/dist/quill.snow.css";
import NavbarDokter from "@/components/ui/NavbarDokter";

export const metadata = {
   title: "Create Next App",
   description: "Generated by create next app",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body>
            <NavbarDokter />
            {children}
         </body>
      </html>
   );
}