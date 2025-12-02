<template>
  <div class="edit-phone">
    <h2>Edit Listing #{{ id }}</h2>

    <div v-if="loading">Loading…</div>
    <div v-else>
      <form @submit.prevent="confirmSave">
        <div>
          <label>Title</label>
          <input v-model="form.title" />
        </div>
        <div>
          <label>Brand</label>
          <input v-model="form.brand" />
        </div>
        <div>
          <label>Price</label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label>Stock</label>
          <input v-model.number="form.stock" type="number" />
        </div>
        <button type="submit">Save</button>
        <button type="button" @click="$router.back()">Cancel</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/api/api.js'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AdminPhoneEdit',
  props: ['id'],
  data() {
    return {
      form: {
        title: '',
        brand: '',
        price: 0,
        stock: 0
      },
      loading: true,
      error: ''
    }
  },
  async created() {
    try {
      this.loading = true
      const res = await api.get(`/phones/${this.id}`)
      const data = res.data.data || res.data
      this.form.title = data.title
      this.form.brand = data.brand
      this.form.price = data.price
      this.form.stock = data.stock
    } catch (err) {
      console.error(err)
      this.error = 'Failed：' + (err.response?.data?.message || err.message)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async confirmSave() {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to save changes to this listing?',
          'Confirm Save',
          {
            confirmButtonText: 'Yes, Save',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        )
        await this.save()
      } catch (err) {
        if (err !== 'cancel') {
          console.error(err)
          ElMessage.error('operate failed')
        }
      }
    },

    async save() {
      try {
        await api.put(`/phones/${this.id}`, this.form)
        ElMessage.success('update success')
        this.$router.push({ name: 'AdminListings' })
      } catch (err) {
        console.error(err)
        ElMessage.error('failed to save：' + (err.response?.data?.message || err.message))
      }
    }
  }
}
</script>

<style scoped>
.edit-phone {
  max-width: 500px;
  margin: 2rem auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 2rem;
  font-family: Arial, sans-serif;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
}

.edit-phone form > div {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.edit-phone label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #555;
}

.edit-phone input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.edit-phone input:focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64,158,255,0.2);
  outline: none;
}

.edit-phone button {
  padding: 0.6rem 1.2rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-phone button[type="submit"] {
  background-color: #409eff;
  color: #fff;
}

.edit-phone button[type="submit"]:hover {
  background-color: #66b1ff;
}

.edit-phone button[type="button"] {
  background-color: #f0f0f0;
  color: #333;
}

.edit-phone button[type="button"]:hover {
  background-color: #dcdfe6;
}

.error {
  margin-top: 1rem;
  color: #e74c3c;
  text-align: center;
}
</style>
  