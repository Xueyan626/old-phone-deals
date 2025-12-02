<template>
  <div class="page-wrapper">
    <div class="register-container">
      <h2>Reset Password</h2>
      <p style="margin-bottom: 20px; color: #888;">
        Enter your registered email and we’ll send you a link to reset your password.
      </p>
      <el-form :model="form" label-position="top">
        <el-form-item label="Email">
          <el-input v-model="form.email" placeholder="Enter your email" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleResetRequest">Send Reset Link</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'; 
import axios from 'axios';

const router = useRouter();             
const form = ref({ email: '' });

const handleResetRequest = async () => {
  if (!form.value.email.trim()) {
    ElMessage.warning('Email is required.');
    return;
  }
  try {
    await axios.post('http://localhost:3000/api/auth/reset-request', {
      email: form.value.email
    });
    ElMessage.success('Reset link sent. Please check your email.');

    router.push({
      path: '/check-email',
      query: {
        email: form.value.email,
        mode: 'reset'
      }
    });
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Request failed.');
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

.register-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border-radius: 8px;
  background: #f8f8f8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>