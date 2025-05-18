import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

// 身份验证守卫函数
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    next(); // 允许访问
  } else {
    next('/auth/login'); // 重定向到登录页
  }
};

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/main',
            component: AppLayout,
            beforeEnter: requireAuth, // 添加身份验证守卫，保护所有/main下的路由
            children: [
                {
                    path: '/main',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/info',
                    name: 'info',
                    component: () => import('@/views/pages/Info.vue')
                },

                {
                    path: '/chat',
                    name: 'chat',
                    component: () => import('@/views/pages/Chat.vue')
                },
                {
                    path: '/chatpage',
                    name: 'chatpage',
                    component: () => import('@/views/pages/ChatPage.vue')
                },
                {
                    path: '/search',
                    name: 'search',
                    component: () => import('@/views/pages/SearchDoc.vue')  
                },
                {
                    path: '/search0',
                    name: 'search0',
                    component: ()=> import('@/views/pages/Search.vue')

                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/school_info',
                    name: 'school_info',
                    component: () => import('@/views/pages/School_Info.vue')
                },
                {
                    path: '/mylist',
                    name: 'mylist',
                    component: () => import('@/views/pages/MyList.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/profile',
                    name: 'profile',
                    component: () => import('@/views/uikit/Profile.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
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
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
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
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

// 全局导航守卫 - 为了更全面地保护所有需要登录的路由
router.beforeEach((to, from, next) => {
    // 不需要登录就可以访问的页面路径列表
    const publicPages = ['/', '/auth/login', '/auth/register', '/auth/access', '/auth/error', '/pages/notfound'];
    // 检查当前路径是否需要认证
    const authRequired = !publicPages.includes(to.path) && !to.path.startsWith('/pages/');
    
    // 获取登录令牌
    const token = localStorage.getItem('token');
    
    // 如果需要认证但没有令牌，重定向到登录页面
    if (authRequired && !token) {
        next('/auth/login');
    } else {
        next(); // 继续正常导航
    }
});

export default router;