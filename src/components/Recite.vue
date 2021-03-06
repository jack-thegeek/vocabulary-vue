<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>词库管理</el-breadcrumb-item>
            <el-breadcrumb-item>背单词</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="info">
            新学习：{{newNum}}/{{planNum}} 待复习：{{oldNum}}
        </div>
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
                <el-collapse-item name="5" title="笔记">
                    <div class="text item">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                v-model="noteText">
                        </el-input>
                        <el-button size="mini" class="submit" @click="updateNote(word.id)">提交</el-button>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-card>

        <el-row class="btn" v-if="group1">
            <el-button @click="unknow(word.id)" type="danger">不认识</el-button>
            <el-button @click="know(word.id)" type="primary">认识</el-button>
            <el-button @click="master(word.id)" type="success">已掌握</el-button>
        </el-row>

        <el-row class="btn" v-if="group2">
            <el-button @click="correct(word.id)" type="success">正确</el-button>
            <el-button @click="incorrect(word.id)" type="danger">不正确</el-button>
        </el-row>

        <el-row class="btn" v-if="group3">
            <el-button @click="getNewWord" type="danger">下一个</el-button>
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
                noteText: '',
                star: 0,
                activeNames: '',
                group1: true,
                group2: false,
                group3: false,
                starOn: starOn,
                starOff: starOff,
                newNum: '',
                oldNum: '',
                planNum: '',

            };
        },
        mounted: function () {
            this.getNewWord();
        },
        methods: {
            getNewWord(){
                this.activeNames = "";
                this.group1 = true;
                this.group2 = false;
                this.group3 = false;
                const _this = this;

                this.$axios.get('/getNewWord').then(res => {
                    if (res.data.msg=='success'){
                        _this.word = res.data.data.record;
                        _this.star = res.data.data.record.collection;
                        _this.newNum = res.data.data.newNum;
                        _this.oldNum = res.data.data.oldNum;
                        _this.planNum = res.data.data.planNum;
                        _this.noteText = res.data.data.record.note;
                    }else if (res.data.msg == 'done'){
                        _this.$alert('恭喜，当前单词书已背诵完毕！', '提示', {
                            confirmButtonText: '确定',
                            type: 'info'
                        }).then(() => {
                            _this.$router.push('/myBook')
                        });
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

            know(recordId) {
                this.group1 = false;
                this.group2 = true;
                this.activeNames = "1";
            },
            unknow(recordId) {
                this.group1 = false;
                this.group3 = true;
                this.activeNames = "1";
            },
            master(recordId) {
                const _this = this;
                this.activeNames = "";
                this.$axios.get('/master?recordId=' + recordId).then(res => {
                    _this.getNewWord();
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
            },
            correct(recordId){
                const _this = this;
                this.$axios.get('/know?recordId=' + recordId).then(res => {
                    _this.getNewWord();
                });
            },
            incorrect(recordId){
                const _this = this;
                this.$axios.get('/unknow?recordId=' + recordId).then(res => {
                    _this.getNewWord();
                });
            },
            updateNote(recordId){
                const _this = this;
                this.$axios.post('/updateNote?recordId=' + recordId + '&note=' + _this.noteText).then(res => {
                    _this.$message.success("提交成功")
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
    .box-card {
        margin: 0 auto;
        margin-top: 50px;
        width: 480px;
    }
    .info{
        text-align: center  ;
        margin: 0 auto;
        margin-top: 20px;
        width: 480px;
    }
    .submit{
        float: right;
        margin: 10px;
    }

</style>