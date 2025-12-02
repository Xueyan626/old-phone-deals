<template>
  <div class="manage-list">

    <h2>Manage Your Phone Listings</h2>
    <button @click="showAddForm = !showAddForm" class="toggle-btn">
      {{ showAddForm ? 'Cancel' : 'Add New Phone' }}
    </button>

    <form v-if="showAddForm" @submit.prevent="addItem" class="add-form">
      <div class="form-group">
        <label>Title</label>
        <input v-model="newItem.title" required />
      </div>
      <div class="form-group">
        <label>Brand</label>
        <input v-model="newItem.brand" required />
      </div>
      <div class="form-group">
        <label>Brand Image</label>
        <input type="file" accept="image/*" @change="onFileChange" />
      </div>
      <div class="form-group">
        <label>Price</label>
        <input v-model.number="newItem.price" type="number" min="0" required />
      </div>
      <div class="form-group">
        <label>Stock</label>
        <input v-model.number="newItem.stock" type="number" min="0" required />
      </div>
      <div class="form-group">
        <label>Description</label>
        <input v-model="newItem.description" />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Phone' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="items.length">
      <thead>
        <tr>
          <th>Title</th><th>Brand</th><th>Price</th><th>Stock</th><th>Description</th><th>Enabled</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="phone in items" :key="phone._id">
          <td>{{ phone.title }}</td>
          <td>{{ phone.brand }}</td>
          <td>{{ phone.price.toFixed(2) }}</td>
          <td>{{ phone.stock }}</td>
          <td>{{ phone.description }}</td>
          <td>
            <input type="checkbox" :checked="!phone.disabled" @change="toggleItem(phone)" />
          </td>
          <td>
            <button @click="deleteItem(phone)" :disabled="loading">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="no-items">No phones found. Add one above.</p>
  </div>
</template>

<script>
import {
  getAllPhones,
  createPhone,
  disablePhone,
  enablePhone,
  deletePhone
} from '@/api/api'

export default {
  name: 'ManageListings',
  data() {
    return {
      items: [],
      showAddForm: false,
      newItem: { title: '', brand: '', price: 0, stock: 0, description: '' },
      imageFile: null,
      loading: false,
      error: '',
      currentUserId: null
    };
  },
  async created() {
    
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserId = String(payload.id);
      }
    } catch {
      this.currentUserId = null;
    }
    await this.fetchItems();
  },
  methods: {
    logout() {
      sessionStorage.removeItem('token');
      this.$router.push('/dashboard');
    },
    async fetchItems() {
      this.error = ''
      try {
        const { data } = await getAllPhones()
        console.log('[fetchItems] phones:', data.data)
        console.log('[fetchItems] currentUserId:', this.currentUserId)

        this.items = data.data.filter(p => {
          if (!p.seller) {
            console.warn('[fetchItems] Skipping phone with null seller:', p.title)
            return false
          }

          const sellerId = typeof p.seller === 'object' ? p.seller._id : p.seller
          console.log('Comparing seller:', sellerId, 'with currentUserId:', this.currentUserId)

          return String(sellerId) === String(this.currentUserId)
        })

        console.log('[fetchItems] Filtered items:', this.items)
      } catch (e) {
        console.error('[fetchItems] Error occurred:', e)
        this.error = e.response?.data?.message || 'Failed to load'
      }
    }

,
    onFileChange(e) {
      this.imageFile = e.target.files[0] || null;
    },
    async addItem() {
      this.error = '';
      this.loading = true;
      try {
        const form = new FormData();
        Object.entries(this.newItem).forEach(([k, v]) => form.append(k, v));
        if (this.imageFile) form.append('image', this.imageFile);

        
        const { data } = await createPhone(form);
        const created = data.data;
        
        // if (String(created.seller || created.owner?._id) === String(this.currentUserId)) {
        //   this.items.unshift(created);
        // }
        const sellerId = typeof created.seller === 'object' ? created.seller._id : created.seller

        if (String(sellerId) === String(this.currentUserId)) {
          this.items.unshift(created)
        }

        this.showAddForm = false;
        this.newItem = { title: '', brand: '', price: 0, stock: 0, description: '' };
        this.imageFile = null;
      } catch (e) {
        this.error = e.response?.data?.message || 'Add failed';
      } finally {
        this.loading = false;
      }
    },
    async toggleItem(phone) {
      this.error = '';
      this.loading = true;
      try {
        if (phone.disabled) {
          await enablePhone(phone._id);
        } else {
          await disablePhone(phone._id);
        }
        phone.disabled = !phone.disabled;
      } catch (e) {
        this.error = e.response?.data?.message || 'Update failed';
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(phone) {
      if (!confirm(`Delete \"${phone.title}\"?`)) return;
      this.error = '';
      this.loading = true;
      try {
        await deletePhone(phone._id);
        this.items = this.items.filter(p => p._id !== phone._id);
      } catch (e) {
        this.error = e.response?.data?.message || 'Delete failed';
      } finally {
        this.loading = false; 
      }
    }
  }
};
</script>



<style scoped>
.manage-list {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  position: relative;
  font-family: Arial, sans-serif;
}
.logout-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.toggle-btn {
  display: inline-block;
  margin-bottom: 15px;
  background: #409eff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.add-form {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 12px;
}
.form-group label {
  display: block;
  margin-bottom: 4px;
}
.form-group input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button[type="submit"] {
  background: #67c23a;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th,
td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  background: #f0f0f0;
}
.no-items {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
.error {
  color: #e74c3c;
  margin-top: 10px;
}
</style>
  