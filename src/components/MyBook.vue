<template>
    <div class="container">
        <div style="margin-bottom: 20px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>词库管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的单词书</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" plain @click="downloadExample">点此下载模板</el-button>
        </div>

        <el-row :gutter="20">
            <el-col :span="7" v-for="(info, index) in bookInfos">
                <el-card :body-style="{ padding: '0px' }">
                    <img class="image"
                         src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                    <div style="padding: 14px;">
                        <span>{{info.bookName}}</span>
                        <div class="bottom clearfix">
                            <div class="info">{{info.bookInfo}}</div>
                            <div class="author">作者：{{info.author}}</div>
                            <el-button @click="toRecite(info.id)" class="button" style="float: right" type="text">
                                开始背诵
                            </el-button>
                            <el-button @click="toManage(info.id)" class="button" style="float: left" type="text">
                                管理
                            </el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card :body-style="{ padding: '20px' }">
                    <el-upload
                            class="upload-demo"
                            drag
                            action="/fileUpload"
                            accept=".xlsx"
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">请先下载模板再上传</div>
                    </el-upload>
                </el-card>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    export default {
        name: "MyBook",
        mounted: function () {
            const _this = this;
            this.$axios.get('/getMyBooks').then(res => {
                _this.bookInfos = res.data.data;
            });
        },
        data() {
            return {
                bookInfos: '',
                myBooks: '',
            };
        },
        methods: {
            toRecite(bookId) {
                this.$router.push({
                    path: "/recite",
                    query: {bookId: bookId}
                });
            },
            toManage(bookId) {
                this.$router.push({
                    path: "/manage",
                    query: {bookId: bookId}
                });
            },
            downloadExample(){
                window.open("http://localhost:8081/download?fileName=example.xlsx", '_blank')
                // const _this = this;
                // this.$axios.get('/downloadExample').then(res => {
                //
                // });
            },
        }
    }
</script>

<style scoped>
    .container{
        margin: 0 auto;
        width: 80%;
    }
    .book-body {
        max-width: 800px;
    }

    .el-breadcrumb {
        margin-bottom: 20px;
    }
</style>