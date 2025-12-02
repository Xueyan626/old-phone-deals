<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <nav>
        <ul>
          <li><router-link to="/admin/users">User Management</router-link></li>
          <li><router-link to="/admin/listings">Listing Management</router-link></li>
          <li><router-link to="/admin/reviews">Review Moderation</router-link></li>
          <li><router-link to="/admin/logs">Sales and Activity Logs</router-link></li>

        </ul>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="main-content">
      <header class="header">
        <h1>Admin Dashboard</h1>
        
        <button @click="logout" class="btn-logout">Logout</button>
      </header>
      <section class="content">
        <!-- children routes -->
        <router-view />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  methods: {
    logout() {
      
      sessionStorage.removeItem('token')
      
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}
.sidebar {
  width: 200px;
  background: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin: 10px 0;
}
.sidebar a {
  color: inherit;
  text-decoration: none;
}
.sidebar a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ecf0f1;
  padding: 10px 20px;
  border-bottom: 1px solid #bdc3c7;
}
.btn-logout {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.content {
  flex: 1;
  padding: 20px;
  background: #fff;
  overflow-y: auto;
}
</style>
  