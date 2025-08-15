import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Quiz from './views/Quiz.vue';
import Profile from './views/Profile.vue';
import WrongAnswerBook from './views/WrongAnswerBook.vue';
import Materials from './views/Materials.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/quiz/:type', component: Quiz, props: true },
  { path: '/profile', component: Profile },
  { path: '/wrong-book', component: WrongAnswerBook },
  { path: '/materials', component: Materials },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
