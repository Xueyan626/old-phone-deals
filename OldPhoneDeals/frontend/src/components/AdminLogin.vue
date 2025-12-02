<template>
  <div class="page-wrapper">
    <div class="login-container">
      <h2>Admin Login</h2>
      <el-form @submit.prevent="handleAdminLogin" :model="form">
        <el-form-item>
          <el-input v-model="form.email" placeholder="Admin Email" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" placeholder="Password" type="password" />
        </el-form-item>
        <el-button type="primary" @click="handleAdminLogin" class="btn">Login</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/api';

const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const handleAdminLogin = async () => {
  if (!form.value.email || !form.value.password) {
    ElMessage.error('Email and password cannot be empty.');
    return;
  }
  try {
    const res = await login(form.value);

    if (!res.data.isAdmin) {
      ElMessage.error('This is not an admin account.');
      return;
    }

    // localStorage.setItem('token', res.data.token);
    // localStorage.setItem('isAdmin', res.data.isAdmin);

    sessionStorage.setItem('token', res.data.token);
    sessionStorage.setItem('isAdmin', res.data.isAdmin);
  
    ElMessage.success('Admin login successful!');
      router.push('/admin');
    } catch (error) {
      ElMessage.error(error.response?.data?.message || 'Login failed.');
    }
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/images/background.jpg') no-repeat center center fixed;
  background-size: cover;
}

.login-container {
  width: 100%;
  max-width: 420px;
  padding: 30px 25px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #c0392b; 
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input__inner {
  border-radius: 8px !important;
  padding: 12px 14px;
  font-size: 15px;
}

.el-input__inner:focus {
  border-color: #c0392b;
  box-shadow: 0 0 5px rgba(192, 57, 43, 0.4);
}

.btn {
  width: 100%;
  padding: 12px 0;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  transition: all 0.3s ease;
  font-size: 16px;
}

.btn:hover {
  background: linear-gradient(135deg, #c0392b, #e74c3c);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.2);
}

.link {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.link a {
  color: #e74c3c;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}
</style>
