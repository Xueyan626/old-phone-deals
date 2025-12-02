<template>
  <div class="phone-reviews">
    <button class="back" @click="$router.back()">← Back</button>
    <h2>Listing Reviews</h2>

    <div v-if="phone" class="phone-info">
      <h3>{{ phone.title }}</h3>
      <p><strong>Brand:</strong> {{ phone.brand }}</p>
      <p><strong>Price:</strong> £{{ phone.price.toFixed(2) }}</p>
      <p><strong>Stock:</strong> {{ phone.stock }}</p>
      <p>
        <strong>Seller:</strong>
        {{ phone.seller?.firstname || 'Unknown' }}
        {{ phone.seller?.lastname || '' }}
      </p>
    </div>
    <div v-else class="loading">Loading phone…</div>

    <div v-if="error" class="error">{{ error }}</div>
    <ul v-else-if="reviews.length" class="reviews-list">
      <li v-for="r in reviews" :key="r.reviewId">
        <p class="comment">{{ r.comment }}</p>
        <p class="meta">
          By <strong>{{ r.author }}</strong>
        </p>
      </li>
    </ul>
    <p v-else class="no-reviews">No reviews for this listing.</p>
  </div>
</template>

<script>
import api from '@/api/api.js'

export default {
  name: 'AdminPhoneReviews',
  props: ['id'],
  data() {
    return {
      phone: null,
      reviews: [],
      error: ''
    }
  },
  async created() {
    try {
      const [pRes, rRes] = await Promise.all([
        api.get(`/phones/${this.id}`),
        api.get('/admin/reviews')
      ])
      this.phone = pRes.data.data || pRes.data
      const all = rRes.data.data || []
      this.reviews = all
        .filter(r => r.phoneId === this.id)
        .map(r => ({
          reviewId: r._id,
          comment: r.comment,
          author:
            typeof r.reviewer === 'object'
              ? `${r.reviewer.firstname || ''} ${r.reviewer.lastname || ''}`.trim()
              : r.reviewer,
          date: r.date || null
        }))
    } catch (err) {
      console.error(err)
      this.error = err.response?.data?.message || err.message
    }
  },
  methods: {
    formatDate(ts) {
      return ts ? new Date(ts).toLocaleString() : '-'
    }
  }
}
</script>

<style scoped>
.phone-reviews {
  max-width: 600px;
  margin: 2rem auto;
  font-family: sans-serif;
}
.back {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  margin-bottom: 1rem;
}
.loading,
.no-reviews {
  text-align: center;
  color: #666;
  margin: 2rem 0;
}
.phone-info {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}
.phone-info h3 {
  margin: 0 0 0.5rem;
}
.phone-info p {
  margin: 0.25rem 0;
}
.error {
  color: #e74c3c;
  text-align: center;
  margin: 1rem 0;
}
.reviews-list {
  list-style: none;
  padding: 0;
}
.reviews-list li {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.comment {
  margin: 0 0 0.5rem;
}
.meta {
  font-size: 0.85rem;
  color: #888;
}
</style>
  