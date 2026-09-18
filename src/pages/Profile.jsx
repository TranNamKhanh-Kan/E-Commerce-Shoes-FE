import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  })
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    setLoading(true)
    try {
      const payload = {
        userId: user.userId,
        roleId: user.roleId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      }
      if (form.password) payload.password = form.password
      await updateProfile(payload)
      setOk('Cập nhật thành công')
      setForm((f) => ({ ...f, password: '' }))
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="section-head">
        <div>
          <h2>Hồ sơ</h2>
          <p>Cập nhật thông tin tài khoản.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {ok && <div className="alert alert-ok">{ok}</div>}

      <form className="panel form-stack" onSubmit={onSubmit}>
        <label>
          Họ tên
          <input required value={form.fullName} onChange={set('fullName')} />
        </label>
        <label>
          Email
          <input type="email" required value={form.email} onChange={set('email')} />
        </label>
        <label>
          Số điện thoại
          <input value={form.phone} onChange={set('phone')} />
        </label>
        <label>
          Mật khẩu mới (để trống nếu giữ nguyên)
          <input type="password" value={form.password} onChange={set('password')} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  )
}
