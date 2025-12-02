<template>
  <div>
    <h2>Sold Out Soon</h2>
    <div class="card-row">
      <PhoneCard
        v-for="phone in soldOutSoonPhones"
        :key="phone._id"
        :phone="phone"
        @click="select(phone)"
      />
    </div>

    <h2>Best Sellers</h2>
    <div class="card-row">
      <PhoneCard
        v-for="phone in bestSellerPhones"
        :key="phone._id"
        :phone="phone"
        @click="select(phone)"
      />
    </div>
  </div>
</template>

<style scoped>
.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}
</style>
  

<script>
import PhoneCard from './PhoneCard.vue'

export default {
  name: 'HomeView',
  components: {
    PhoneCard
  },
  data() {
    return {
      allPhones: []
    }
  },
  computed: {
    soldOutSoonPhones() {
      return this.allPhones
        .filter(p => p.stock > 0)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
    },
    bestSellerPhones() {
      return this.allPhones
        .filter(p => p.disabled !== true && p.disabled !== 'true' && p.reviews?.length >= 2)
        .sort((a, b) => this.avgRating(b) - this.avgRating(a))
        .slice(0, 5)
    }
  },
  methods: {
    avgRating(phone) {
      const reviews = phone.reviews || []
      if (reviews.length === 0) return 0
      const total = reviews.reduce((sum, r) => sum + r.rating, 0)
      return total / reviews.length
    },
    select(phone) {
      this.$emit('selectPhone', phone)
    }
  },
  mounted() {
    fetch('/api/phones')
      .then(res => res.json())
      .then(response => {
        this.allPhones = response.data
      })
      .catch(err => {
        console.error('Failed to load phones:', err)
      })
  }
}
</script>
  