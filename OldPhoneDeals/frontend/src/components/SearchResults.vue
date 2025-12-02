<template>
  <div>
    <h2>Search Results</h2>
    <p>
      Showing {{ filteredPhones.length }} result<span v-if="filteredPhones.length !== 1">s</span>
      <span v-if="keyword">for "<strong>{{ keyword }}</strong>"</span>
    </p>
    <p>Total: {{ filteredPhones.length }}</p>
    
    <div class="card-container">
        <PhoneCard
          v-for="phone in filteredPhones"
          :key="phone._id"
          :phone="phone"
          @click="select(phone)"
        />
    </div>
    
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>

<script>
import PhoneCard from './PhoneCard.vue'
import { getAllPhones } from '@/api/api'

export default {
  name: 'SearchResults',
  components: {
    PhoneCard
  },
  props: {
    keyword: String,     // user search term
    brand: String,       // filter brand
    maxPrice: Number     // filter max price
  },
  data() {
    return {
      allPhones: []      // fetched from backend
    }
  },
  computed: {
    filteredPhones() {
      return this.allPhones
        .filter(p => !p.disabled && p.stock > 0)
        .filter(p => {
          const titleMatch = this.keyword
            ? p.title.toLowerCase().includes(this.keyword.toLowerCase())
            : true;

          const brandMatch = this.brand ? p.brand === this.brand : true;
          const priceMatch = this.maxPrice ? p.price <= this.maxPrice : true;

          return titleMatch && brandMatch && priceMatch;
        });
    }
  },
  methods: {
    select(phone) {
      this.$emit('selectPhone', phone);
    },
    async fetchPhones() {
      try {
        const { data } = await getAllPhones()
        this.allPhones = data.data || []
      } catch (err) {
        console.error('Failed to load phones:', err)
      }
    }
  },
  mounted() {
    this.fetchPhones()
  }
}
</script>
  