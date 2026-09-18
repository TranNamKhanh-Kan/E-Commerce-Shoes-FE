import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'

export default function Checkout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true
    cartApi
      .get(user.userId)
      .then((data) => {
        if (alive) setCart(data)
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
  }, [user.userId])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    setSubmitting(true)
    try {
      await cartApi.checkout({
        userId: user.userId,
        address: address.trim(),
      })
      setOk('Đặt hàng thành công!')
      setTimeout(() => navigate('/orders'), 900)
    } catch (err) {
      setError(err.message || 'Checkout thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const items = cart?.items || []

  if (loading) return <div className="empty">Đang tải…</div>

  if (!items.length) {
    return (
      <div className="empty">
        Giỏ trống — <Link to="/products">quay lại mua sắm</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="section-head">
        <div>
          <h2>Thanh toán</h2>
          <p>Nhập địa chỉ giao hàng để tạo đơn từ giỏ.</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <p className="muted" style={{ marginBottom: '0.75rem' }}>
          {items.length} sản phẩm · Tổng <strong>{formatPrice(cart.totalAmount)}</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          {items.map((i) => (
            <li key={i.productId}>
              {i.productName} × {i.quantity} — {formatPrice(i.lineTotal)}
            </li>
          ))}
        </ul>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {ok && <div className="alert alert-ok">{ok}</div>}

      <form className="panel form-stack" onSubmit={onSubmit}>
        <label>
          Địa chỉ giao hàng
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, đường, quận/huyện, thành phố"
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý…' : 'Xác nhận đặt hàng'}
        </button>
      </form>
    </div>
  )
}
