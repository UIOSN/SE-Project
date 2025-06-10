import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/info',
            component: AppLayout,
            children: [
                {
                    path: '/info',
                    name: 'info',
                    component: () => import('@/views/pages/Info.vue')
                },
                {
                    path: '/api_chat',
                    name: 'api_chat',
                    component: () => import('@/views/pages/API_Chat.vue')
                },
                {
                    path: '/search',
                    name: 'search',
                    component: () => import('@/views/pages/SearchDoc.vue')  
                },
                

                {
                    path: '/school_info/:id',
                    name: 'school_info',
                    component: () => import('@/views/pages/School_Info.vue')
                },
                {
                    path: '/mylist',
                    name: 'mylist',
                    component: () => import('@/views/pages/MyList.vue')
                },

                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/pages/Profile.vue')
                },

                



                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')  
        },

    ]
});

export default router;
