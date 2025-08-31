import Sidebar from '../components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Sidebar />
      <div className="lg:pl-72">
        <main className="">
          <div className="">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
