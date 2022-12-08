import { createRouter, createWebHistory } from "vue-router";
import routes from './routes.js'

// function views (path) {
//     return () => import(/* webpackChunkName: '' */ `../views/${path}`).then(m => m.default || m)
// }

/*function auth(to, from, next) {
    if (JSON.parse(localStorage.getItem('loggedIn'))) {
        next()
    }

    next('/login')
}*/

const router = createRouter({
    history: createWebHistory(),
    routes
})

/*router.beforeEach((to, from, next) => {

    if (store.getters.user) {
        if (to.matched.some(route => route.meta.guard === 'guest')) next({ name: 'home' })
        else next();

    } else {
        if (to.matched.some(route => route.meta.guard === 'auth')) next({ name: 'login' })
        else next();
    }
})*/

export default router;
