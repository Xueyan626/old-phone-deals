<template>
  <div class="page-wrapper">
    <div class="register-container">
      <h2>Reset Password</h2>
      <el-form :model="form" label-position="top">
        <el-form-item label="New Password">
          <el-input v-model="form.newPassword" type="password" placeholder="Enter new password" />
          <div class="password-note">
            Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
          </div>
          <div class="strength-text" :class="strengthClass">{{ strengthText }}</div>
        </el-form-item>

        <el-form-item label="Confirm Password">
          <el-input v-model="form.confirmPassword" type="password" placeholder="Confirm password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleReset">Reset Password</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const token = route.params.token;

const form = ref({
  newPassword: '',
  confirmPassword: ''
});

const strengthText = ref('');
const strengthClass = ref('');


watch(() => form.value.newPassword, (val) => {
  if (!val) {
    strengthText.value = '';
    strengthClass.value = '';
    return;
  }

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[\W_]/.test(val)) score++;

  if (score <= 2) {
    strengthText.value = 'Weak';
    strengthClass.value = 'weak';
  } else if (score === 3 || score === 4) {
    strengthText.value = 'Medium';
    strengthClass.value = 'medium';
  } else {
    strengthText.value = 'Strong';
    strengthClass.value = 'strong';
  }
});

const handleReset = async () => {
  const { newPassword, confirmPassword } = form.value;

  if (!newPassword || !confirmPassword) {
    ElMessage.warning('Please fill in all fields.');
    return;
  }

  if (newPassword !== confirmPassword) {
    ElMessage.error('Passwords do not match.');
    return;
  }

  if (strengthText.value === 'Weak') {
    ElMessage.warning('Please use a stronger password.');
    return;
  }

  try {
    await axios.post('http://localhost:3000/api/auth/reset-password', {
      token,
      newPassword
    });

    ElMessage.success('Password reset successfully. Please log in.');
    router.push('/login');
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Reset failed.');
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

.password-note {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.strength-text {
  margin-top: 5px;
  font-size: 13px;
  font-weight: bold;
}

.weak {
  color: red;
}

.medium {
  color: orange;
}

.strong {
  color: green;
}
</style>
