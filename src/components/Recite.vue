<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>背单词</el-breadcrumb-item>
            <el-breadcrumb-item>背诵</el-breadcrumb-item>
        </el-breadcrumb>
        <div></div>
        <el-card class="box-card">
            <div class="clearfix" slot="header">
                <span>
                    <h2 style="text-align: center">{{word.english}}</h2>
                </span>
                <a @click="collect(word.id,star)" style="float: right;margin-right: 10px">
                    <img :src="starOn" alt="" v-if="star==1" width="20">
                    <img :src="starOff" alt="" v-else width="20">
                </a>
            </div>
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1" title="中文翻译">
                    <div class="text item">{{word.chinese}}</div>
                </el-collapse-item>
                <el-collapse-item name="2" title="英英简短释义">
                    <div class="text item">{{word.en_short}}</div>
                </el-collapse-item>
                <el-collapse-item name="3" title="英英详细释义">
                    <div class="text item">{{word.en_long}}</div>
                </el-collapse-item>
                <el-collapse-item name="4" title="例句">
                    <div class="text item">{{word.example}}</div>
                </el-collapse-item>
            </el-collapse>
        </el-card>

        <el-row class="btn">
            <el-button @click="unknow(word.id)" type="danger">{{unknowText}}</el-button>
            <el-button @click="know(word.id)" type="primary" v-if="showTag">认识</el-button>
            <el-button @click="master(word.id)" type="success" v-if="showTag">已掌握</el-button>
        </el-row>


    </div>

</template>

<script>
    import starOn from "../assets/icon/star-on.svg"
    import starOff from "../assets/icon/star-off.svg"

    export default {
        name: "Recite",

        data() {
            return {
                word: '',
                star: 0,
                activeNames: '',
                showTag: true,
                unknowText: '不认识',
                starOn: starOn,
                starOff: starOff,
            };
        },
        mounted: function () {
            const _this = this;
            var bookId = this.$route.query.bookId;
            this.$axios.get('/getNewWord?bookId=' + bookId).then(res => {
                if (res.data.msg=='success'){
                    _this.word = res.data.data;
                    _this.star = res.data.data.collection;
                }else {
                    this.$alert('今日单词已背诵完毕', '提示', {
                        confirmButtonText: '确定',
                        type: 'info'
                    }).then(() => {
                        _this.$router.push('/myBook')
                    });
                }

            });
        },
        methods: {
            know(recordId) {
                this.activeNames = "";
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.$axios.get('/know?recordId=' + recordId).then(res => {

                });
                this.$axios.get('/getNewWord?bookId=' + bookId).then(res => {
                    if (res.data.msg=='success'){
                        _this.word = res.data.data;
                    }else {
                        _this.$alert('今日单词已背诵完毕', '提示', {
                            confirmButtonText: '确定',
                            type: 'info'
                        }).then(() => {
                            _this.$router.push('/myBook')
                        });
                    }
                });
            },
            unknow(recordId) {
                const _this = this;
                var unknowText = this.unknowText;
                if (unknowText != "下一个") {
                    this.$axios.get('/unknow?recordId=' + recordId).then(res => {

                    });
                    this.activeNames = "1";
                    this.showTag = false;
                    this.unknowText = "下一个";
                } else {
                    var bookId = this.$route.query.bookId;
                    this.activeNames = "";
                    this.unknowText = "不认识";
                    this.showTag = true;
                    this.$axios.get('/getNewWord?bookId=' + bookId).then(res => {
                        if (res.data.msg=='success'){
                            _this.word = res.data.data;
                        }else {
                            _this.$alert('今日单词已背诵完毕', '提示', {
                                confirmButtonText: '确定',
                                type: 'info'
                            }).then(() => {
                                _this.$router.push('/myBook')
                            });
                        }
                    });
                }
            },
            master(recordId) {
                const _this = this;
                this.activeNames = "";
                var bookId = this.$route.query.bookId;
                this.$axios.get('/master?recordId=' + recordId).then(res => {

                });
                this.$axios.get('/getNewWord?bookId=' + bookId).then(res => {
                    if (res.data.msg=='success'){
                        _this.word = res.data.data;
                    }else {
                        _this.$alert('今日单词已背诵完毕', '提示', {
                            confirmButtonText: '确定',
                            type: 'info'
                        }).then(() => {
                            _this.$router.push('/myBook')
                        });
                    }
                });
            },
            collect(recordId, star) {
                const _this = this;
                this.$axios.get('/star?recordId=' + recordId + "&star=" + star).then(res => {
                    if (star == 1) {
                        _this.star = 0;
                    } else {
                        _this.star = 1;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .el-collapse-item__content {
        padding-bottom: 0px !important;
    }

    .el-collapse-item__header {
        color: #333333;
    }

    .btn {
        text-align: center;
        margin: 0 auto;
        margin-top: 30px;
    }

</style>