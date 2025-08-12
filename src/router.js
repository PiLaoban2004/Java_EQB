import { createRouter, createWebHistory } from 'vue-router';
import Quiz from './views/Quiz.vue';
import Profile from './views/Profile.vue';
import WrongAnswerBook from './views/WrongAnswerBook.vue';

const routes = [
  { path: '/', component: Quiz, name: 'Quiz' },
  { path: '/profile', component: Profile, name: 'Profile' },
  { path: '/wrong-book', component: WrongAnswerBook, name: 'WrongAnswerBook' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
