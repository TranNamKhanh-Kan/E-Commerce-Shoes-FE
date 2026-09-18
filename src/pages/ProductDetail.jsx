import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cartApi, productApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatPrice, statusClass } from '../utils/format'

export default function ProductDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    productApi
      .getById(id)
      .then((data) => {
        if (alive) setProduct(data)
      })
      .catch((err) => {
        if (alive) setError(err.message || 'Không tìm thấy sản phẩm')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [id])

  const addToCart = async () => {
    setError('')
    setOk('')
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } })
      return
    }
    setAdding(true)
    try {
      await cartApi.add({
        userId: user.userId,
        productId: product.productId,
        quantity: Number(qty) || 1,
      })
      setOk('Đã thêm vào giỏ hàng')
    } catch (err) {
      setError(err.message || 'Không thêm được vào giỏ')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="empty">Đang tải…</div>
  if (!product) return <div className="alert alert-error">{error || 'Không có dữ liệu'}</div>

  const img =
    product.imageUrl ||
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80'

  return (
    <div className="detail-layout">
      <div className="detail-media">
        <img src={img} alt={product.name} />
      </div>
      <div className="detail-info panel">
        <div className="product-tile__type">{product.type}</div>
        <h1>{product.name}</h1>
        <p className="price" style={{ fontSize: '1.4rem' }}>
          {formatPrice(product.price)}
        </p>
        <p className="muted">
          Size: <strong>{product.size || '—'}</strong> · Tồn:{' '}
          <strong>{product.quantity ?? 0}</strong>
        </p>
        <p>
          <span className={statusClass(product.status)}>{product.status}</span>
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {ok && <div className="alert alert-ok">{ok}</div>}

        <div className="qty-row">
          <label style={{ margin: 0 }}>
            Số lượng
            <input
              type="number"
              min={1}
              max={product.quantity || 99}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </label>
        </div>

        <div className="stack-actions">
          <button className="btn btn-accent" type="button" onClick={addToCart} disabled={adding}>
            {adding ? 'Đang thêm…' : 'Thêm vào giỏ'}
          </button>
          <Link to="/cart" className="btn btn-ghost">
            Xem giỏ
          </Link>
        </div>
      </div>
    </div>
  )
}
