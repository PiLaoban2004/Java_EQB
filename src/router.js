import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Quiz from './views/Quiz.vue';
import Profile from './views/Profile.vue';
import WrongAnswerBook from './views/WrongAnswerBook.vue';
import Materials from './views/Materials.vue';
import { isAuthenticated } from './services/userService'; // Import isAuthenticated

const routes = [
  { path: '/', component: Home },
  { path: '/quiz/:type', component: Quiz, props: true },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } }, // Mark as requiring auth
  { path: '/wrong-book', component: WrongAnswerBook, meta: { requiresAuth: true } }, // Mark as requiring auth
  { path: '/materials', component: Materials },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // If the user is not authenticated, redirect to the profile page
    if (!isAuthenticated()) {
      // Only redirect if the target route is not already /profile
      // This prevents infinite redirects when /profile itself requires auth
      if (to.path !== '/profile') {
        next('/profile');
      } else {
        // If already on /profile and not authenticated, allow access to show login/register form
        next();
      }
    } else {
      // User is authenticated, proceed
      next();
    }
  } else {
    // Route does not require authentication, proceed
    next();
  }
});

export default router;
