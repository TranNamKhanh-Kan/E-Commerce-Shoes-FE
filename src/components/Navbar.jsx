import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

export default function Navbar() {
  const { isAuthenticated, user, logout, isStaff, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const close = () => setOpen(false)

  const handleLogout = async () => {
    try{
      await logout();
    }catch(error){
      console.error(error);
    }
    close()
    navigate('/')
  }

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="brand" onClick={close}>
          STRIDE<span>.</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/products" onClick={close}>
            Sản phẩm
          </NavLink>

          {isAuthenticated && (
            <>
              {!isStaff && (
                <>
                  <NavLink to="/cart" onClick={close}>
                    Giỏ hàng
                  </NavLink>
                  <NavLink to="/orders" onClick={close}>
                    Đơn hàng
                  </NavLink>
                </>
              )}
              <NavLink to="/profile" onClick={close}>
                {user?.fullName || 'Tài khoản'}
              </NavLink>
            </>
          )}

          {isStaff && (
            <NavLink to="/admin/products" onClick={close}>
              Quản lý SP
            </NavLink>
          )}
          {isStaff && (
            <NavLink to="/admin/orders" onClick={close}>
              Quản lý đơn
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/users" onClick={close}>
              Người dùng
            </NavLink>
          )}

          {isAuthenticated ? (
            <button type="button" className="linkish" onClick={handleLogout}>
              Đăng xuất
            </button>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>
                Đăng nhập
              </NavLink>
              <NavLink to="/register" onClick={close}>
                Đăng ký
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
