import { useCallback, useEffect, useState } from 'react'
import { orderApi } from '../../api'
import { formatDate, formatPrice, statusClass } from '../../utils/format'

const STATUSES = ['Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await orderApi.getAll()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateStatus = async (order, status) => {
    try {
      await orderApi.update(order.orderId, {
        status,
        address: order.address,
      })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Quản lý đơn hàng</h2>
          <p>Admin / Staff cập nhật trạng thái.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="empty">Đang tải…</div>
      ) : orders.length === 0 ? (
        <div className="empty">Chưa có đơn.</div>
      ) : (
        orders.map((order) => (
          <article key={order.orderId} className="order-card">
            <header>
              <div>
                <strong>#{String(order.orderId).slice(0, 8)}</strong>
                <div className="muted">
                  {order.fullName} · {formatDate(order.createAt)}
                </div>
              </div>
              <div className="stack-actions">
                <span className={statusClass(order.status)}>{order.status}</span>
                <strong>{formatPrice(order.totalAmount)}</strong>
              </div>
            </header>
            <p className="muted">{order.address}</p>
            <ul style={{ margin: '0.4rem 0 0.8rem', paddingLeft: '1.1rem' }}>
              {(order.orderDetails || []).map((d, idx) => (
                <li key={`${order.orderId}-${idx}`}>
                  {d.productName} × {d.quantity}
                </li>
              ))}
            </ul>
            <label style={{ maxWidth: 220 }}>
              Đổi status
              <select
                value={order.status || 'Pending'}
                onChange={(e) => updateStatus(order, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </article>
        ))
      )}
    </div>
  )
}
