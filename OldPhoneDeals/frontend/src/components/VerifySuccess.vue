<template>
  <div class="page-wrapper">
    <div class="register-container">
      <h2> Email Verified Successfully!</h2>
      <p>Your email has been successfully verified.</p>
      <p>You can now log in to access your account.</p>

      <router-link to="/login" class="login-button">Go to Login</router-link>

      <p class="hint">You may also return to the original tab or close this window.</p>
    </div>
  </div>
</template>

<script setup></script>

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
  color: #28a745;
  margin-bottom: 20px;
  font-size: 24px;
}

p {
  font-size: 15px;
  margin-bottom: 10px;
}

.login-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 22px;
  background-color: #409EFF;
  color: white;
  font-size: 15px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #66b1ff;
}

.hint {
  margin-top: 25px;
  color: #888;
  font-size: 14px;
}
</style>
