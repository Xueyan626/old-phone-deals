<template>
  <div class="comments-page">

    <h2>Your Phone Listings & Comments</h2>

    <p v-if="phonesWithComments.length === 0 && !error" class="no-data">You have no phone listings.</p>

    <div v-for="phone in phonesWithComments" :key="phone.id" class="phone-section">
      <h3 class="phone-title">{{ phone.title }}</h3>
      <div class="phone-info">
        <p><strong>Brand:</strong> {{ phone.brand }}</p>
        <p><strong>Price:</strong> ${{ phone.price.toFixed(2) }}</p>
        <p><strong>Description:</strong> {{ phone.description }}</p>
      </div>

      <div v-if="phone.comments.length">
        <table class="comment-table">
          <thead>
            <tr>
              <th>Comment</th>
              <th>Author</th>
              <th>Hidden</th>
              <th>Toggle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in phone.comments" :key="comment._id">
              <td>{{ comment.comment }}</td>
              <td>{{ comment.reviewer?.firstname || 'Unknown' }} {{ comment.reviewer?.lastname || '' }}</td>
              <td>{{ comment.hidden ? 'Yes' : 'No' }}</td>
              <td>
                <button @click="toggleHidden(phone.id, comment._id, !comment.hidden)" class="toggle-btn">
                  {{ comment.hidden ? 'Show' : 'Hide' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="no-comments">No comments for this phone.</p>
    </div>

    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script>
import { getAllPhones, getReviewsByPhone, hideReview, unhideReview } from '@/api/api'

export default {
  name: 'ViewComments',
  data() {
    return {
      phonesWithComments: [],
      error: ''
    }
  },
  async created() {
  try {
    const token = sessionStorage.getItem('token') || ''
    let currentUserId = null

    if (token && token.split('.').length === 3) {
      try {
        const payloadBase64 = token.split('.')[1]
        const payloadJson = atob(payloadBase64)
        const payload = JSON.parse(payloadJson)
        console.log('Decoded token payload:', payload)

        currentUserId = payload.id
        console.log('Extracted currentUserId:', currentUserId)
      } catch (err) {
        console.error('Failed to decode token payload:', err)
      }
    } else {
      console.warn('Missing or invalid token.')
    }


    const phones = (await getAllPhones()).data.data

    const rawPhoneData = await Promise.all(phones.map(async phone => {
  const allComments = (await getReviewsByPhone(phone._id)).data.data

  const userComments = allComments.filter(comment => {
    if (!comment.reviewer || !currentUserId) return false

    const reviewerId = (
      comment.reviewer._id ?? comment.reviewer
    )?.toString?.()

    return reviewerId === currentUserId
  })

  return {
    id: phone._id,
    title: phone.title,
    brand: phone.brand,
    price: phone.price,
    description: phone.description,
    comments: userComments
  }
}))

// ✅ 只保留有你评论的手机
this.phonesWithComments = rawPhoneData.filter(phone => phone.comments.length > 0)

  } catch (err) {
    this.error = err.response?.data?.message || 'Failed to load comments.'
  }
}
,
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('/dashboard')
    },
    async toggleHidden(phoneId, commentId, hide) {
    console.log('[toggleHidden] phoneId:', phoneId, 'commentId:', commentId, 'hide:', hide)

   
    if (!phoneId || !commentId) {
      console.error('[toggleHidden] Invalid phoneId or commentId. Aborting.')
      return
    }

    try {
      if (hide) {
        await hideReview(phoneId, commentId)
      } else {
        await unhideReview(phoneId, commentId)
      }

      const phone = this.phonesWithComments.find(p => p.id === phoneId)
      if (phone) {
        phone.comments = phone.comments.map(c =>
          c._id === commentId ? { ...c, hidden: hide } : c
        )
      }
    } catch (err) {
      this.error = err.response?.data?.message || 'Failed to update visibility.'
      console.error('[toggleHidden] Error:', err)
    }
  }
  ,
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString()
    }
  }
}
</script>

<style scoped>
.comments-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: sans-serif;
  position: relative;
}
.logout-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.phone-section {
  margin-bottom: 32px;
}
.phone-info p {
  margin: 4px 0;
}
.comment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}
.comment-table th,
.comment-table td {
  border: 1px solid #ccc;
  padding: 8px;
}
.comment-table th {
  background-color: #f5f5f5;
}
.toggle-btn {
  padding: 4px 8px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.no-data,
.no-comments {
  color: #888;
  font-style: italic;
}
.error-msg {
  color: #e74c3c;
  text-align: center;
  margin-top: 20px;
}
.phone-title {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
}
</style>