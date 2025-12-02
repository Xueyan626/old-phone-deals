<template>
  <div>
    <TopBar
      :isLoggedIn="isLoggedIn"
      :isSearchState="false"
      @goProfile="$router.push('/profile')"
      @goHome="$router.push('/')"
      @login="goToLogin"
      @logout="handleLogout"
      @checkout="goToCheckout"
      @goWishlist="$router.push('/wishlist')"
    />

    <h2>Your Wishlist</h2>

    <div v-if="wishlistItems.length > 0">
      <div v-for="item in wishlistItems" :key="item.id" class="wishlist-item">
        <p><strong>{{ item.title }}</strong> - ${{ item.price }}</p>

        <div class="button-group">
        <button @click="removeFromWishlist(item.id)">Remove</button>
        <button @click="moveToCart(item)">Move to Cart</button>
        </div>

      </div>
    </div>

    <div v-else>
      <p>Your wishlist is empty.</p>
    </div>
  </div>
</template>

<script>
import TopBar from './TopBar.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'WishlistPage',
  components: { TopBar },
  data() {
    return {
      wishlistItems: []
    }
  },
  computed: {
    isLoggedIn() {
      // return !!localStorage.getItem('token')
      return !!sessionStorage.getItem('token')
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login')
    },
    handleLogout() {
      // localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    goToCheckout() {
      if (!this.isLoggedIn) {
        ElMessage.warning('Please log in to access checkout.')

        this.$router.push('/login')
      } else {
        this.$router.push('/checkout')
      }
    },
    removeFromWishlist(id) {
      this.wishlistItems = this.wishlistItems.filter(item => item.id !== id)
      sessionStorage.setItem('wishlist', JSON.stringify(this.wishlistItems))
    },
    moveToCart(item) {
      const userId = sessionStorage.getItem('userId') || 'guest';
      const cartKey = `cart_${userId}`;
      const cart = JSON.parse(sessionStorage.getItem(cartKey)) || [];

      if (!cart.some(i => i._id === item.id)) {
        cart.push({
          _id: item.id,
          title: item.title,
          price: item.price,
          quantity: 1
        });
        sessionStorage.setItem(cartKey, JSON.stringify(cart));
        ElMessage.success('Moved to cart!');
      } else {
        ElMessage.warning('Item already in cart.');
      }

      this.removeFromWishlist(item.id);
    }
  
  },
  mounted() {
    const storedWishlist = sessionStorage.getItem('wishlist')
    this.wishlistItems = storedWishlist ? JSON.parse(storedWishlist) : []
    console.log('Loaded wishlist:', this.wishlistItems)
  }
}
</script>

<style scoped>
.wishlist-item {
  margin-bottom: 15px;
}
button {
  margin-right: 10px;
}
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px; 
  margin-top: 8px;
}


</style>
