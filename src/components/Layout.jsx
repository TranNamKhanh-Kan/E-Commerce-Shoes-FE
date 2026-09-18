import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  const { pathname } = useLocation()
  const fullBleed = pathname === '/'

  return (
    <div className="page-shell">
      <Navbar />
      <main className={fullBleed ? 'page-main full-bleed' : 'page-main'}>
        <Outlet />
      </main>
      {!fullBleed && <footer className="site-footer">STRIDE. — cửa hàng giày online</footer>}
    </div>
  )
}
