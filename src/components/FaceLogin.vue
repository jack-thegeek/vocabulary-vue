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
                videoWidth: 300,
                videoHeight: 300,
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
                let ctx = this.$refs['canvas'].getContext('2d');
                // 把当前视频帧内容渲染到canvas上
                ctx.drawImage(this.$refs['video'], 0, 0, 300, 300);
                // 转base64格式、图片格式转换、图片质量压缩---支持两种格式image/jpeg+image/png
                let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7);
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