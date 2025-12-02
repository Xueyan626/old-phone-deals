<template>
  <div class="admin-phones">
    <h2>Listing Management</h2>

    <input
      v-model="filter"
      placeholder="Search listings by title or brand"
    />

    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="sortedListings.length">
      <thead>
        <tr>
          <th style="width: 60%" @click="changeSort('title')">Title</th>
          <th style="width: 5%" @click="changeSort('brand')">Brand</th>
          <th style="width: 5%" @click="changeSort('price')">Price</th>
          <th style="width: 5%" @click="changeSort('stock')">Stock</th>
          <th style="width: 5%">Status</th>
          <th style="width: 20%">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sortedListings" :key="item._id">
          <td>{{ item.title }}</td>
          <td>{{ item.brand }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.disabled ? 'Disabled' : 'Active' }}</td>
          <td>
            <button @click="goEdit(item)">Edit</button>
            <button @click="viewReviews(item)">Reviews</button>
            <button @click="toggleStatus(item)">
              {{ item.disabled ? 'Enable' : 'Disable' }}
            </button>
            <button @click="deleteListing(item)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No listings found.</p>
  </div>
</template>

<script>
import api from '@/api/api.js'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AdminPhones',
  data() {
    return {
      listings: [],
      filter: '',
      error: null,
      sortKey: 'title',
      sortAsc: true,
    }
  },
  computed: {
    filteredListings() {
      const list = Array.isArray(this.listings) ? this.listings : []
      if (!this.filter) return list
      const term = this.filter.toLowerCase()
      return list.filter(item => {
        const priceStr = String(item.price).toLowerCase()
        const stockStr = String(item.stock).toLowerCase()
        return (
          item.title.toLowerCase().includes(term) ||
          item.brand.toLowerCase().includes(term) ||
          priceStr.includes(term) ||
          stockStr.includes(term)
        )
      })
    },
    sortedListings() {
      return [...this.filteredListings].sort((a, b) => {
        const r = a[this.sortKey] > b[this.sortKey] ? 1 : -1
        return this.sortAsc ? r : -r
      })
    }
  },
  created() {
    this.fetchListings()
  },
  methods: {
    async fetchListings() {
      try {
        const res = await api.get('/admin/phones')
        this.listings = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : []
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      }
    },

    changeSort(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc
      } else {
        this.sortKey = key
        this.sortAsc = true
      }
    },

    goEdit(item) {
      this.$router.push({
        name: 'AdminListingEdit',
        params: { id: item._id }
      })
    },

    viewReviews(item) {
      this.$router.push({
        name: 'AdminPhoneReviews',
        params: { id: item._id }
      })
    },

    async toggleStatus(item) {
      const action = item.disabled ? 'Enable' : 'Disable'
      try {
        await ElMessageBox.confirm(
          `Are you sure you want to ${action.toLowerCase()} this listing?`,
          `${action} Listing`,
          {
            confirmButtonText: action,
            cancelButtonText: 'Cancel',
            type: action === 'Disable' ? 'warning' : 'info',
          }
        )
        if (item.disabled) {
          await api.patch(`/admin/phones/enable/${item._id}`)
        } else {
          await api.patch(`/admin/phones/disable/${item._id}`)
        }
        item.disabled = !item.disabled
        ElMessage.success(`Listing ${action.toLowerCase()}d successfully`)
      } catch (err) {
        if (err !== 'cancel') {
          this.error = err.response?.data?.message || err.message
          ElMessage.error(`Failed to ${action.toLowerCase()} listing`)
        }
      }
    },

    async deleteListing(item) {
      try {
        await ElMessageBox.confirm(
          'This will permanently delete the listing. Continue?',
          'Delete Listing',
          {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        )
        await api.delete(`/admin/phones/${item._id}`)
        this.listings = this.listings.filter(i => i._id !== item._id)
        ElMessage.success('Listing deleted')
      } catch (err) {
        if (err !== 'cancel') {
          this.error = err.response?.data?.message || err.message
          ElMessage.error('Failed to delete listing')
        }
      }
    }
  }
}
</script>

<style scoped>
.admin-phones {
  padding: 1rem;
  font-family: sans-serif;
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

  