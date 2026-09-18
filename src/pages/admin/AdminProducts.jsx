import { useCallback, useEffect, useState } from 'react'
import { productApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, statusClass } from '../../utils/format'

const emptyForm = {
  name: '',
  type: 'Sneaker',
  status: 'Active',
  imageUrl: '',
  quantity: 10,
  price: 0,
  size: '42',
}

export default function AdminProducts() {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productApi.getAll()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const reset = () => {
    setForm(emptyForm)
    setEditId(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    const payload = {
      name: form.name.trim(),
      type: form.type.trim(),
      status: form.status,
      imageUrl: form.imageUrl.trim(),
      quantity: Number(form.quantity),
      price: Number(form.price),
      size: String(form.size),
    }
    try {
      if (editId) {
        await productApi.update(editId, payload)
        setOk('Đã cập nhật sản phẩm')
      } else {
        await productApi.create(payload)
        setOk('Đã tạo sản phẩm')
      }
      reset()
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (p) => {
    setEditId(p.productId)
    setForm({
      name: p.name || '',
      type: p.type || '',
      status: p.status || 'Active',
      imageUrl: p.imageUrl || '',
      quantity: p.quantity ?? 0,
      price: p.price ?? 0,
      size: p.size || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id) => {
    if (!window.confirm('Xóa / vô hiệu hóa sản phẩm này?')) return
    try {
      await productApi.remove(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Quản lý sản phẩm</h2>
          <p>Admin / Staff: tạo, sửa, xóa.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {ok && <div className="alert alert-ok">{ok}</div>}

      <form className="panel admin-form" onSubmit={onSubmit}>
        <label>
          Tên
          <input required value={form.name} onChange={set('name')} />
        </label>
        <label>
          Loại
          <input required value={form.type} onChange={set('type')} />
        </label>
        <label>
          Status
          <select value={form.status} onChange={set('status')}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="OutOfStock">OutOfStock</option>
          </select>
        </label>
        <label>
          Size
          <input required value={form.size} onChange={set('size')} />
        </label>
        <label>
          Giá
          <input type="number" min={0} step="1000" required value={form.price} onChange={set('price')} />
        </label>
        <label>
          Tồn kho
          <input type="number" min={0} required value={form.quantity} onChange={set('quantity')} />
        </label>
        <label className="full">
          Image URL
          <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
        </label>
        <div className="full stack-actions">
          <button className="btn btn-accent" type="submit">
            {editId ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {editId && (
            <button className="btn btn-ghost" type="button" onClick={reset}>
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="empty">Đang tải…</div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Loại</th>
                <th>Size</th>
                <th>Giá</th>
                <th>SL</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.productId}>
                  <td>{p.name}</td>
                  <td>{p.type}</td>
                  <td>{p.size}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <span className={statusClass(p.status)}>{p.status}</span>
                  </td>
                  <td>
                    <div className="stack-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>
                        Sửa
                      </button>
                      {isAdmin && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(p.productId)}>
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
