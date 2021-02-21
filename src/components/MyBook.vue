<template>
    <el-row>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>背单词</el-breadcrumb-item>
            <el-breadcrumb-item>我的单词书</el-breadcrumb-item>
        </el-breadcrumb>

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
    </el-row>
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
        }
    }
</script>

<style scoped>
    .book-body {
        max-width: 800px;
    }

    .el-breadcrumb {
        margin-bottom: 20px;
    }
</style>