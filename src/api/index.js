import { api } from './client'

export const authApi = {
  login: (email, password) =>
    api('/api/User/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (payload) =>
    api('/api/User/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => api('/api/User/me'),

  logout: () =>
    api('/api/User/logout', {
      method: 'POST',
    }),

  updateUser: (payload) =>
    api('/api/User/update-user', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getAllUsers: () => api('/api/User/get-all-user'),

  getRoles: () => api('/api/User/role'),
}

export const productApi = {
  getAll: () => api('/api/Product/get-all-product'),

  getById: (id) => api(`/api/Product/get-product-by-id/${id}`),

  search: ({ keyword = '', type = '', status = '' } = {}) => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (type) params.set('type', type)
    if (status) params.set('status', status)
    const q = params.toString()
    return api(`/api/Product/search${q ? `?${q}` : ''}`)
  },

  create: (payload) =>
    api('/api/Product/create-product', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    api(`/api/Product/update-product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    api(`/api/Product/delete-product/${id}`, {
      method: 'DELETE',
    }),
}

export const cartApi = {
  get: (userId) => api(`/api/Cart/get-cart?userId=${userId}`),

  add: (payload) =>
    api('/api/Cart/add-to-cart', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateItem: (payload) =>
    api('/api/Cart/update-item', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  removeItem: (userId, productId) =>
    api(`/api/Cart/remove-item?userId=${userId}&productId=${productId}`, {
      method: 'DELETE',
    }),

  clear: (userId) =>
    api(`/api/Cart/clear-cart?userId=${userId}`, {
      method: 'DELETE',
    }),

  checkout: (payload) =>
    api('/api/Cart/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

export const orderApi = {
  getAll: () => api('/api/Order/get-all-order'),

  getById: (id) => api(`/api/Order/get-order-by-id/${id}`),

  getByUserId: (userId) => api(`/api/Order/get-order-by-user-id?id=${userId}`),

  update: (id, payload) =>
    api(`/api/Order/update-order/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  cancel: (id) =>
    api(`/api/Order/cancel-order/${id}`, {
      method: 'PUT',
    }),
}
