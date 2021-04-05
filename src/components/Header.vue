<template>
    <el-menu
            :default-active="this.$route.path"
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-demo"
            mode="horizontal"
            router
            text-color="#fff"
            type="flex">
        <el-menu-item disabled index="1">欢迎回来，{{username}}</el-menu-item>
        <el-menu-item index="/home/info">个人信息</el-menu-item>
        <el-menu-item index="/home/myBook">词库管理</el-menu-item>
        <el-menu-item index="/home/upload">审核进度</el-menu-item>
        <el-menu-item index="/home/recite">背单词</el-menu-item>
        <el-menu-item index="/home/translate">查翻译</el-menu-item>
        <el-menu-item index="/home/statistics">数据统计</el-menu-item>
        <el-menu-item index="/home/book">词库中心</el-menu-item>
        <el-menu-item index="/admin" v-if="admin">管理系统</el-menu-item>
        <el-menu-item @click="logout()" index="/logout" v-if="show">退出登录</el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "Header",
        data() {
            this.$route.path;
            return {
                username: '',
                show: false,
                admin: false,
            };
        },
        mounted: function () {
            this.initData();//需要触发的函数
        },
        methods: {
            initData() {
                var userInfo = this.$store.getters.getUser;
                if (userInfo != null) {
                    this.username = userInfo.name;
                    this.show = true;
                    if (userInfo.role == 'admin') {
                        this.admin = true;
                    }
                } else {
                    this.username = "请先登录";
                }
            },
            logout() {
                window.localStorage.clear();
                window.sessionStorage.clear();
                this.$router.push("/login");
                this.$message.warning("已退出登录");
            }
        }
    }
</script>

<style scoped>

</style>
