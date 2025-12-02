<template>
  <div class="item-detail" v-if="phone">
    <h2>{{ phone.title }}</h2>
    <p><strong>Brand:</strong> {{ phone.brand }}</p>
    <img :src="`http://localhost:3000${phone.image}`" :alt="phone.brand" />

    <p><strong>Price:</strong> ${{ phone.price }}</p>
    <p><strong>Available:</strong> {{ phone.stock }}</p>

    <!-- Seller info -->
    <p v-if="phone.seller">
      <strong>Seller:</strong> {{ phone.seller.firstname }} {{ phone.seller.lastname }}
    </p>
    <p v-else>
      <strong>Seller:</strong> Unknown
    </p>

    <!-- Add to Cart -->
    <button class="action-button" @click="showCartInput = !showCartInput">Add to Cart</button>
    <div v-if="showCartInput">
      <input v-model.number="cartQuantity" type="number" min="1" :max="phone.stock" />
      <button @click="addToCart">Confirm</button>
    </div>

    <!-- Wishlist -->
    <button class="action-button" @click="addToWishlist">
      {{ isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist' }}
    </button>


    <!-- Reviews -->
    <h3>Reviews</h3>
    <div v-for="review in visibleReviews" :key="review._id" :style="{ color: review.hidden ? '#888' : '#000' }">
      <p><strong>{{ review.reviewerName }}</strong> - Rating: {{ review.rating }}</p>
      <p>
        {{ isExpanded(review._id) ? review.comment : shortComment(review.comment) }}
        <span v-if="review.comment.length > 200" @click="toggleExpand(review._id)" class="toggle-link">
          {{ isExpanded(review._id) ? 'Show less' : 'Show more' }}
        </span>
      </p>
      <button v-if="canHideReview(review)" @click="toggleHide(review)">Toggle Hide</button>
    </div>
    <button v-if="phone.reviews.length > visibleCount" @click="loadMoreReviews">Show More</button>

    <!-- Post Review -->
    <h3>Write a Review</h3>
    <el-row justify="center" align="middle" style="margin: 1rem 0;">
      <el-text tag="b">Rating:</el-text>
      <el-rate v-model="newRating" :max="5" class="ml-2" />
    </el-row>
    <br />
    <textarea v-model="newComment" placeholder="Write your comment..."></textarea>
    <br />
    <button @click="postReview">Submit</button>
  </div>

  <div v-else>
    <p>Loading phone details...</p>
  </div>
</template>

<script>
import { ElRate, ElRow, ElText, ElMessage } from 'element-plus'
import { postReview, getSellerNameByPhoneId } from '@/api/api'

export default {
  name: 'ItemDetail',
  props: {
    phoneId: String,
    currentUserId: String
  },
  data() {
    return {
      phone: null,
      showCartInput: false,
      cartQuantity: 1,
      visibleCount: 3,
      expandedReview: {},
      newRating: 5,
      newComment: '',
      isInWishlist: false
    }
  },
  computed: {
    visibleReviews() {
      return this.phone.reviews
        .filter(review => {
          // 总是展示非隐藏评论
          if (!review.hidden) return true

          // 如果是隐藏评论，仅在以下情况显示：
          const isAuthor = review.reviewerId === this.currentUserId
          const isSeller = this.phone?.seller?._id === this.currentUserId
          return isAuthor || isSeller
        })
        .slice(0, this.visibleCount)
    }
  }
  ,
  mounted() {
    this.loadPhoneDetails()
  },
  methods: {
    // Load full phone data by ID, ensure reviews is always an array
    async loadPhoneDetails() {
      try {
        const res = await fetch(`/api/phones/${this.phoneId}`)
        const result = await res.json()
        this.phone = {
          ...result.data,
          reviews: result.data.reviews || []
        }
        this.checkWishlistStatus()
      } catch (err) {
        console.error('Failed to load phone detail:', err)
      }
    },
    getBrandImage(brand) {
      return `/images/${brand}.jpeg`
    },
    shortComment(comment) {
      return comment.length > 200 ? comment.slice(0, 200) + '...' : comment
    },
    isExpanded(id) {
      return this.expandedReview[id] === true
    },
    toggleExpand(id) {
      this.expandedReview[id] = !this.isExpanded(id)
    },
    loadMoreReviews() {
      this.visibleCount += 3
    },
    canHideReview(review) {
      // Prevent crash if seller or _id is missing
      if (!review || !this.phone || !this.phone.seller || !this.phone.seller._id) {
        return false
      }
      return (
        review.reviewerId === this.currentUserId ||
        this.phone.seller._id === this.currentUserId
      )
    },
    toggleHide(review) {
      review.hidden = !review.hidden
    },
    async postReview() {
      if (!this.newComment.trim()) {
        ElMessage.warning('Comment is required.')
        return
      }

      // const token = localStorage.getItem('token')
      const token = sessionStorage.getItem('token')

      if (!token) {
        ElMessage.warning('Please log in to submit a review.')
        this.$router.push('/login')
        return
      }

      try {
        await postReview(this.phoneId, {
          rating: this.newRating,
          comment: this.newComment.trim()
        })

        this.newComment = ''
        this.newRating = 5
        await this.loadPhoneDetails()
      } catch (err) {
        console.error('Review submission error:', err.response?.data || err.message)
        ElMessage.warning(err.response?.data?.message || 'Failed to submit review.')
      }
    },
    addToCart() {
      // const cart = JSON.parse(localStorage.getItem('cart')) || []
      const userId = sessionStorage.getItem('userId') || 'guest';
      const cartKey = `cart_${userId}`;
      const cart = JSON.parse(sessionStorage.getItem(cartKey)) || [];

      const existing = cart.find(item => item._id === this.phone._id)
      if (existing) {
        existing.quantity += this.cartQuantity
      } else {
        cart.push({
          _id: this.phone._id,
          title: this.phone.title,
          price: this.phone.price,
          quantity: this.cartQuantity,
          stock: this.phone.stock
        })
      }

      // localStorage.setItem('cart', JSON.stringify(cart))
      sessionStorage.setItem(cartKey, JSON.stringify(cart));
      ElMessage.warning(`Added ${this.cartQuantity} to cart.`)
    },
    addToWishlist() {
      const wishlist = JSON.parse(sessionStorage.getItem('wishlist')) || []

      if (!wishlist.some(i => i.id === this.phone._id)) {
        wishlist.push({
          id: this.phone._id,
          title: this.phone.title,
          price: this.phone.price
        })
        sessionStorage.setItem('wishlist', JSON.stringify(wishlist))
        this.isInWishlist = true
        ElMessage.warning('Added to wishlist!')
      } else {
        ElMessage.warning('Item already in wishlist')

      }
    },
    checkWishlistStatus() {
      const wishlist = JSON.parse(sessionStorage.getItem('wishlist') || '[]')
      this.isInWishlist = wishlist.some(item => item.id === this.phone._id)
    }


  }
}
</script>

<style scoped>
.action-button {
  margin-right: 10px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}
.item-detail {
  position: relative;
  z-index: 1;
  text-align: center;
}

.item-detail img {
  position: relative;
  z-index: 0;
  pointer-events: none;
}
textarea {
  width: 50%;
  height: 60px;
}
.toggle-link {
  color: blue;
  cursor: pointer;
  display: inline-block;
  position: relative;
  z-index: 10;
}

</style>
  