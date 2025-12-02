<template>
  <div class="checkout-page">
    <button @click="goBack">← Back</button>
    <h2>Checkout</h2>

    <div v-if="cartItems.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div v-for="(item, index) in cartItems" :key="item._id" class="checkout-item">
        <p><strong>{{ item.title }}</strong></p>
        <p>Price: ${{ item.price }}</p>
        <label>
          Quantity:
          <input
            type="number"
            min="0"
            :max="item.stock"
            v-model.number="item.quantity"
            @change="updateQuantity(index)"
          />
        </label>
        <button @click="removeItem(index)">Remove</button>
        <hr />
      </div>

      <h3>Total: ${{ totalPrice }}</h3>
      <button @click="confirmTransaction">Confirm Transaction</button>
    </div>
  </div>
</template>

<script>
import { submitCheckout } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'Checkout',
  data() {
    return {
      cartItems: []
    }
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    updateQuantity(index) {
      const item = this.cartItems[index]
      if (item.quantity <= 0) {
        this.cartItems.splice(index, 1)
      } else {
        this.cartItems[index].quantity = item.quantity
      }
      this.saveCart()
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
      this.saveCart()
    },
    saveCart() {
      // const userId = localStorage.getItem('userId');
      // if (userId) {
      //   localStorage.setItem(`cart_${userId}`, JSON.stringify(this.cartItems));
      // }

      const userId = sessionStorage.getItem('userId');
      if (userId) {
        sessionStorage.setItem(`cart_${userId}`, JSON.stringify(this.cartItems));
      }
    },
   async confirmTransaction() {
    //  const token = localStorage.getItem('token');
    const token = sessionStorage.getItem('token');
     if (!token) {
      ElMessage.warning('You must be logged in to confirm checkout.');
       this.$router.push('/login');
       return;
     }

     try {
       // Call the backend checkout API and send purchased item details
       const response = await submitCheckout(
         this.cartItems.map(item => ({
           phoneId: item._id,
           quantity: item.quantity
         })),
         token
       );

       // Assume the transaction is successful and the items have been delivered
       ElMessage.warning('Transaction complete! Your items have been paid and delivered.');

       // Clear the local cart data
      //  localStorage.removeItem('cart');
      //  this.cartItems = [];
      // const userId = localStorage.getItem('userId');
      // if (userId) {
      //   localStorage.removeItem(`cart_${userId}`);
      // }
      // this.cartItems = [];

      const userId = sessionStorage.getItem('userId');
      if (userId) {
        sessionStorage.removeItem(`cart_${userId}`);
      }


       // Redirect to the Main Page and activate the "Home" state
       this.$emit('navigateHome'); // Optional: notify parent to activate Home view
       this.$router.push('/');

     } catch (err) {
       console.error('[Checkout Error]', err.response?.data || err.message);
       ElMessage.warning(err.response?.data?.message || 'Checkout failed.');
     }
   }



  },
  mounted() {
    // const token = localStorage.getItem('token')
    const token = sessionStorage.getItem('token');
    if (!token) {
      ElMessage.warning('You must be logged in to access checkout.')
      this.$router.push('/login')
      return
    }

    // const storedCart = localStorage.getItem('cart')
    // this.cartItems = storedCart ? JSON.parse(storedCart) : []
    // const userId = localStorage.getItem('userId');
    // const storedCart = localStorage.getItem(`cart_${userId}`);
    const userId = sessionStorage.getItem('userId');
    const storedCart = sessionStorage.getItem(`cart_${userId}`);
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];

  }
}
</script>

<style scoped>
.checkout-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
.checkout-item {
  margin-bottom: 20px;
}
input[type='number'] {
  width: 60px;
  margin-left: 10px;
}
button {
  margin-top: 5px;
}
</style>
  