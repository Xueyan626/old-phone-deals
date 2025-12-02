<template>
  <div class="profile-layout">

    <el-menu mode="horizontal" class="top-nav" :ellipsis="false">
      <el-menu-item index="logo" style="margin-right: auto">
        <span class="logo-text" @click="$router.push('/dashboard')">OldPhoneDeals</span>
      </el-menu-item>
      <el-menu-item index="logout" class="logout-text" @click="logout">
        Logout
      </el-menu-item>
    </el-menu>


    <div class="main-content">
     
      <el-menu
        class="side-nav"
        :default-active="selected"
        @select="handleSelect"
        unique-opened
      >
        <el-menu-item index="EditProfile">
          <el-icon><document /></el-icon>
          <span class="menu-label">Edit Profile</span>
        </el-menu-item>
        <el-menu-item index="ChangePassword">
          <el-icon><setting /></el-icon>
          <span class="menu-label">Change Password</span>
        </el-menu-item>
        <el-menu-item index="ViewComments">
          <el-icon><chat-line-round /></el-icon>
          <span class="menu-label">View Comments</span>
        </el-menu-item>
        <el-menu-item index="ManageListings">
          <el-icon><icon-menu /></el-icon>
          <span class="menu-label">Manage Listings</span>
        </el-menu-item>
      </el-menu>

      
      <div class="content-area">
        <component :is="selectedComponent" />
      </div>
    </div>
  </div>
</template>

<script>
import EditProfile from './EditProfile.vue'
import ChangePassword from './ChangePassword.vue'
import ViewComments from './ViewComments.vue'
import ManageListings from './ManageListings.vue'

import {
  Document,
  Setting,
  ChatLineRound,
  Menu as IconMenu
} from '@element-plus/icons-vue'

export default {
  name: 'ProfilePage',
  components: {
    EditProfile,
    ChangePassword,
    ViewComments,
    ManageListings,
    Document,
    Setting,
    ChatLineRound,
    IconMenu
  },
  data() {
    return {
      selected: 'EditProfile'
    }
  },
  computed: {
    selectedComponent() {
      return this.selected
    }
  },
  methods: {
    handleSelect(key) {
      this.selected = key
    },
    logout() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.profile-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-size: 16px;
  font-family: 'Segoe UI', Roboto, sans-serif;
  background-color: #f9f9f9;
}

.top-nav {
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
}

.logo-text {
  font-weight: bold;
  font-size: 30px;
  cursor: pointer;
  color: #2c3e50;
}

.logout-text {
  color: #f56c6c !important;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}

.main-content {
  display: flex;
  flex: 1;
}

.side-nav {
  width: 240px;
  min-height: 100%;
  border-right: 1px solid #ebeef5;
  font-size: 15px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-label {
  font-size: 15px;
  margin-left: 10px;
}

.el-menu-item {
  font-weight: 600;
}

.content-area {
  flex: 1;
  padding: 32px;
  background: #fff;
  overflow-y: auto;
}
</style>
