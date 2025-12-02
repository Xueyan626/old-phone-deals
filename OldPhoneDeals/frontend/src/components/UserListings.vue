<!-- <template>
  <div class="user-listings">
    <h2>{{ fullName }}'s phone listings</h2>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="!phones.length">This user sells nothing</p>

    <table v-else>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="phone in phones" :key="phone._id">
          <td>
            <router-link :to="{ name: 'ItemPage', params: { id: phone._id } }">
              {{ phone.title }}
            </router-link>
          </td>
          <td>{{ formatCurrency(phone.price) }}</td>
          <td>{{ phone.disabled ? 'Disabled' : 'Active' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute }   from 'vue-router'
import api             from '@/api/api.js'            // 带 token 拦截器的 axios
import { getAllPhones } from '@/api/api' // GET /api/phones

// 1. 从路由的 query 或 params 拿到 fullName
const route     = useRoute()
const fullName  = route.query.fullName || ''
// 拆分 first/last
const [first, last] = fullName.split(' ')

const phones = ref([])
const error  = ref('')

onMounted(async () => {
  try {
    // 2. 拉所有用户（管理员接口）
    const usersRes = await api.get('/admin/users')
    const users = usersRes.data.data

    // 3. 找到和 fullName 完全匹配的用户
    const user = users.find(u =>
      u.firstname === first && u.lastname === last
    )
    if (!user) {
      error.value = '找不到该用户'
      return
    }
    const userId = user._id

    // 4. 拉所有手机并按 seller 过滤
    const phonesRes = await getAllPhones()
    phones.value = phonesRes.data.data.filter(p => {
      const sid = typeof p.seller === 'string'
        ? p.seller
        : p.seller?._id
      return sid === userId
    })
  } catch (err) {
    console.error(err)
    error.value = '加载失败，请稍后重试'
  }
})

// 简单货币格式化
function formatCurrency(v) {
  return typeof v === 'number' ? '£' + v.toFixed(2) : v
}
</script>

<style scoped>
.user-listings { padding: 1rem; font-family: sans-serif; }
.error        { color: #d9534f; margin-bottom: 1rem; }
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
}
th { background: #f9f9f9; text-align: left; }
router-link {
  color: #409EFF;
  text-decoration: none;
}
</style> -->
<template>
    <div class="admin-section">
      <h2>{{ user.firstname }} {{ user.lastname }}'s Phone Listings</h2>
      <table v-if="phones.length > 0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Disabled</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="phone in phones" :key="phone._id">
            <td>{{ phone.title }}</td>
            <td>{{ phone.brand }}</td>
            <td>${{ phone.price }}</td>
            <td>{{ phone.stock }}</td>
            <td>{{ phone.disabled ? 'Yes' : 'No' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-data">This user doesn't sell any phones.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getUserListingsByAdmin } from '@/api/api'
  
  const route = useRoute()
  const phones = ref([])
  const user = ref({ firstname: '', lastname: '' })
  
  onMounted(async () => {
    try {
      const userId = route.params.id
      const res = await getUserListingsByAdmin(userId)
  
      console.log('response data:', res.data)
  
      if (res.data && res.data.success) {
        phones.value = res.data.data || []
        user.value = res.data.user || { firstname: '', lastname: '' }
  
        console.log('✅ 绑定成功，phones.length:', phones.value.length)
      } else {
        console.warn('❗ API 响应结构不符:', res.data)
      }
    } catch (err) {
      console.error('❌ 请求失败:', err)
    }
  })
  </script>
  
  <style scoped>
  .admin-section {
    padding: 20px;
  }
  .admin-section table {
    width: 100%;
    border-collapse: collapse;
  }
  .admin-section th,
  .admin-section td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  .no-data {
    color: #888;
    margin-top: 10px;
  }
  </style>