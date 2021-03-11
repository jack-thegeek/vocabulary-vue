<template>
    <div class="container book-body">
        <div style="margin-bottom: 20px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>词库管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的单词书</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button type="primary" plain @click="downloadExample">点此下载模板</el-button>
            <el-button type="primary" plain @click="upload">上传我的单词书</el-button>
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
        </el-row>

        <el-dialog title="上传" :visible.sync="dialogFormVisible" width="30%">
            <el-form :rules="rules" :model="dataForm" ref="dataForm" label-width="20%" @submit.native.prevent>
                <el-form-item label="名称：" prop="name">
                    <el-input type="text" v-model.trim="dataForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="文件：" prop="file">
                    <el-upload
                            class="upload-import"
                            ref="uploadImport"
                            action="#"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :limit="1"
                            :on-change="handleChange"
                            :auto-upload="false"
                            accept=".xlsx">
                        <!-- el-upload组件,在手动上传时,禁用按钮外, 还需要设置    :disabled="hasFile"
                        为true禁用该组件,会导致上传列表也被禁用,无法删除,因此使用v-show,文件数量为1时,显示禁用的的按钮, slot不绑定trigger事件 -->
                        <el-button v-show="!hasFile" slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button v-show="hasFile" size="small" type="primary" disabled>选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">请先下载模板，修改后上传</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSureHandle" size="small">提 交</el-button>
                <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
            </span>
        </el-dialog>
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
                dialogFormVisible: false,
                formLabelWidth: '120px',

                dataForm: {
                    name: '你好',
                    file: null
                },
                rules: {
                    name: [
                        {required: true, message: "请输入名称", trigger: "blur"},
                        {max: 20, message: "最长可输入20个字符", trigger: "blur"},
                    ],
                    file: [
                        {required: true, message: "请选择上传文件", trigger: "blur"},
                    ]
                },
                hasFile: false,
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
            handleRemove(file, fileList) {
                if (!fileList.length) {
                    this.hasFile = false;
                }
                this.dataForm.file = null;
            },
            handleChange(file, fileList) {
                if (fileList.length >= 2) {
                    return;
                }
                if (fileList.length === 1) {
                    this.hasFile = true;
                }
                this.dataForm.file = file;
            },
            //确定按钮
            onSureHandle() {
                const _this = this;
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        let dataPar = _this.dataForm;
                        let formData = new FormData();
                        formData.append('fileName', dataPar.name);
                        formData.append('file', dataPar.file.raw);
                        _this.$axios.post('/fileUpload', formData, {
                            headers: {'Content-Type': 'multipart/form-data'},//定义内容格式,很重要
                            timeout: 20000,
                        }).then(res => {
                            if (res.data.code==200){
                                _this.$message.success(res.data.msg);
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                })
            },
            upload() {
                this.dialogFormVisible = true;
            }
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