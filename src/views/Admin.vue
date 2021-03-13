<template>
    <el-container>
        <el-aside width="200px">
            <el-row>
                <el-col :span="24">
                    <h1 class="title">后台管理系统</h1>
                    <el-menu
                            active-text-color="#212121"
                            class="el-menu"
                            default-active="/admin/userMgt"
                            router
                            text-color="#616161">
                        <el-menu-item-group title="人员管理">
                            <el-menu-item index="/admin/userMgt">
                                <i class="el-icon-user-solid"></i>
                                <span slot="title">人员管理</span>
                            </el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="词库管理">
                            <el-menu-item index="/admin/libraryMgt">
                                <i class="el-icon-s-management"></i>
                                <span slot="title">词库管理</span>
                            </el-menu-item>
                            <el-menu-item index="/admin/reviewMgt">
                                <i class="el-icon-menu"></i>
                                <span slot="title">审核管理</span>
                            </el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="系统信息">
                            <el-menu-item index="/admin/systemMgt">
                                <i class="el-icon-s-tools"></i>
                                <span slot="title">系统基础信息</span>
                            </el-menu-item>
                            <el-menu-item index="/home/info">
                                <i class="el-icon-back"></i>
                                <span slot="title">返回背诵系统</span>
                            </el-menu-item>
                        </el-menu-item-group>
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
            this.$route.path;
            return {};
        }
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }

    .el-aside {
        /*background-color: #545C64;*/
    }

    .el-container {
        width: 100%;
        height: 100vh;
    }

    .el-header {
        background-color: white;
    }

    .el-main {
        background-color: #eceff1;
    }

    .title {
        font-size: large;
        padding: 1em;
        text-align: center;
    }
</style>