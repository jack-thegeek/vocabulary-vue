<template>
    <div>
        <!--canvas截取流-->
        <canvas ref="canvas" :width="videoWidth" :height="videoHeight"></canvas>
        <!--图片展示-->
        <video ref="video" :width="videoWidth" :height="videoHeight" autoplay></video>
        <!--开启摄像头-->
        <Button type="primary" @click="callCamera" style="margin-right: 10px;">开启摄像头</Button>
        <!--关闭摄像头-->
        <Button type="primary" @click="closeCamera">关闭摄像头</Button>
        <!--确认-->
        <Button type="primary" @click="photograph">拍照</Button>
    </div>
</template>

<script>
    export default {
        name: "FaceLogin",
        data() {
            return {
                videoWidth: 150,
                videoHeight: 150,
            };
        },
        mounted() {
            this.callCamera();
        },
        methods: {
            // 调用摄像头
            callCamera() {
                // H5调用电脑摄像头API
                navigator.mediaDevices.getUserMedia({
                    video: true,
                }).then(success => {
                    // 摄像头开启成功
                    this.$refs['video'].srcObject = success;
                    // 实时拍照效果
                    this.$refs['video'].play();
                }).catch(error => {
                    console.error('摄像头开启失败，请检查摄像头是否可用！');
                })
            },
            // 拍照
            photograph() {
                const _this = this;
                let ctx = this.$refs['canvas'].getContext('2d');
                // 把当前视频帧内容渲染到canvas上
                ctx.drawImage(this.$refs['video'], 0, 0, 150, 150);
                // 转base64格式、图片格式转换、图片质量压缩---支持两种格式image/jpeg+image/png
                let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7);
                const formData = new FormData();
                formData.append('imgBase64', imgBase64)
                formData.append('email', "hezijie_jack@163.com")
                this.$axios.post("/faceLogin",formData,{headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
                   if (res.data.code==200){
                       this.$message.success("登录成功");
                       const jwt = res.headers['authorization']
                       const userInfo = res.data.data;
                       // 把数据存储到localStorage与sessionStorage
                       _this.$store.commit("SET_TOKEN", jwt);
                       _this.$store.commit("SET_USERINFO", userInfo);
                       _this.$router.push("/info");
                   }
                }).finally(
                    _this.closeCamera()
                );
            },
            // 关闭摄像头
            closeCamera() {
                if (!this.$refs['video'].srcObject) return;
                let stream = this.$refs['video'].srcObject;
                let tracks = stream.getTracks();
                tracks.forEach(track => {
                    track.stop();
                })
                this.$refs['video'].srcObject = null;
            },

        },
    }
</script>

<style scoped>

</style>