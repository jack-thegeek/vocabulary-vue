<template>
    <div>
        <Header></Header>
        <el-card class="box-card">
            <div class="clearfix card-title" slot="header">
                <h3>用户登录</h3>
                <el-link href="/regist" style="float: right; padding: 3px 0" type="primary">去注册</el-link>
            </div>
            <div class="text item">
                <el-form :model="form" :rules="rules" label-width="80px" ref="form">
                    <el-form-item label="邮箱" prop="email">
                        <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" type="password">
                        <el-input placeholder="请输入密码" show-password type="password" v-model="form.password"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-link href="/forget" style="float: left; padding: 3px 0" type="primary">重置密码</el-link>
                        <el-button @click="login('form')" style="float: right" type="primary">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>


<script>
    import Header from "./Header";

    export default {
        name: "Login",
        components: {Header},
        comments: {Header},
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1',
                form: {
                    email: 'hezijie_jack@163.com',
                    password: 'abigail',
                },
                rules: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            login(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/login', this.form).then(res => {
                            if (res.data.code == 200) {
                                _this.$message.success(res.data.msg);
                                const jwt = res.headers['authorization']
                                const userInfo = res.data.data;
                                // 把数据存储到localStorage与sessionStorage
                                _this.$store.commit("SET_TOKEN", jwt);
                                _this.$store.commit("SET_USERINFO", userInfo);
                                _this.$router.push("/info");
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

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        margin: 0 auto;
        margin-top: 60px;
        width: 480px;
    }
</style>