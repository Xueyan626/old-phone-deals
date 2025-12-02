<template>
  <div class="admin-reviews">
    <h2>Review Moderation</h2>

    
    <input
      v-model="filter"
      placeholder="Search by content, author or listing"
    />

    
    <p v-if="error" class="error">{{ error }}</p>

    
    <table v-if="!error && pagedReviews.length">
      <thead>
        <tr>
          <th @click="sortBy('comment')">Content</th>
          <th @click="sortBy('author')">Author</th>
          <th @click="sortBy('listingTitle')">Listing</th>
          <th @click="sortBy('hidden')">Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in pagedReviews" :key="r.reviewId">
          <td>{{ r.comment }}</td>
          <td>{{ r.author }}</td>
          <td>{{ r.listingTitle }}</td>
          <td>{{ r.hidden ? 'Hidden' : 'Visible' }}</td>
          <td>
            <button @click="toggleVisibility(r)">
              {{ r.hidden ? 'Show' : 'Hide' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    
    <p v-if="!error && !pagedReviews.length" class="no-results">
      No reviews found.
    </p>

    
    <Pagination
      v-if="!error"
      :total="filteredReviews.length"
      :per-page="perPage"
      v-model:page="page"
    />
  </div>
</template>

<script>
import api from '@/api/api.js'
import Pagination from './Pagination.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'AdminReviews',
  components: { Pagination },
  data() {
    return {
      reviews: [],       
      filter: '',
      sortKey: '',
      sortAsc: true,
      page: 1,
      perPage: 10,
      error: ''
    }
  },
  computed: {
    filteredReviews() {
      const term = this.filter.trim().toLowerCase()
      if (!term) return this.reviews
      return this.reviews.filter(r =>
        r.comment.toLowerCase().includes(term) ||
        r.author.toLowerCase().includes(term) ||
        r.listingTitle.toLowerCase().includes(term)
      )
    },
    sortedReviews() {
      const arr = [...this.filteredReviews]
      if (!this.sortKey) return arr
      return arr.sort((a, b) => {
        let av = a[this.sortKey]
        let bv = b[this.sortKey]
        if (this.sortKey === 'hidden') {
          av = av ? 1 : 0
          bv = bv ? 1 : 0
        } else {
          av = ('' + av).toLowerCase()
          bv = ('' + bv).toLowerCase()
        }
        const cmp = av > bv ? 1 : av < bv ? -1 : 0
        return this.sortAsc ? cmp : -cmp
      })
    },
    pagedReviews() {
      const start = (this.page - 1) * this.perPage
      return this.sortedReviews.slice(start, start + this.perPage)
    }
  },
  async created() {
    await this.fetchReviews()
  },
  methods: {
    sortBy(key) {
      this.sortAsc = this.sortKey === key ? !this.sortAsc : true
      this.sortKey = key
    },

    async fetchReviews() {
      this.error = ''
      try {
       
        const res = await api.get('/admin/reviews')
        if (res.data.success) {
          this.reviews = res.data.data.map(r => ({
           
            phoneId:     r.phoneId,      
            reviewer:    r.reviewer,          
            comment:     r.comment,
            listingTitle:r.phoneTitle,
            hidden:      r.hidden,
            date:        r.date || null,
            author:
              r.reviewer && typeof r.reviewer === 'object'
                ? `${r.reviewer.firstname || ''} ${r.reviewer.lastname || ''}`.trim()
                : (r.reviewer || 'Unknown')
          }))
        } else {
          this.error = res.data.message || 'Failed to load reviews'
        }
      } catch (err) {
        console.error(err)
        this.error = err.response?.status === 401
          ? 'Unauthorized: please log in as admin'
          : 'Error fetching reviews'
      }
    },

    async toggleVisibility(r) {
  try {
    const reviewerId = typeof r.reviewer === 'object' && r.reviewer !== null
      ? r.reviewer._id
      : r.reviewer;

    if (!reviewerId || !r.phoneId || !r.comment) {
      console.warn('[toggleVisibility] Missing fields:', {
        reviewer: r.reviewer,
        phoneId: r.phoneId,
        comment: r.comment
      });
      ElMessage.error('Missing data');
      return;
    }

    await api.patch('/admin/reviews/toggle', {
      phoneId: r.phoneId,
      reviewerId,
      comment: r.comment
    });

    r.hidden = !r.hidden;
    ElMessage.success(`Review is now ${r.hidden ? 'hidden' : 'visible'}`);
  } catch (err) {
    console.error('[toggleVisibility] Failed:', err);
    ElMessage.error('Failed to toggle visibility');
  }
}



  }
}
</script>

<style scoped>
.admin-reviews {
  font-family: sans-serif;
  padding: 1rem;
}
input {
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: #d9534f;
  margin: 0.5rem 0;
}
.no-results {
  font-style: italic;
  color: #666;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  background: #f0f0f0;
  cursor: pointer;
}
button {
  padding: 4px 8px;
  margin-right: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

  