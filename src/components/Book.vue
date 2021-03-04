<template>
    <div class="container book-body">
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
                            <el-button class="button" type="text" disabled v-if="myBooks.indexOf(info.id)>-1">
                                已拥有
                            </el-button>
                            <el-button @click="addToLibrary(info.id)" class="button" type="text" v-else>
                                添加
                            </el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: "Book",
        mounted: function () {
            const _this = this;

            this.$axios.get('/getAllBooks').then(res => {
                var bookInfos = res.data.data.bookInfos
                _this.bookInfos = bookInfos;
                var myBooks = res.data.data.myBooks;
                var myBookIds = new Array();
                for (var i = 0; i < myBooks.length; i++) {
                    myBookIds[i] = myBooks[i].bookId;
                }
                _this.myBooks = myBookIds;
            });
        },
        data() {
            return {
                bookInfos: '',
                myBooks: '',
            };
        },
        methods: {
            addToLibrary(bookId) {
                const _this = this;
                this.$axios.get('/addToLibrary?bookId=' + bookId).then(res => {
                    this.$alert('添加成功', '提示', {
                        confirmButtonText: '确定',
                        type: 'info'
                    }).then(() => {
                        location.reload();
                    });
                });
            },
        }
    }
</script>

<style scoped>
    .book-body {
        padding-left: 5%;
        padding-right: 5%;
    }

    .info {
        font-size: 13px;
        color: #999;
        padding-bottom: 10px;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>