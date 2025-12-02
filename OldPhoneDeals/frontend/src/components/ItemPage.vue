<!-- components/ItemPage.vue -->
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
      <ItemDetail
        :phoneId="$route.params.id"
        :currentUserId="userId"
      />
    </div>
</template>
  
<script>
  import TopBar from './TopBar.vue'
  import ItemDetail from './ItemDetail.vue'
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'ItemPage',
    components: {
      TopBar,
      ItemDetail
    },
    data() {
      return {
        userId: '123456',
      }
    },
    methods: {
      goToLogin() {
        this.$router.push('/login')
      },
      handleLogout() {
        // localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('isAdmin')
        this.$router.push('/login')
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
  