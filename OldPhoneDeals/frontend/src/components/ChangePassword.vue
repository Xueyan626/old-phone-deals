<template>
  <div class="change-password">
    <h2>Change Password</h2>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          v-model="currentPassword"
          placeholder="Enter current password"
          required
        />

        <label for="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          v-model="newPassword"
          placeholder="Enter new password"
          required
        />
      </div>

      <div class="actions">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Submitting...' : 'Confirm Change' }}
        </button>
      </div>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>


<script>
import { getProfile, updatePassword } from '@/api/api.js'

export default {
  name: 'ChangePassword',
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      userEmail: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  async mounted() {
    try {
      const res = await getProfile()
      if (res.data.success) {
        this.userEmail = res.data.data.email
      }
    } catch (e) {
      console.warn('Failed to get user email for notification purpose', e)
    }
  },
  methods: {
    logout() {
      // Clear token and redirect to dashboard
      sessionStorage.removeItem('token')
      this.$router.push('/dashboard')
    },

    async onSubmit() {
      this.error = ''
      this.success = ''
      this.loading = true

      try {
        const res = await updatePassword({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        })

        if (!res.data.success) {
          this.error = res.data.message || 'Password change failed.'
          return
        }

        this.success = 'Password changed successfully.'
        this.currentPassword = ''
        this.newPassword = ''
      } catch (err) {
        this.error = err.response?.data?.message || 'Request failed. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.change-password {
  max-width: 480px;
  margin: 60px auto;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  color: #2c3e50;
}

h2 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  color: #1f2d3d;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

button {
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  background: #67c23a;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.error,
.success {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
}

.error {
  color: #f56c6c;
}

.success {
  color: #67c23a;
}
</style>

