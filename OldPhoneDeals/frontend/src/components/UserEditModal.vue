<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Edit User</h3>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            v-model="form.firstname"
            required
          />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            v-model="form.lastname"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
          />
        </div>

        <div class="actions">
          <button type="submit" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button type="button" @click="$emit('close')">
            Cancel
          </button>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import { adminUpdateUser } from '@/api/api'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserEditModal',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        _id:       this.user._id,
        firstname: this.user.firstname,
        lastname:  this.user.lastname,
        email:     this.user.email
      },
      saving: false,
      error: ''
    }
  },
  methods: {
    async save() {
      this.saving = true
      this.error = ''
      try {
        const res = await adminUpdateUser(this.form._id, {
        firstname: this.form.firstname,
        lastname: this.form.lastname,
        email: this.form.email
    })

        if (res.data.success) {
          ElMessage.success('User updated successfully')
          this.$emit('save')
          this.$emit('close')
        } else {
          throw new Error(res.data.message || 'Update failed')
        }
        
      } catch (err) {
        console.error(err)
        this.error =
          err.response?.data?.message ||
          err.message ||
          'Failed to update user'
        ElMessage.error(this.error)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: #fff; padding: 20px; border-radius: 4px;
  width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.form-group {
  margin-bottom: 12px;
  display: flex; flex-direction: column;
}
.form-group label {
  margin-bottom: 4px;
  font-weight: 500;
}
.form-group input {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.actions {
  display: flex; justify-content: flex-end; gap: 8px;
  margin-top: 16px;
}
.actions button {
  padding: 6px 12px; border: none; border-radius: 4px;
  cursor: pointer;
}
.actions button:disabled {
  opacity: 0.6; cursor: not-allowed;
}
.error {
  color: #d9534f;
  margin-top: 8px;
  text-align: center;
}
</style>
  