import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-brand-canvas text-brand-ink">
      <div className="theme-layout-glow absolute inset-x-0 top-0 -z-10 h-[22rem]" />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
