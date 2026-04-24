import AppNavigation from "../components/navigation/AppNavigation";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <AppNavigation />
      
      {/* 
        Responsive Padding:
        - sm:pt-24 : Padding top for Desktop Top Navbar
        - pb-20 : Padding bottom for Mobile Bottom Navbar
      */}
      <main className="w-full flex-1 sm:pt-24 pb-20 p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}
