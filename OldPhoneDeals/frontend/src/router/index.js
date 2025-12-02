import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Dashboard from '../components/Dashboard.vue'
import ItemPage from '../components/ItemPage.vue'
import WishlistPage from '../components/WishlistPage.vue'
import Checkout from '../components/Checkout.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import ProfilePage from '../components/ProfilePage.vue'
import AdminLayout      from '../components/AdminLayout.vue'
import AdminUsers       from '../components/AdminUsers.vue'
import AdminPhones      from '../components/AdminPhones.vue'
import AdminPhoneEdit   from '../components/AdminPhoneEdit.vue'
import AdminReviews     from '../components/AdminReviews.vue'
import AdminSales       from '../components/AdminSales.vue'
import UserListings     from '../components/UserListings.vue'
import UserReviews      from '../components/UserReviews.vue'
import AdminPhoneReviews from '../components/AdminPhoneReviews.vue'
import { ElMessage } from 'element-plus'


const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/', component: Dashboard },
  { path: '/profile', component: ProfilePage },
  {  path: '/item/:id', component: ItemPage, props: true },
  { path: '/checkout', component: Checkout },
  { path: '/wishlist', component: WishlistPage },
  // src/router/index.js
  {
    path: '/adminlogin',
    name: 'AdminLogin',
    component: () => import('@/components/AdminLogin.vue')
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers
      },
      {
        path: 'users/:id/listings',
        name: 'UserListings',
        component: UserListings,
        props: true
      },
      {
        path: 'phones/:id/reviews',
        name: 'AdminPhoneReviews',
        component: AdminPhoneReviews,
        props: true
      },
      {
        path: 'users/:id/reviews',
        name: 'UserReviews',
        component: UserReviews,
        props: true
      },
      {
        path: 'listings',
        name: 'AdminListings',
        component: AdminPhones
      },
      {
        path: 'listings/:id/edit',
        name: 'AdminListingEdit',
        component: AdminPhoneEdit,
        props: true
      },
      {
        path: 'reviews',
        name: 'AdminReviews',
        component: AdminReviews
      },
      {
        path: 'logs',
        name: 'AdminSales',
        component: AdminSales
      }
    ]
  },
  {
    path: '/verify-success',
    component: () => import('@/components/VerifySuccess.vue')
  },
  {
    path: '/verify',
    name: 'EmailVerifyNotice',
    component: () => import('@/components/EmailVerifyNotice.vue')
  },
  {
    path: '/reset-request',
    name: 'ResetRequest',
    component: () => import('@/components/ResetRequest.vue')
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('@/components/ResetPassword.vue')
  },
  {
    path: '/check-email',
    name: 'CheckEmailNotice',
    component: () => import('@/components/CheckEmailNotice.vue')
  },
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  // const token = localStorage.getItem('token');
  const token = sessionStorage.getItem('token');
  const protectedRoutes = ['/checkout'];
  // const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  if ((to.path === '/dashboard' || to.path === '/admin-dashboard') && !token) {
    ElMessage.warning('Please log in first');
    return next('/login');
  }

  if ((to.path === '/profile') && !token) {
    ElMessage.warning('Please log in first')
    return next('/login')
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    ElMessage.warning('Admins only. Redirecting to login.');
    return next('/login');
  }

  if (protectedRoutes.includes(to.path) && !token) {
    const goLogin = window.confirm('You need to log in to access checkout. Go to login?')
    if (goLogin) {
      next('/login')
    } else {
      next(false)
    }
  } else {
    next()
  }
})


export default router;