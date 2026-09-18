import { useEffect, useState } from 'react'
import { authApi } from '../../api'

const ROLE_LABEL = { 1: 'Admin', 2: 'Staff', 3: 'Customer' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    authApi
      .getAllUsers()
      .then((data) => {
        if (alive) setUsers(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (alive) setError(err.message)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Người dùng</h2>
          <p>Chỉ Admin xem danh sách.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="empty">Đang tải…</div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td>{ROLE_LABEL[u.roleId] || u.roleId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
