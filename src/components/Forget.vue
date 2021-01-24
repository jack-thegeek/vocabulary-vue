<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix card-title">
            <h3>重置密码</h3>
        </div>
        <div class="text item">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入注册邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-link href="/login" type="primary" style="float: left; padding: 3px 0">返回登录</el-link>
                    <el-button type="primary" @click="forget('form')" style="float: right">点击发送邮件</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Forget",
        data() {
            return {
                form: {
                    email: 'hezijie_jack@163.com',
                },
                rules: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            forget(formName) {
                var email = this.form.email;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('http://localhost:8081/resetPwd?email=' + email).then(res => {
                            _this.$message.success(res.data.msg);
                        })
                    } else {
                        _this.$message.success('请输入邮箱');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>