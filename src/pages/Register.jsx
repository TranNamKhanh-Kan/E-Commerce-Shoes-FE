import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
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
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })
      setOk('Đăng ký thành công. Hãy đăng nhập.')
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <h1>Đăng ký</h1>
        <p className="muted">Mật khẩu ≥ 8 ký tự, có chữ hoa và số.</p>
        {error && <div className="alert alert-error">{error}</div>}
        {ok && <div className="alert alert-ok">{ok}</div>}
        <form className="form-stack" onSubmit={onSubmit}>
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
            Mật khẩu
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={set('password')}
            />
          </label>
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? 'Đang tạo…' : 'Tạo tài khoản'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: '1rem' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
