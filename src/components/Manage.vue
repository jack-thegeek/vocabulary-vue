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
            <el-table-column
                    label="翻译"
                    prop="chinese">
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
                    label="收藏"
                    prop="collection">

                <template slot-scope="scope">
                    <div @click="star(scope.row,scope.$index)">
                        <img :src="starOn" alt="" v-if="scope.row.collection==1" width="20">
                        <img :src="starOff" alt="" v-else width="20">
                    </div>
                </template>

            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small">编辑</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :page-count="total"
                :page-size="pageSize"
                :page-sizes="[10,20,50,100,200]"
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
                searchText: ''
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
            star(row, index) {
                var recordId = row.id;
                var star = this.bookInfos[index].collection;
                const _this = this;
                this.$axios.get('/star?recordId=' + recordId + "&star=" + star).then(res => {
                    if (star == 1) {
                        _this.bookInfos[index].collection = 0;
                    } else {
                        _this.bookInfos[index].collection = 1;
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
                this.$axios.post("/downloadRecord?bookId="+bookId).then(res=>{
                    const blob = new Blob(res.data, {type: 'text/plain;charset=utf-8'});
                    alert(res.data)
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "vocabulary.xlsx";
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            }
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
</style>