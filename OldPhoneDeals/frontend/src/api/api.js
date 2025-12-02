// src/api/api.js

import axios from 'axios'

// Define base URL from environment or fallback to localhost
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 5000
})

//Automatically inject Bearer token except for /auth routes
api.interceptors.request.use(config => {
  // const token = localStorage.getItem('token')
  const token = sessionStorage.getItem('token')
  if (token && !config.url.startsWith('/auth')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


// Global silent error handler
api.interceptors.response.use(
  res => res,
  err => {
    console.warn('[Silent Error]', err.message)
    return Promise.reject(err)
  }
)


// ——— Auth APIs ——————————————————————
export const login    = data => api.post('/auth/login',  data)
export const register = data => api.post('/auth/signup', data)


// ——— User APIs ——————————————————————
export const getProfile     = () => api.get('/user/profile')
export const updateProfile  = data => api.put('/user/profile',  data)
export const updatePassword = data => api.put('/user/password', data)


// ——— Phone APIs ——————————————————————
// For product listings and detail view
export const getAllPhones = () => api.get('/phones')
export const getPhoneById = id  => api.get(`/phones/${id}`)
export const updatePhone    = (id, body) => api.put(`/phones/${id}`, body)
export const createPhone    = (payload, opts = {}) => api.post('/phones', payload, opts)
export const disablePhone   = id => api.patch(`/phones/${id}/disable`)
export const enablePhone    = id => api.patch(`/phones/${id}/enable`)
export const deletePhone    = id => api.delete(`/phones/${id}`)
export const getAllBrands = () => api.get('/phones/brands')


// ——— Cart / Checkout APIs —————————————————————
export const submitCheckout = items =>
  api.post('/cart/checkout', { items })


// ——— Wishlist APIs —————————————————————
// Add, remove or fetch wishlist items
export const addToWishlist      = item => api.post('/wishlist/add', item)
export const getWishlist        = () => api.get('/wishlist')
export const removeFromWishlist = id => api.delete(`/wishlist/${id}`)


// ——— Review APIs —————————————————————
// Submit a review
export const postReview = (phoneId, { rating, comment }) =>
  api.post(`/reviews/${phoneId}/reviews`, { rating, comment })

// Get all reviews for a phone
export const getReviewsByPhone = phoneId =>
  api.get(`/reviews/${phoneId}/reviews`)

// Hide a specific review
export const hideReview = (phoneId, reviewId) =>
  api.patch(`/reviews/${phoneId}/reviews/${reviewId}/hide`)

// Unhide a specific review
export const unhideReview = (phoneId, reviewId) =>
  api.patch(`/reviews/${phoneId}/reviews/${reviewId}/unhide`)


// ——— More APIs can be added here —————————————————————
// e.g., admin management, file upload, email verification, etc.
//update all user
export const adminUpdateUser = (id, data) => api.put(`/admin/users/${id}`, data)
export const getUserListingsByAdmin = (userId) => api.get(`/admin/users/${userId}/listings`)
export const getUserNameById = (userId) => api.get(`/admin/users/${userId}/name`)
export const getUserReviewsByAdmin = userId => api.get(`/admin/reviews/user/${userId}`)
export const getSellerNameByPhoneId = phoneId => api.get(`/admin/phones/${phoneId}/sellername`)
// export const uploadImage = file => api.post('/upload', file)

export default api
