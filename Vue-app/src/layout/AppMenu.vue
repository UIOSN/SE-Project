<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    // {
    //     label: 'Home',
    //     items: [{ label: '主页', icon: 'pi pi-fw pi-home', to: '/' }]
    // },
    {
        label: '功能',
        //icon: 'pi pi-fw pi-list',
        items: [
            { label: '个人主页', icon: 'pi pi-fw pi-user', to: '/profile' },
            { label: '考生信息填写', icon: 'pi pi-fw pi-id-card', to: '/info' },
            // { label: 'AI志愿助手(blocking)', icon: 'pi pi-fw pi-microchip-ai', to: '/chat' },
            {label: 'AI志愿助手', icon: 'pi pi-fw pi-microchip-ai', to: '/api_chat'},
            { label: '我的志愿表', icon: 'pi pi-fw pi-bookmark', to: '/mylist' },
            // { label: '院校详情', icon: 'pi pi-fw pi-graduation-cap', to: '/school_info' },
            { label: '院校查询', icon: 'pi pi-fw pi-graduation-cap', to: '/search' },
            
            
        ]
    },
    
    
    {
        label: '更多',
        items: [
        {
                label: '用户中心',
                icon: 'pi pi-fw pi-home',
                items: [
                    {
                        label: '登录',
                        icon: 'pi pi-fw pi-globe',
                        to: '/auth/login'
                    },
                    {
                        label:'注册',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/register'
                    },
                ]
            },
            {
                label: '使用指引',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
            // {
            //     label: 'Source仓库',
            //     icon: 'pi pi-fw pi-github',
            //     url: 'https://github.com/primefaces/sakai-vue',
            //     target: '_blank'
            // }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
