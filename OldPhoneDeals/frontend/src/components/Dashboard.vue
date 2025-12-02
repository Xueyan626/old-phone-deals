<!-- components/Dashboard.vue -->
<template>
  <div>
    <!-- TopBar with full control -->
    <TopBar
      :isLoggedIn="isLoggedIn"
      :isSearchState="state === 'search'"
      @goProfile="$router.push('/profile')"
      @search="handleSearch"
      @filter-change="handleFilterChange"
      @login="goToLogin"
      @logout="handleLogout"
      @goHome="state = 'home'"
      @checkout="goToCheckout"
      @goWishlist="$router.push('/wishlist')"
    />

    <!-- Home View -->
    <HomeView
      v-if="state === 'home'"
      @selectPhone="handleSelectPhone"
    />

    <!-- Search Results -->
    <SearchResults
      v-if="state === 'search'"
      :keyword="searchTerm"
      :brand="searchBrand"
      :maxPrice="searchMaxPrice"
      @selectPhone="handleSelectPhone"
    />
  </div>
</template>

<script>
import TopBar from './TopBar.vue'
import HomeView from './HomeView.vue'
import SearchResults from './SearchResults.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Dashboard',
  components: {
    TopBar,
    HomeView,
    SearchResults
  },
  data() {
    return {
      state: 'home',
      searchTerm: '',
      searchBrand: '',
      searchMaxPrice: 2000
    }
  },
  methods: {
    // User chooses to login → go to /login
    goToLogin() {
      this.$router.push('/login')
    },

    // User logs out
    handleLogout() {
      // localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('isAdmin')
      this.$router.push('/login')
    },

    handleLoginSuccess() {
      // localStorage.setItem('token', 'valid')
      sessionStorage.setItem('token', 'valid')
      this.$router.push('/')
    },

    handleSearch(term) {
      this.searchTerm = term
      this.state = 'search'
    },

    handleFilterChange(filters) {
      this.searchBrand = filters.brand
      this.searchMaxPrice = filters.maxPrice
    },

    handleSelectPhone(phone) {
      this.$router.push(`/item/${phone._id}`)
    },
    
    goToCheckout() {
      // const token = localStorage.getItem('token')
      const token = sessionStorage.getItem('token')
      if (!token) {
        ElMessage.warning('Please log in to access checkout.')
        this.$router.push('/login')
      } else {
        this.$router.push('/checkout')
      }
    }
  },
  computed: {
    isLoggedIn() {
      // return !!localStorage.getItem('token')
      return !!sessionStorage.getItem('token')
    }
  }

}



</script>
