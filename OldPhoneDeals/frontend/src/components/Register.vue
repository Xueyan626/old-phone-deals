<template>
  <div class="page-wrapper">
  <div class="register-container">
    <h2>Register</h2>
    <p style="margin-bottom: 20px; color: #888;">
  You will receive a verification email after signing up. Please verify before logging in.
    </p>
    <el-form :model="form" label-position="top">
      <el-form-item label="First Name">
        <el-input v-model="form.firstname" placeholder="Enter first name" />
      </el-form-item>
      <el-form-item label="Last Name">
        <el-input v-model="form.lastname" placeholder="Enter last name" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" placeholder="Enter email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" placeholder="Enter password" />
        <div class="password-note">
          Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
        </div>
        <div class="strength-text" :class="strengthClass">{{ strengthText }}</div>
      </el-form-item>
      <el-form-item label="Confirm Password">
        <el-input v-model="form.confirmPassword" type="password" placeholder="Confirm password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleRegister">Register</el-button>
      </el-form-item>
    </el-form>

    <p style="margin-top: 10px;">Already have an account? <router-link to="/login">Login here</router-link></p>
  </div>
</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { register } from '@/api/api';

const router = useRouter();

const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const strengthText = ref('');
const strengthClass = ref('');


watch(() => form.value.password, (val) => {
  if (!val) {
    strengthText.value = '';
    strengthClass.value = '';
    return;
  }

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[\W_]/.test(val)) score++;

  if (score <= 1) {
    strengthText.value = 'Weak';
    strengthClass.value = 'weak';
  } else if (score === 2 || score === 3) {
    strengthText.value = 'Medium';
    strengthClass.value = 'medium';
  } else {
    strengthText.value = 'Strong';
    strengthClass.value = 'strong';
  }
});


const handleRegister = async () => {
  const { firstname, lastname, email, password, confirmPassword } = form.value;

  if (
  !firstname.trim() || 
  !lastname.trim() || 
  !email.trim() || 
  !password.trim() || 
  !confirmPassword.trim()
) {
  ElMessage.error('All fields must be filled. No empty or blank values allowed.');
  return;
}



  if (password !== confirmPassword) {
    ElMessage.error('Passwords do not match.');
    return;
  }

  if (strengthText.value === 'Weak') {
    ElMessage.warning('Please use a stronger password.');
    return;
  }

  try {
    await register({ firstname, lastname, email, password });
    ElMessage.success('Registration successful! Please check your email to verify your account.');
    
    

    router.push({
      path: '/verify',
      query: { email }  
    });
  
    form.value = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Registration failed.');
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
