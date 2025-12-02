<!-- <template>
    <div class="user-reviews">
      <h2>{{ userName }}'s Reviews</h2>
  
      <p v-if="error" class="error">{{ error }}</p>
  
      <section v-else>
        <h3>Written Reviews</h3>
        <p v-if="!written.length">This user doesn't post any reviews.</p>
        <ul v-else>
          <li v-for="r in written" :key="r._id">
            <strong>On {{ formatDate(r.createdAt) }}:</strong>
            Rated {{ r.rating }}/5 on <em>{{ r.listing.title }}</em><br>
            “{{ r.comment }}”
          </li>
        </ul>
  
        <h3>Received Reviews</h3>
        <p v-if="!received.length">This user doesn't get any reviews.</p>
        <ul v-else>
          <li v-for="r in received" :key="r._id">
            <strong>By {{ r.author.firstname }} {{ r.author.lastname }} on {{ formatDate(r.createdAt) }}:</strong><br>
            Rated {{ r.rating }}/5<br>
            “{{ r.comment }}”
          </li>
        </ul>
      </section>
    </div>
  
</template>
  
<script>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/api/api.js'   // 直接使用 api 实例
  
  export default {
    name: 'UserReviews',
    setup() {
      const route = useRoute()
      const userId = route.params.id
      const all = ref([])
      const error = ref('')
      const userName = ref('User')
  
      onMounted(async () => {
        try {
          // 直接调用后端 Admin 路由 GET /api/reviews
          const res = await api.get('/admin/reviews')
          all.value = res.data.data
  
          // 如果需要用户名显示，可在这里 fetch 用户详情
          // const userRes = await api.get(`/users/${userId}`)
          // userName.value = `${userRes.data.firstname} ${userRes.data.lastname}`
  
        } catch (err) {
          console.error(err)
          error.value = '加载评论失败，请稍后重试'
        }
      })
  
      const written = computed(() =>
        all.value.filter(r => r.author._id === userId)
      )
  
      const received = computed(() =>
        all.value.filter(r => r.listing?.seller?._id === userId)
      )
  
      function formatDate(ts) {
        return ts ? new Date(ts).toLocaleString() : '-'
      }
  
      return { written, received, error, userName, formatDate }
    }
  }
</script>
  
<style scoped>
  .user-reviews {
    padding: 1rem;
    font-family: sans-serif;
  }
  .error {
    color: #d9534f;
    margin-bottom: 1rem;
  }
  h3 {
    margin-top: 1rem;
    color: #333;
  }
  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }
</style> -->
  
<template>
  <div class="container">
    <h2 class="my-4 text-center">{{ name }}'s Reviews</h2>

    <div class="row">
      <!-- Written Reviews -->
      <div class="col-md-6">
        <h4 class="fw-bold mb-3">
          <p>Reviews Wrote</p>
        </h4>
        <div v-if="written.length === 0" class="text-muted">
          <p>No written reviews yet.</p>
        </div>
        <ul class="list-group">
          <li v-for="(review, index) in written" :key="index" class="list-group-item">
            <p><strong>Phone:</strong> {{ review.title }} ({{ review.price }})</p>
            <p><strong>Review:</strong> {{ review.review }}</p>
          </li>
        </ul>
      </div>

      <!-- Received Reviews -->
      <div class="col-md-6">
        <h4 class="fw-bold mb-3">
          <p>Reviews Received</p>
        </h4>
        <div v-if="received.length === 0" class="w-100 text-center text-muted my-4">
          <p>No received reviews yet.</p>
        </div>

        <div v-for="(group, idx) in groupedReceived" :key="idx" class="mb-4">
          <p><strong>Phone:</strong> {{ group.title }} ({{ group.price }})</p>
          <ul class="list-group">
            <li
              v-for="(review, i) in group.reviews"
              :key="i"
              class="list-group-item"
            >
              <p><strong>Review:</strong> {{ review.review }}</p>
              <p>
                <strong>Reviewer:</strong>
                <span v-if="review.reviewer">
                  {{ review.reviewer.firstname }} {{ review.reviewer.lastname }}
                </span>
                <span v-else>Unknown reviewer</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { getUserReviewsByAdmin, getUserNameById } from '@/api/api'

const props = defineProps(['id'])
const userId = props.id

const written = ref([])
const received = ref([])
const name = ref('')

onMounted(async () => {
  try {
    const res1 = await getUserReviewsByAdmin(userId)
    written.value = res1.data.written
    received.value = res1.data.received

    const res2 = await getUserNameById(userId)
    name.value = res2.data.name
  } catch (err) {
    console.error('Failed to load review history:', err)
  }
})


const groupedReceived = computed(() => {
  const groups = {}
  received.value.forEach(r => {
    const key = `${r.title}_${r.price}`
    if (!groups[key]) {
      groups[key] = { title: r.title, price: r.price, reviews: [] }
    }
    groups[key].reviews.push(r)
  })
  return Object.values(groups)
})
</script>