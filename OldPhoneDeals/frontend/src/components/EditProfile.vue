<template>
  <div class="edit-profile">
    <h2>Edit Profile</h2>

    <form @submit.prevent="changePassword ? confirmUpdate() : beginUpdate()">
      <!-- Basic Information -->
      <div class="form-group">
        <label for="firstname">First Name</label>
        <input id="firstname" v-model="user.firstname" required />

        <label for="lastname">Last Name</label>
        <input id="lastname" v-model="user.lastname" required />

        <label for="email">Email</label>
        <input id="email" v-model="user.email" type="email" required />
      </div>

      <!-- Step 1: show Update Profile button -->
      <div v-if="!changePassword" class="actions">
        <button type="button" @click="beginUpdate" :disabled="loading">
          Update Profile
        </button>
      </div>

      <!-- Step 2: show password input and Confirm/Cancel -->
      <div v-else class="form-group">
        <label for="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          v-model="password"
          type="password"
          required
        />

        <div class="actions">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Saving...' : 'Confirm Update' }}
          </button>
          <button type="button" @click="cancelUpdate" :disabled="loading">
            Cancel
          </button>
        </div>
      </div>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Profile updated successfully!</p>
  </div>
</template>

<script>
import { getProfile, updateProfile } from '@/api/api.js'

export default {
  name: 'EditProfile',
  data() {
    return {
      user: { firstname: '', lastname: '', email: '' },
      password: '',
      changePassword: false,
      loading: false,
      error: '',
      success: false
    }
  },
  async mounted() {
    this.loading = true
    try {
      const res = await getProfile()
      if (res.data.success) {
        Object.assign(this.user, res.data.data)
      } else {
        this.error = res.data.message || 'Unable to load profile'
      }
    } catch {
      this.error = 'Unable to load profile'
    } finally {
      this.loading = false
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('/dashboard')
    },
    beginUpdate() {
      this.error = ''
      this.success = false
      this.changePassword = true
    },
    cancelUpdate() {
      this.changePassword = false
      this.password = ''
      this.error = ''
    },
    async confirmUpdate() {
      this.error = ''
      this.success = false
      this.loading = true
      try {
        const res = await updateProfile({
          firstname: this.user.firstname,
          lastname:  this.user.lastname,
          email:     this.user.email,
          password:  this.password
        })
        if (!res.data.success) {
          this.error = res.data.message
        } else {
          this.success = true
          this.changePassword = false
          this.password = ''
        }
      } catch {
        this.error = 'Update failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.edit-profile {
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
  gap: 10px;
  margin-top: 16px;
  justify-content: center;
}

button {
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button[type="button"] {
  background: #409eff;
  color: white;
}

button[type="submit"] {
  background: #67c23a;
  color: white;
}

button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.error, .success {
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