import DashboardNavbar from "@/components/Navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background py-16">
      <DashboardNavbar />
      {children}
    </div>
  )
}