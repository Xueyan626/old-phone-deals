<template>
  <div class="admin-users">
    <h2>User Management</h2>


    <input
      v-model="filter"
      placeholder="Search users by name or email"
    />


    <p v-if="error" class="error">{{ error }}</p>


    <table v-if="!error && pagedUsers.length">
      <thead>
        <tr>
          <th style="width: 30%" @click="sort('fullName')">Full Name</th>
          <th style="width: 30%" @click="sort('email')">Email</th>
          <th style="width: 10%">Status</th>
          <th style="width: 30%">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in pagedUsers" :key="user._id">
          <td>{{ user.firstname }} {{ user.lastname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.disabled ? 'Disabled' : 'Active' }}</td>
          <td>
            <button @click="edit(user)">Edit</button>
            <button @click="toggleDisable(user)">
              {{ user.disabled ? 'Enable' : 'Disable' }}
            </button>
            <button @click="deleteUser(user)">Delete</button>
            <button @click="viewListings(user)">Listings</button>
            <button @click="viewReviews(user)">Reviews</button>
          </td>
        </tr>
      </tbody>
    </table>


    <p v-if="!error && !pagedUsers.length" class="no-results">
      No users found.
    </p>


    <Pagination
      v-if="!error"
      :total="sortedUsers.length"
      :per-page="perPage"
      v-model:page="page"
    />


    <UserEditModal
      v-if="editing && selected"
      :user="selected"
      @save="onUserSaved"
      @close="closeEdit"
    />
  </div>
</template>

<script>
import api from '@/api/api.js'
import { adminUpdateUser } from '@/api/api'
import Pagination from './Pagination.vue'
import UserEditModal from './UserEditModal.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'AdminUsers',
  components: { Pagination, UserEditModal },
  data() {
    return {
      users: [],
      filter: '',
      sortKey: '',
      sortAsc: true,
      page: 1,
      perPage: 10,
      editing: false,
      selected: null,
      error: ''
    }
  },
  watch: {
    filter() {
      this.page = 1
    }
  },
  computed: {
  
    filteredUsers() {
      const all = Array.isArray(this.users) ? this.users : []
      const term = this.filter.trim().toLowerCase()
      if (!term) return all
      return all.filter(u => {
        const full = `${u.firstname} ${u.lastname}`.toLowerCase()
        return (
          full.includes(term) ||
          (u.email || '').toLowerCase().includes(term)
        )
      })
    },
    sortedUsers() {
      const arr = Array.isArray(this.filteredUsers)
        ? [...this.filteredUsers]
        : []
      if (!this.sortKey) return arr
      return arr.sort((a, b) => {
        let av, bv
        if (this.sortKey === 'fullName') {
          av = `${a.firstname} ${a.lastname}`.toLowerCase()
          bv = `${b.firstname} ${b.lastname}`.toLowerCase()
        } else if (this.sortKey === 'lastLogin') {
          av = new Date(a.lastLogin).getTime()
          bv = new Date(b.lastLogin).getTime()
        } else {
          av = ('' + a[this.sortKey]).toLowerCase()
          bv = ('' + b[this.sortKey]).toLowerCase()
        }
        const cmp = av > bv ? 1 : av < bv ? -1 : 0
        return this.sortAsc ? cmp : -cmp
      })
    },
    pagedUsers() {
      const arr = Array.isArray(this.sortedUsers)
        ? this.sortedUsers
        : []
      const start = (this.page - 1) * this.perPage
      return arr.slice(start, start + this.perPage)
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    formatDate(ts) {
      return ts ? new Date(ts).toLocaleString() : '-'
    },
    async fetchUsers() {
      this.error = ''
      try {
        const res = await api.get('/admin/users')
        if (res.data.success) {
          this.users = res.data.data
        } else {
          this.error = res.data.message || 'Failed to load users'
        }
      } catch (err) {
        this.error = err.response?.status === 403
          ? 'Permission denied: Admins only'
          : 'Error loading users'
        console.error(err)
      }
    },
    sort(key) {
      this.sortAsc = this.sortKey === key ? !this.sortAsc : true
      this.sortKey = key
    },
    edit(user) {
      this.selected = { ...user }
      this.editing = true
    },
    closeEdit() {
      this.editing = false
      this.selected = null
    },
    async onUserSaved() {
      await this.fetchUsers()
      this.closeEdit()
      //ElMessage.success('User updated successfully')
    },
    async toggleDisable(user) {
      const action = user.disabled ? 'Enable' : 'Disable'
      if (!confirm(`${action} this user?`)) return
      try {
        await api.patch(`/admin/users/disable/${user._id}`)
        user.disabled = !user.disabled
        ElMessage.success(`User ${action.toLowerCase()}d successfully`)
      } catch (err) {
        console.error(err)
        ElMessage.error(`Failed to ${action.toLowerCase()} user`)
      }
    },
    async deleteUser(user) {
      if (!confirm('Delete this user?')) return
      try {
        
        await api.delete(`/admin/users/${user._id}`)
        this.users = this.users.filter(u => u._id !== user._id)
        ElMessage.success('User removed from list')
      } catch (err) {
        console.error(err)
        ElMessage.error('Failed to delete user')
      }
    },
    viewListings(user) {
      this.$router.push({
        name: 'UserListings',
        params: {id: user._id},
        query:{fullName: `${user.firstname} ${user.lastname}`}
      })
    },
    viewReviews(user) {
      this.$router.push({ name: 'UserReviews', params: { id: user._id } })
    }
  }
}
</script>

<style scoped>
.admin-users {
  font-family: sans-serif;
  padding: 1rem;
}
input {
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  box-sizing: border-box;
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
}
th {
  background: #f0f0f0;
  cursor: pointer;
}
button {
  margin-right: 6px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
  