<template>
  <div class="phone-card" @click="$emit('click')">
    <!-- Show phone image based on brand -->
    <img :src="`http://localhost:3000${phone.image}`" :alt="phone.brand" />

    <!-- Show phone title -->
    <h3>{{ phone.title }}</h3>

    <!-- Show phone price -->
    <p>Price: ${{ phone.price }}</p>

    <!-- Show available stock -->
    <p>Stock: {{ phone.stock }}</p>

    <!-- Show average rating if there are reviews -->
    <p v-if="averageRating !== null">Rating: {{ averageRating.toFixed(1) }}/5</p>
    <p v-else>No ratings</p>
  </div>
</template>

<script>
export default {
  name: 'PhoneCard',
  props: {
    // Phone info passed from parent component
    phone: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Calculate average rating from all reviews
    averageRating() {
      if (!this.phone.reviews || this.phone.reviews.length === 0) return null
      const total = this.phone.reviews.reduce((sum, r) => sum + r.rating, 0)
      return total / this.phone.reviews.length
    }
  },
  methods: {
    // Return image path based on brand name
    getBrandImage(brand) {
      return `/images/${brand}.jpeg`
    }
  }
}
</script>

<style scoped>
.phone-card {
  width: 240px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  transition: transform 0.2s ease;
  background: #fff;
}

.phone-card h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.phone-card:hover {
  transform: scale(1.03); /* Slight zoom on hover */
}

.phone-card img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 8px;
}
</style>
