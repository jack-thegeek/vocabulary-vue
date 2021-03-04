<template>
    <div class="container book-body">
        <div style="margin-bottom: 20px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>词库管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的单词书</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" plain @click="downloadExample">点此下载模板</el-button>
        </div>

        <el-row :gutter="25">
            <el-col :span="5" v-for="(info, index) in bookInfos">
                <el-card :body-style="{ padding: '0px' }">
                    <img class="image"
                         src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                    <div style="padding: 14px;">
                        <span>{{info.bookName}}</span>
                        <div class="bottom clearfix">
                            <div class="info">{{info.bookInfo}}</div>
                            <div class="author">作者：{{info.author}}</div>
                            <el-button disabled class="button" style="float: right" type="text" v-if="curBook==info.id">
                                当前背诵
                            </el-button>
                            <el-button @click="setDefaultBook(info.id)" class="button" style="float: right" type="text"
                                       v-else>
                                设为当前背诵
                            </el-button>
                            <el-button @click="toManage(info.id)" class="button" style="float: left" type="text">
                                管理
                            </el-button>
                            <el-button @click="delBook(info.id)" type="text">
                                删除
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
                            :action="uploadUrl"
                            :before-upload="handleBeforeUpload"
                            :on-error="handleUploadError"
                            :before-remove="beforeRemove"
                            :on-exceed="handleExceed"
                            multiple
                            :limit="5"
                            :file-list="fileList">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">请先下载模板修改后再上传，最多同时上传5个文件</div>
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
                _this.bookInfos = res.data.data.bookInfos;
                _this.curBook = res.data.data.curBook;
            });
        },
        data() {
            return {
                curBook: '',
                bookInfos: '',
                myBooks: '',
                uploadUrl: 'http://localhost:8081/fileUpload',
                fileList: [],
            };
        },
        methods: {
            setDefaultBook(bookId) {
                const _this = this;
                this.$axios.get('/setDefaultBook?bookId=' + bookId).then(res => {
                    _this.$message.success(res.data.msg)
                    location.reload();
                });
            },
            delBook(bookId) {
                const _this = this;
                this.$confirm('此操作将永久删除相关背诵记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (_this.curBook == bookId) {
                        _this.$axios.get('/resetDefaultBook').then(res => {

                        });
                    }
                    _this.$axios.get('/delBookInLibrary?bookId=' + bookId).then(res => {
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        location.reload()
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            toManage(bookId) {
                this.$router.push({
                    path: "/manage",
                    query: {bookId: bookId}
                });
            },
            downloadExample() {
                window.open("http://localhost:8081/download?fileName=example.xlsx", '_blank');
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            handleUploadError(error, file) {
                console.log("文件上传出错：" + error)

            },
            handleBeforeUpload(file) {
                let formData = new FormData();
                formData.append("multipartFiles", file);
                this.$axios({
                    method: 'post',
                    url: 'http://localhost:8081/fileUpload',
                    data: formData,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then((res) => {
                    console.log("文件上传返回：" + res)
                }).catch(error => {
                    console.log("文件上传异常:" + error)
                })
            },
        }
    }
</script>

<style scoped>
    .book-body {
        padding-left: 5%;
        padding-right: 5%;
    }

    .el-breadcrumb {
        margin-bottom: 20px;
    }
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .el-upload-dragger {
        width: 0;
    }
    .info {
        font-size: 13px;
        color: #999;
        padding-bottom: 10px;
    }

    .image {
        width: 100%;
        display: block;
    }

</style>