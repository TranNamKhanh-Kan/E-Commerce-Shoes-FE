import { useEffect, useMemo, useState } from 'react'
import { productApi } from '../api'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('Active')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data =
        keyword || type || status
          ? await productApi.search({ keyword, type, status })
          : await productApi.getAll()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Không tải được danh sách')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const types = useMemo(() => {
    const set = new Set(products.map((p) => p.type).filter(Boolean))
    return [...set]
  }, [products])

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Sản phẩm</h2>
          <p>Tìm theo tên, loại hoặc trạng thái.</p>
        </div>
      </div>

      <form
        className="toolbar"
        onSubmit={(e) => {
          e.preventDefault()
          load()
        }}
      >
        <input
          placeholder="Từ khóa…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tất cả loại</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value="Sneaker">Sneaker</option>
          <option value="Running">Running</option>
          <option value="Casual">Casual</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Mọi trạng thái</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="OutOfStock">OutOfStock</option>
        </select>
        <button className="btn btn-primary btn-sm" type="submit">
          Tìm kiếm
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="empty">Đang tải…</div>
      ) : products.length === 0 ? (
        <div className="empty">Không có sản phẩm phù hợp.</div>
      ) : (
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.productId} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
