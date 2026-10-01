import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cartApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async (userId) => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const data = await cartApi.get(userId)
      setCart(data)
    } catch (err) {
      setError(err.message || 'Không tải được giỏ hàng')
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    const loadCartData = async () => {
      if (!user?.userId) return
      setLoading(true)
      setError('')
      try {
        const data = await cartApi.get(user.userId)
        if (!ignore) {
          setCart(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Không tải được giỏ hàng')
          setCart(null)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadCartData()

    return () => {
      ignore = true
    }
  }, [user?.userId])

  const load = useCallback(() => {
    return fetchCart(user?.userId)
  }, [fetchCart, user?.userId])

  const updateQty = async (productId, quantity) => {
    try {
      await cartApi.updateItem({
        userId: user.userId,
        productId,
        quantity: Number(quantity),
      })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const removeItem = async (productId) => {
    try {
      await cartApi.removeItem(user.userId, productId)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clear(user.userId)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const items = cart?.items || []

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Giỏ hàng</h2>
          <p>Kiểm tra trước khi thanh toán.</p>
        </div>
        {items.length > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearCart}>
            Xóa hết
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="empty">Đang tải…</div>
      ) : items.length === 0 ? (
        <div className="empty">
          Giỏ trống. <Link to="/products">Mua sắm ngay</Link>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>SP</th>
                  <th>Tên</th>
                  <th>Size</th>
                  <th>Đơn giá</th>
                  <th>SL</th>
                  <th>Thành tiền</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img
                        className="cart-thumb"
                        src={
                          item.imageUrl ||
                          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=120&q=80'
                        }
                        alt=""
                      />
                    </td>
                    <td>{item.productName}</td>
                    <td>{item.size || '—'}</td>
                    <td>{formatPrice(item.unitPrice)}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        style={{ width: 72 }}
                        defaultValue={item.quantity}
                        onBlur={(e) => {
                          const v = Number(e.target.value)
                          if (v && v !== item.quantity) updateQty(item.productId, v)
                        }}
                      />
                    </td>
                    <td>{formatPrice(item.lineTotal)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(item.productId)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <strong style={{ fontSize: '1.2rem' }}>Tổng: {formatPrice(cart.totalAmount)}</strong>
            <button type="button" className="btn btn-accent" onClick={() => navigate('/checkout')}>
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  )
}
