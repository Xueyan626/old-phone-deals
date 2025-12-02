<template>
  <div class="topbar">
    <h1 @click="$emit('goHome')">OldPhoneDeals</h1>

    <!-- Search Input -->
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search phone..."
      @keyup.enter="submitSearch"
    />
    <el-button type="primary" :icon="Search" @click="submitSearch">Search</el-button>

    <!-- Brand Selector -->
    <el-select v-model="brand" placeholder="All Brands" @change="emitFilters" size="default" style="width: 160px">
      <el-option label="All Brands" value="" />
      <el-option
        v-for="b in brandOptions"
        :key="b"
        :label="b"
        :value="b"
      />
    </el-select>


    <!-- Price Slider -->
    <div class="slider-demo-block">
      <span class="demonstration">Max Price: {{ maxPrice }}</span>
      <el-slider
        v-model="maxPrice"
        :min="0"
        :max="500"
        :step="10"
        @input="emitFilters"
        class="price-slider"
      />
    </div>


    <!-- Right Side Buttons -->
    <el-button type="primary" :icon="ShoppingCart" @click="$emit('checkout')">Checkout</el-button>
    <el-button type="primary" :icon="Star" @click="$emit('goWishlist')">Wishlist</el-button>
    <el-button
      type="primary"
      :icon="User"
      v-if="!isLoggedIn"
      @click="$emit('login')"
    >Sign In</el-button>
    <el-button
      type="primary"
      :icon="SwitchButton"
      v-else
      @click="$emit('logout')"
    >Sign Out</el-button>
    <el-button type="primary" :icon="User" @click="$emit('goProfile')">Profile</el-button>

  </div>
</template>

<script setup lang="ts">
import { getAllBrands } from '../api/api'
import { ref, onMounted } from 'vue'
import {
  Search,
  DataLine,
  ShoppingCart,
  Star,
  User,
  SwitchButton
} from '@element-plus/icons-vue'

const searchTerm = ref('')
const brand = ref('')
const maxPrice = ref(500)
const brandOptions = ref<string[]>([])

onMounted(async () => {
  try {
    const res = await getAllBrands()
    brandOptions.value = res.data.data || []
  } catch (err) {
    console.error('Failed to fetch brands', err)
  }
})

defineProps({
  isLoggedIn: Boolean,
  isSearchState: Boolean
})

const emit = defineEmits([
  'goHome',
  'search',
  'filter-change',
  'checkout',
  'goWishlist',
  'login',
  'logout',
  'goProfile'
])

function submitSearch() {
  emit('search', searchTerm.value)
}

function emitFilters() {
  emit('filter-change', {
    brand: brand.value,
    maxPrice: maxPrice.value
  })
}
</script>

<style scoped>
.topbar {
  background: #f5f5f5;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px; /* spacing between elements */
  justify-content: center;
}

/* Text input and select inner input */
input[type="text"],
.el-input__inner {
  width: 200px;
  height: 36px;
  font-size: 14px;
  padding: 6px 10px;
  box-sizing: border-box;
}

/* Dropdown select wrapper */
.el-select {
  width: 160px;
  height: 36px;
}

/* Inner input of the dropdown */
.el-select .el-input__inner {
  height: 36px;
  line-height: 36px;
}

/* Slider (price range) */
.el-slider {
  width: 180px;
  height: 36px;
  margin-left: 4px;
}

/* All buttons */
.el-button {
  height: 36px;
  min-width: 100px;       /* ensure consistent button width */
  font-size: 14px;
  padding: 0 16px;
  border-radius: 6px;
  box-sizing: border-box;
}

/* Icon inside button */
.el-button .el-icon {
  margin-right: 4px;      /* spacing between icon and text */
}

</style>
