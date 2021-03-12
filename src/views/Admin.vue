<template>
    <el-container>
        <el-aside width="200px">
            <el-row>
                <el-col :span="24">
                    <h1 class="title">后台管理系统</h1>
                    <el-menu
                            default-active="1"
                            class="el-menu"
                            text-color="#616161"
                            active-text-color="#212121">
                        <el-menu-item index="1">
                            <i class="el-icon-user-solid"></i>
                            <span slot="title">人员管理</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <i class="el-icon-s-management"></i>
                            <span slot="title">词库管理</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <i class="el-icon-s-tools"></i>
                            <span slot="title">系统基础信息</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <i class="el-icon-back"></i>
                            <span slot="title" @click="$router.push('/info')">返回背诵系统</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>

        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "admin",
        data() {

        },
        mounted: function () {

        },
        methods: {}
    }
</script>

<style scoped>
    *{
        box-sizing:border-box;
    }
    .el-aside{
        /*background-color: #545C64;*/
    }
    .el-container{
        width: 100%;
        height: 100vh;
    }
    .el-header{
        background-color: white;
    }
    .el-main{
        background-color: #eceff1;
    }
    .title{
        font-size: large;
        padding: 1em;
        text-align: center;
    }
</style>