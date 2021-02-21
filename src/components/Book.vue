<template>
    <div class="book-body">
        词库商城
        <el-row>
            <el-col :span="7" v-for="(info, index) in bookInfos">
                <el-card :body-style="{ padding: '0px' }">
                    <img class="image"
                         src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                    <div style="padding: 14px;">
                        <span>{{info.bookName}}</span>
                        <div class="bottom clearfix">
                            <div class="info">{{info.bookInfo}}</div>
                            <div class="author">作者：{{info.author}}</div>
                            <el-button class="button" type="text" v-if="myBooks.indexOf(info.id)>-1">
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
                this.$axios.get('/addToLibrary?bookId=' + bookId).then(res => {
                    alert("succeed")
                });
            },
        }
    }
</script>

<style scoped>
    .book-body {
        max-width: 800px;
    }

    .info {
        font-size: 13px;
        color: #999;
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