<template>
	<div>
		<Header></Header>
		<el-card class="box-card">
			<div class="clearfix card-title" slot="header">
				<h3>用户登录</h3>
				<el-link href="/regist" style="float: right; padding: 3px 0" type="primary">去注册</el-link>
			</div>
			<div class=" item">
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
						<el-button @click="getImage" style="float: right" type="primary">人脸登录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<el-dialog :before-close="handleClose" :visible.sync="dialogFormVisible" title="人脸登录" width="30%">
			<span>{{tip}}</span>
			<div class="face">
				<video :height="videoHeight" :width="videoWidth" autoplay ref="video"></video>
				<canvas :height="videoHeight" :width="videoWidth" ref="canvas"></canvas>
			</div>
			<div class="dialog-footer" slot="footer">
				<el-button @click="handleClose" ref="cancel" size="small">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>


<script>
import Header from './Header'

let counter = 0
export default {
    name: 'Login',
    components: {Header},
    comments: {Header},
    data() {
        return {
            activeIndex: '1',
            activeIndex2: '1',
            form: {
                email: 'hezijie_jack@163.com',
                password: 'abigail'
            },
            rules: {
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {
                        type: 'string',
                        message: '邮箱格式不正确',
                        trigger: 'blur',
                        transform(value) {
                            if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) {
                                return true
                            } else {
                            }
                        }
                    },
                    {type: 'string', message: '长度不能超过30位', trigger: 'blur', max: 30}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            },
            videoWidth: 150,
            videoHeight: 150,
            tip: '',
            dialogFormVisible: false

        }
    },
    methods: {
        login(formName) {
            const _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post('/login', this.form).then(res => {
                        if (res.data.code == 200) {
                            _this.$message.success(res.data.msg)
                            const jwt = res.headers['authorization']
                            const userInfo = res.data.data
                            // 把数据存储到localStorage与sessionStorage
                            _this.$store.commit('SET_TOKEN', jwt)
                            _this.$store.commit('SET_USERINFO', userInfo)
                            _this.$router.push('/home/info')
                        }

                    })
                } else {
                    _this.$message.error('请检查字段')
                    return false
                }
            })
        },
        getImage() {
            if (this.form.email == '' || this.form.email == null) {
                this.$message.error('请先填写正确的email')
            } else {
                this.dialogFormVisible = true
                this.callCamera()
                setTimeout(this.photograph, 3000)
            }

        },
        // 调用摄像头
        callCamera() {
            this.tip = '正在检测人像……'
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    width: this.videoWidth,
                    height: this.videoHeight,
                    transform: 'scaleX(-1)'
                }
            }).then(success => {
                this.$refs['video'].srcObject = success
                this.$refs['video'].play()
            }).catch(error => {
                this.$message('摄像头开启失败，请检查摄像头是否可用！')
            })
        },
        // 拍照
        photograph() {
            const _this = this
            let ctx = this.$refs['canvas'].getContext('2d')
            // 把当前视频帧内容渲染到canvas上
            ctx.drawImage(this.$refs['video'], 0, 0, 150, 150)
            // 转base64格式、图片格式转换、图片质量压缩---支持两种格式image/jpeg+image/png
            let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)
            const formData = new FormData()
            formData.append('imgBase64', imgBase64)
            formData.append('email', _this.form.email)
            this.$axios.post('/faceLogin', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('登录成功')
                    const jwt = res.headers['authorization']
                    const userInfo = res.data.data
                    // 把数据存储到localStorage与sessionStorage
                    _this.$store.commit('SET_TOKEN', jwt)
                    _this.$store.commit('SET_USERINFO', userInfo)
                    _this.$router.push('/home/info')
                } else {
                    if (counter < 3) {
                        _this.tip = '检测失败，正在进行第' + (++counter) + '次重试'
                        setTimeout(_this.photograph, 3000)
                    } else {
                        _this.tip = '多次检测失败，请稍后重试'
                    }
                }
            }).finally(
                _this.closeCamera()
            )
        },
        // 关闭摄像头
        closeCamera() {
            if (!this.$refs['video'].srcObject) return
            let stream = this.$refs['video'].srcObject
            let tracks = stream.getTracks()
            tracks.forEach(track => {
                track.stop()
            })
            this.$refs['video'].srcObject = null
        },
        handleClose() {
            this.closeCamera()
            this.dialogFormVisible = false
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
		margin: 60px auto 0;
		width: 480px;
	}

	.face {
		-align: center;
	}
</style>
