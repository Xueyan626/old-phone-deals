<template>
  <div class="admin-dashboard">
    <h1>Welcome to the Admin Panel</h1>
    
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard'
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  background: #fff;
}

.quick-links {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.quick-links li {
  margin: 0.5rem 0;
}

.quick-links a {
  color: #409eff;
  text-decoration: none;
}

.quick-links a:hover {
  text-decoration: underline;
}
</style>
