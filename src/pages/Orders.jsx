import { useCallback, useEffect, useState } from 'react'
import { orderApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { canCancelOrder, formatDate, formatPrice, statusClass } from '../utils/format'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await orderApi.getByUserId(user.userId)
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Không tải được đơn hàng')
    } finally {
      setLoading(false)
    }
  }, [user.userId])

  useEffect(() => {
    load()
  }, [load])

  const cancel = async (orderId) => {
    if (!window.confirm('Hủy đơn này?')) return
    try {
      await orderApi.cancel(orderId)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Đơn của tôi</h2>
          <p>Theo dõi và hủy đơn còn cho phép.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="empty">Đang tải…</div>
      ) : orders.length === 0 ? (
        <div className="empty">Bạn chưa có đơn nào.</div>
      ) : (
        orders.map((order) => (
          <article key={order.orderId} className="order-card">
            <header>
              <div>
                <strong>#{String(order.orderId).slice(0, 8)}</strong>
                <div className="muted">{formatDate(order.createAt)}</div>
              </div>
              <div className="stack-actions">
                <span className={statusClass(order.status)}>{order.status}</span>
                <strong>{formatPrice(order.totalAmount)}</strong>
              </div>
            </header>
            <p className="muted" style={{ marginBottom: '0.5rem' }}>
              {order.address}
            </p>
            <ul style={{ margin: '0 0 0.75rem', paddingLeft: '1.1rem' }}>
              {(order.orderDetails || []).map((d, idx) => (
                <li key={`${order.orderId}-${d.productId}-${idx}`}>
                  {d.productName} × {d.quantity} — {formatPrice(d.price)}
                </li>
              ))}
            </ul>
            {canCancelOrder(order.status) && (
              <button type="button" className="btn btn-danger btn-sm" onClick={() => cancel(order.orderId)}>
                Hủy đơn
              </button>
            )}
          </article>
        ))
      )}
    </div>
  )
}
