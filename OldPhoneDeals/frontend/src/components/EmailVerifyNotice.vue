<template>
  <div class="page-wrapper">
    <div class="register-container">
      <h2>Check your email</h2>
      <p>You're nearly done. We’ve sent a verification email to:</p>
      <p class="highlight">{{ email }}</p>
      <p>Please check your inbox and spam folder to verify your account.</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const email = route.query.email || 'your email';
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
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

p {
  font-size: 15px;
  margin-bottom: 10px;
  color: #444;
}

.highlight {
  font-weight: bold;
  color: #000;
  margin: 10px 0;
}
</style>
