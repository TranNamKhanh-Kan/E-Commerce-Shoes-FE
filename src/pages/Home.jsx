import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productApi } from '../api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    productApi
      .getAll()
      .then((data) => {
        if (!alive) return
        const list = Array.isArray(data) ? data : []
        setProducts(list.filter((p) => String(p.status).toLowerCase() === 'active').slice(0, 8))
      })
      .catch((err) => {
        if (alive) setError(err.message || 'Không tải được sản phẩm')
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <div className="hero__brand">
            STRIDE<span>.</span>
          </div>
          <p className="hero__copy">
            Giày chạy, sneaker và lifestyle — chọn size, thêm giỏ, đặt hàng trong vài bước.
          </p>
          <div className="hero__actions">
            <Link to="/products" className="btn btn-accent">
              Xem bộ sưu tập
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Nổi bật tuần này</h2>
            <p>Những mẫu đang còn hàng, sẵn sàng giao.</p>
          </div>
          <Link to="/products" className="btn btn-ghost btn-sm">
            Tất cả sản phẩm
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {!error && products.length === 0 ? (
          <div className="empty">Chưa có sản phẩm Active. Hãy thêm từ trang quản lý hoặc mở API.</div>
        ) : (
          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard key={p.productId} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">STRIDE. — cửa hàng giày online</footer>
    </>
  )
}
