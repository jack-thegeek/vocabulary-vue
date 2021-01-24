<template>
    <el-card class="box-card">
        <h2>个人信息</h2>
        <el-divider></el-divider>
        <p>用户名：{{username}}</p>
        <el-divider></el-divider>
        <p>绑定邮箱：{{email}}</p>
    </el-card>
</template>

<script>
    export default {
        name: "Info",
        data() {
            return {
                username: '',
                email: '',
            };
        },
        mounted: function () {
            this.initData();//需要触发的函数
        },
        methods: {
            initData() {
                var info = this.$store.getters.getUser;
                this.username = info.name;
                this.email = info.email;
            }
        }
    }
</script>

<style scoped>

</style>