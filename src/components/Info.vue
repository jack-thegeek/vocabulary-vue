<template>
    <el-card class="box-card">
        <h2>个人信息</h2>
        <el-divider></el-divider>
        <p>用户名：{{username}}</p>
        <el-divider></el-divider>
        <p>已绑定邮箱：{{email}}</p>
        <el-divider></el-divider>
        <p>修改密码</p>
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="原密码" prop="old">
                <el-input placeholder="请输入原密码" show-password v-model="form.old"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new" type="password">
                <el-input placeholder="请输入新密码" show-password v-model="form.new"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="updatePwd('form')" style="float: right" type="primary">提交</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    export default {
        name: "Info",
        data() {
            return {
                form: {
                    old: '',
                    new: ''
                },
                rules: {
                    old: [
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    new: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ]
                },
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
            },
            updatePwd(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/updatePwd?oldPassword=' + this.form.old + '&newPassword=' + this.form.new).then(res => {
                            if (res.data.code == 200) {
                                _this.$message.success(res.data.msg);

                            }
                        })
                    } else {
                        _this.$message.success('请检查字段');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>