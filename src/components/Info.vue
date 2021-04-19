<template>
	<el-card class="box-card">
		<h2>个人信息</h2>
		<el-divider></el-divider>
		<p>用户名：{{username}}</p>
		<el-divider></el-divider>
		<p>已绑定邮箱：{{email}}</p>
		<el-divider></el-divider>
		<p>录入人像信息
			<el-button @click="getImage">开始录入</el-button>
		</p>
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

		<el-dialog :before-close="handleClose" :visible.sync="dialogFormVisible" title="人像录入" width="30%">
			<span>{{tip}}</span>
			<div class="face">
				<video :height="videoHeight" :width="videoWidth" autoplay ref="video"></video>
				<canvas :height="videoHeight" :width="videoWidth" ref="canvas"></canvas>
			</div>
			<div class="dialog-footer" slot="footer">
				<el-button @click="handleClose" ref="cancel" size="small">取 消</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
let counter = 0
export default {
    name: 'Info',
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
            dialogFormVisible: false,
            videoWidth: 150,
            videoHeight: 150,
            tip: ''
        }
    },
    mounted: function () {
        this.initData()
    },
    methods: {
        initData() {
            const info = this.$store.getters.getUser
            this.username = info.name
            this.email = info.email
        },
        updatePwd(formName) {
            const _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post('/updatePwd?oldPassword=' + this.form.old + '&newPassword=' + this.form.new).then(res => {
                        if (res.data.code == 200) {
                            _this.$message.success(res.data.msg)
                        }
                    })
                } else {
                    _this.$message.success('请检查字段')
                    return false
                }
            })
        },
        getImage() {
            this.dialogFormVisible = true
            this.callCamera()
            setTimeout(this.photograph, 3000)
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
            ctx.drawImage(this.$refs['video'], 0, 0, 150, 150)
            let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)
            const formData = new FormData()
            formData.append('imgBase64', imgBase64)
            this.$axios.post('/setImage', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                if (res.data.msg == 'success') {
                    _this.$message.success('人像信息更新成功！')
                    _this.tip = '人像检测成功'
                    _this.$refs['cancel'].$el.Content = '退出'
                } else {
                    counter++
                    if (counter < 4) {
                        _this.$message.error('活体检测失败')
                        _this.tip = '检测失败，正在进行第' + counter + '次重试'
                        setTimeout(this.photograph, 3000)
                    } else {
                        _this.tip = '连续多次检测失败，请稍后重试！'
                        // _this.handleClose();
                    }
                }
            }).finally(
                // _this.closeCamera()
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
	.face {
		-align: center;
	}
</style>
