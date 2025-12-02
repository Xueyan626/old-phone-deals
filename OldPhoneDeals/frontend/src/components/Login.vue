<template>
  <div class="page-wrapper">
    <div class="login-container">
      <h2>Login</h2>
      <el-form @submit.prevent="handleLogin" :model="form">
        <el-form-item>
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" placeholder="Password" type="password" />
        </el-form-item>
        <el-button type="primary" @click="handleLogin" class="btn">Login</el-button>
        <p class="link">
          No account? <router-link to="/register">Register</router-link>
        </p>
        <p class="link">
          Forgot password? <router-link to="/reset-request">Reset here</router-link>
        </p>
      </el-form>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/api';
import { onMounted } from 'vue';

onMounted(() => {
  const query = new URLSearchParams(window.location.search);
  if (query.get('verified') === 'true') {
    ElMessage.success('Email verified successfully! You can now log in.');
  }
});


const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    ElMessage.error('Email and password cannot be empty.');
    return;
  }
  try {
    const res = await login(form.value);

    if (res.data.isAdmin) {
      ElMessage.error('Admin accounts must log in from the admin login page.');
      return;
    }

    // localStorage.setItem('token', res.data.token);
    // localStorage.setItem('isAdmin', res.data.isAdmin);

    sessionStorage.setItem('token', res.data.token);
    sessionStorage.setItem('isAdmin', res.data.isAdmin);

    sessionStorage.setItem('userId', res.data.userId);

    ElMessage.success('Login successful!');
    router.push('/dashboard'); 
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
  color: #333;
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
  border-color: #409EFF;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.4);
}

.btn {
  width: 100%;
  padding: 12px 0;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  color: white;
  transition: all 0.3s ease;
  font-size: 16px;
}

.btn:hover {
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.link {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.link a {
  color: #409EFF;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}
</style>