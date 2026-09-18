import { Link } from 'react-router-dom'
import { formatPrice, statusClass } from '../utils/format'

export default function ProductCard({ product, index = 0 }) {
  const id = product.productId
  const img =
    product.imageUrl ||
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80'

  return (
    <Link
      to={`/products/${id}`}
      className="product-tile"
      style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
    >
      <div className="product-tile__media">
        <img src={img} alt={product.name} loading="lazy" />
      </div>
      <div className="product-tile__body">
        <div className="product-tile__type">{product.type || 'Shoes'}</div>
        <div className="product-tile__name">{product.name}</div>
        <div className="product-tile__meta">
          <span className="price">{formatPrice(product.price)}</span>
          <span className={statusClass(product.status)}>{product.status}</span>
        </div>
      </div>
    </Link>
  )
}
