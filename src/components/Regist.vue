<template>
    <div>
        <Header></Header>
        <el-card class="box-card">
            <div class="clearfix card-title" slot="header">
                <h3>用户注册</h3>
                <el-link href="/login" style="float: right; padding: 3px 0" type="primary">去登录</el-link>
            </div>
            <div class="text item">
                <el-form :model="form" :rules="rules" class="card-box" label-width="80px" ref="registForm">
                    <el-form-item label="用户名" prop="name">
                        <el-input placeholder="请输入用户名" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email" type="e">
                        <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-input placeholder="请输入邮箱验证码" v-model="form.code"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="sendEmail()" style="float: left" type="primary">发送验证码</el-button>
                        <el-button @click="regist('registForm')" style="float:right;" type="primary">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>


        <el-dialog
                :before-close="handleClose"
                :visible.sync="dialogVisible"
                title="温馨提示"
                width="30%">
            <span>请检查字段</span>
            <span class="dialog-footer" slot="footer">
                <el-button @click="dialogVisible = false" type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>


</template>


<script>
    import Header from "./Header";

    export default {
        name: "Regist",
        components: {Header},
        comments: {Header},
        data() {
            return {
                form: {
                    name: 'jack',
                    email: '869424311@qq.com',
                    password: 'jackjack',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}
                    ],
                    password: [
                        {min: 6, max: 20, required: true, message: '请输入密码，长度在6到20个字母', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                dialogVisible: false
            };
        },
        methods: {
            sendEmail() {
                var email = this.form.email;
                if (email != null) {
                    this.$axios.post('http://localhost:8081/sendEmail?email=' + email).then(res => {
                        if (res.data.code == 200) {
                            alert(res.data.msg);
                            const jwt = res.headers['authorization'];
                            // 把数据共享出去
                            _this.$store.commit("SET_TOKEN", jwt)
                        }
                    })
                } else {
                    this.dialogVisible = true;
                    return false;
                }
            },
            regist(formName) {
                //表单绑定验证功能
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('http://localhost:8081/regist', this.form).then(res => {
                            alert(res.data.msg);
                        })
                    } else {
                        this.dialogVisible = true;
                        return false;
                    }
                });
            },
        }
    }
</script>

<style>


    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

</style>
