import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, roleId, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="empty" style={{ margin: '3rem auto', maxWidth: 400 }}>
        Đang tải thông tin xác thực...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(roleId)) {
    return <Navigate to="/" replace />
  }

  return children
}
