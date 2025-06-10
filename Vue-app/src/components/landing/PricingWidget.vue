<template>
    <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
        <div class="text-center mb-6">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">订阅服务</div>
            <!-- <span class="text-muted-color text-2xl">未来可能的付费功能</span> -->
        </div>

        <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
            <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">入门</div>
                    <img src="/demo/images/landing/free.svg" class="w-10/12 mx-auto" alt="free" />
                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">免费!</span>
                            <span class="text-surface-600 dark:text-surface-200"></span>
                        </div>
                        <Button label="Get Started" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                    <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">全程志愿辅导</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">精准定位分析</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">志愿模拟填报</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">院校信息大全</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">豪华版</div>
                    <img src="/demo/images/landing/startup.svg" class="w-10/12 mx-auto" alt="startup" />
                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">￥9.8</span>
                            <span class="text-surface-600 dark:text-surface-200">每月</span>
                        </div>
                        <Button label="Get Started" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                    <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">全程志愿辅导</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">精准定位分析</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">志愿模拟填报</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">院校信息大全</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">更多的问答次数</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                    <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">至尊版</div>
                    <img src="/demo/images/landing/enterprise.svg" class="w-10/12 mx-auto" alt="enterprise" />
                    <div class="my-8 flex flex-col items-center gap-4">
                        <div class="flex items-center">
                            <span class="text-5xl font-bold mr-2 text-surface-900 dark:text-surface-0">￥29.8</span>
                            <span class="text-surface-600 dark:text-surface-200">每月</span>
                        </div>
                        <Button label="Get Started" class="p-button-rounded border-0 ml-4 font-light leading-tight bg-blue-500 text-white"></Button>
                    </div>
                    <Divider class="w-full bg-surface-200"></Divider>
                    <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">全程志愿辅导</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">精准定位分析</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">志愿模拟填报</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">院校信息大全</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">无限问答次数</span>
                        </li>
                        <li class="py-2">
                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                            <span class="text-xl leading-normal">优先客服支持</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
