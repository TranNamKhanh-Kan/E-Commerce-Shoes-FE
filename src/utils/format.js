export function formatPrice(value) {
  const n = Number(value ?? 0)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function statusClass(status) {
  const s = String(status || '').toLowerCase()
  if (s.includes('active') || s.includes('completed') || s.includes('confirmed')) return 'badge badge-ok'
  if (s.includes('pending') || s.includes('shipping')) return 'badge badge-warn'
  if (s.includes('cancel') || s.includes('inactive') || s.includes('out')) return 'badge badge-danger'
  return 'badge'
}

export function canCancelOrder(status) {
  const s = String(status || '').toLowerCase()
  return !['completed', 'cancelled', 'canceled', 'shipping'].includes(s)
}
