<template>
    <div class="container">

        <div class="btn-group">
            <el-row>
                <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
                    <el-button @click="getAll">全部</el-button>
                    <el-button @click="getRecited" type="primary">已背诵</el-button>
                    <el-button @click="getNotRecited" type="danger">未背诵</el-button>
                    <el-button @click="getMaster" type="success">已掌握</el-button>
                    <el-button @click="getStar" type="warning">星标单词</el-button>
                    <el-button @click="getNote" type="info">我的笔记</el-button>
                    <el-button @click="download" type="button">导出全部</el-button>
                </el-col>
                <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
                    <el-input
                            style="width:200px"
                            placeholder="查找本单词书中的单词"
                            v-model="searchText"
                            clearable>
                    </el-input>
                    <el-button icon="el-icon-search" circle style="margin-left: 10px" @click="searchWord"></el-button>
                </el-col>
            </el-row>
        </div>

        <div class="option">
            每天学习的新单词量
            <el-select v-model="value">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button class="check" type="success" icon="el-icon-check" circle @click="setNum(value)"></el-button>

            <el-switch
                    v-model="switcher"
                    active-text="显示翻译"
                    inactive-text="隐藏翻译">
            </el-switch>

            <span class="learningInfo">总学习情况：{{oldWord}}/{{totalWord}}</span>

        </div>

<!--        编辑框-->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="单词" :label-width="formLabelWidth" v-show="false">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="单词" :label-width="formLabelWidth">
                    <el-input v-model="form.word" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="form.state" placeholder="请选择状态">
                        <el-option label="未背诵" value="0"></el-option>
                        <el-option label="已背诵" value="1"></el-option>
                        <el-option label="已掌握" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="中文翻译" :label-width="formLabelWidth">
                    <el-input v-model="form.chinese" disabled></el-input>
                </el-form-item>
                <el-form-item label="英英简短释义" :label-width="formLabelWidth">
                    <el-input v-model="form.enShort" disabled type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item label="英英详细释义" :label-width="formLabelWidth">
                    <el-input v-model="form.enLong" disabled type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item label="例句" :label-width="formLabelWidth">
                    <el-input v-model="form.example" disabled type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item label="笔记" :label-width="formLabelWidth">
                    <el-input v-model="form.note" type="textarea" autosize></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

        <el-table
                :data="bookInfos"
                border
                class=""
                stripe>
            <el-table-column
                    align="center"
                    label="序号"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    label="单词"
                    prop="english">
            </el-table-column>
            <el-table-column v-if="switcher"
                    label="翻译"
                    prop="chinese"
                    width="200">
            </el-table-column>
            <el-table-column v-if="!switcher"
                    label="翻译"
                    width="200">
                ******
            </el-table-column>

            <el-table-column
                    align="center"
                    label="上次背诵日期"
                    prop="lastDate">
            </el-table-column>
            <el-table-column
                    :filter-method="filterState"
                    :filters="[{ text: '已掌握', value: '2' }, { text: '已背诵', value: '1' },{ text: '未背诵', value: '0' }]"
                    align="center"
                    filter-placement="bottom-end"
                    label="状态"
                    prop="state">
                <template slot-scope="scope">
                    <el-tag disable-transitions type="success" v-if="scope.row.state == 2">
                        已掌握
                    </el-tag>
                    <el-tag disable-transitions type="primary" v-else-if="scope.row.state == 1">
                        已背诵
                    </el-tag>
                    <el-tag disable-transitions type="danger" v-else>
                        未背诵
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="认识次数"
                    prop="knowCount">
            </el-table-column><el-table-column
                align="center"
                label="不认识次数"
                prop="unknownCount">
        </el-table-column>
            <el-table-column
                    align="center"
                    label="笔记"
                    prop="note">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="收藏"
                    width="50"
                    prop="collection">
                <template slot-scope="scope">
                    <div @click="star(scope.row)">
                        <img :src="starOn" alt="" v-if="scope.row.collection==1" width="20">
                        <img :src="starOff" alt="" v-else width="20">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    width="150">
                <template scope="scope">
                    <el-button size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :page-count="total"
                :page-size="pageSize"
                :page-sizes="[10,20,50,100,200,500]"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                background
                class="pagination"
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    import starOn from "../assets/icon/star-on.svg"
    import starOff from "../assets/icon/star-off.svg"

    export default {
        name: "Manage",
        data() {
            return {
                starOn: starOn,
                starOff: starOff,
                bookInfos: [],
                state: 3,//单词状态
                total: 0,//总页数
                pageSize: 20,//默认每页显示20条
                collection: 0,//是否收藏
                searchText: '',
                value: '',
                switcher: true,
                oldWord: '',
                totalWord: '',
                dialogFormVisible: false,
                form: {
                    id: '',
                    word: '',
                    chinese: '',
                    enShort: '',
                    enLong: '',
                    example: '',
                    note: '',
                    state: '',

                },
                formLabelWidth: '120px',
                options: [{value: '5', label: '5'}, {value: '10', label: '10'}, {
                    value: '15',
                    label: '15'
                }, {value: '20', label: '20'}, {value: '25', label: '25'}, {value: '30', label: '30'}, {
                    value: '35',
                    label: '35'
                }, {value: '40', label: '40'}, {value: '45', label: '45'}, {value: '50', label: '50'}, {
                    value: '55',
                    label: '55'
                }, {value: '60', label: '60'}, {value: '65', label: '65'}, {value: '70', label: '70'}, {
                    value: '75',
                    label: '75'
                }, {value: '80', label: '80'}, {value: '85', label: '85'}, {value: '90', label: '90'}, {
                    value: '95',
                    label: '95'
                }, {value: '100', label: '100'}]
            };
        },
        mounted: function () {
            this.getAll();
        },
        methods: {
            getAll() {
                this.collection = 0;
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId).then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                    _this.totalWord = res.data.data.totalWord;
                    _this.oldWord = res.data.data.oldWord;
                });
            },
            getRecited() {
                this.collection = 0;
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.state = 1;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + "&state=1").then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            getNotRecited() {
                this.collection = 0;
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.state = 0;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + "&state=0").then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            getMaster() {
                this.collection = 0;
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.state = 2;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + "&state=2").then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            //获取收藏的单词
            getStar() {
                this.collection = 1;
                this.state = 3;
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + "&collection=1").then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            getNote(){

            },
            handleSizeChange(val) {
                var bookId = this.$route.query.bookId;
                var state = this.state;
                var collection = this.collection;
                const _this = this;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + '&pageSize=' + val + "&state=" + state + "&collection=" + collection).then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.pageSize = val;
                    _this.total = res.data.data.totalPage;
                });
            },
            handleCurrentChange(val) {
                var bookId = this.$route.query.bookId;
                var pageSize = this.pageSize;
                var state = this.state;
                var collection = this.collection;
                const _this = this;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + '&pageSize=' + pageSize + '&pageNum=' + val + "&state=" + state + "&collection=" + collection)
                    .then(res => {
                        _this.bookInfos = res.data.data.records;
                        _this.total = res.data.data.totalPage;
                    });
            },

            filterState(value, row) {
                return row.state == value;
            },
            //收藏
            star(row) {
                var recordId = row.id;
                // var star = this.bookInfos[index].collection;
                var star = row.collection;
                const _this = this;
                this.$axios.get('/star?recordId=' + recordId + "&star=" + star).then(res => {
                    if (star == 1) {
                        row.collection = 0;
                    } else {
                        row.collection = 1;
                    }
                });
            },
            searchWord() {
                const _this = this;
                this.$axios.get('/searchWord?searchText=' + _this.searchText).then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            download() {
                var bookId = this.$route.query.bookId;
                this.$axios.post("/downloadRecord?bookId=" + bookId).then(res => {
                    const blob = new Blob(res.data, {type: 'text/plain;charset=utf-8'});
                    alert(res.data)
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "vocabulary.xlsx";
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            },
            setNum(val) {
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.$axios.get('/setNum?bookId=' + bookId + '&num=' + val).then(res => {
                    if (res.data.data=='success'){
                        _this.$message.success('修改成功')
                    }else {
                        _this.$message.error('修改失败')
                    }
                });
            },
            edit(row){
                this.dialogFormVisible = true;
                this.form.word = row.english;
                this.form.chinese = row.chinese;
                this.form.enLong = row.enLong;
                this.form.enShort = row.enShort;
                this.form.example = row.example;
                this.form.note = row.note;
                var curState = row.state;
                if (curState==0){
                    curState = '未背诵'
                }else if (curState == 1){
                    curState = '已背诵'
                }else {
                    curState = '已掌握'
                }
                this.form.state = curState;
            },
            del(val){
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.$confirm('此操作将永久删除此条背诵记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$axios.get('/delById?recordId=' + val).then(res => {
                        if (res.data.code==200){
                            _this.$message.success('删除成功')
                        }else {
                            _this.$message.error('删除失败')
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        }
    }
</script>

<style scoped>
    .container {
        width: 80%;
        margin: 0 auto;
    }

    .btn-group {
        text-align: left;
        padding-bottom: 20px;
    }

    .pagination {
        padding-top: 20px;
        text-align: center;
    }

    .option {
        margin-bottom: 20px;
    }
    .el-select{
        width: 100px;
    }
    .check{
        margin-left: 20px;
        margin-right: 20px;
    }
    .learningInfo{
        margin-left: 60px;
    }
</style>