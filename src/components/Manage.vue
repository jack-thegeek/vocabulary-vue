<template>
    <div>
        <div>
            <el-row>
                <el-button @click="getAll">全部</el-button>
                <el-button @click="getRecited" type="primary">已背诵</el-button>
                <el-button @click="getNotRecited" type="danger">未背诵</el-button>
                <el-button @click="getMaster" type="success">已掌握</el-button>
                <el-button type="warning" @click="getStar">星标单词</el-button>
            </el-row>
        </div>
        <el-table
                :data="bookInfos"
                border
                stripe
                style="width: 80%">
            <el-table-column
                    align="center"
                    type="index"
                    width="50"
                    label="序号">
            </el-table-column>
            <el-table-column
                    prop="english"
                    label="单词">
            </el-table-column>
            <el-table-column
                    prop="chinese"
                    label="翻译">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="first_date"
                    label="背诵日期">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="state"
                    label="状态"
                    :filters="[{ text: '已掌握', value: '2' }, { text: '已背诵', value: '1' },{ text: '未背诵', value: '0' }]"
                    :filter-method="filterState"
                    filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state == 2" type="success" disable-transitions>
                        已掌握
                    </el-tag>
                    <el-tag v-else-if="scope.row.state == 1" type="primary" disable-transitions>
                        已背诵
                    </el-tag>
                    <el-tag type="danger" disable-transitions v-else>
                        未背诵
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="collection"
                    label="收藏">

                <template slot-scope="scope">
                    <div @click="star(scope.row,scope.$index)">
                        <img :src="starOn" alt="" width="20" v-if="scope.row.collection==1">
                        <img :src="starOff" alt="" width="20" v-else>
                    </div>
                </template>

            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-size="pageSize"
                :page-sizes="[10,20,50,100,200]"
                :page-count="total">
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
                state: 3,
                total: 0,//总页数
                pageSize: 20,//默认每页显示20条
            };
        },
        mounted: function () {
            this.getAll();
        },
        methods: {
            getAll() {
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId).then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            getRecited() {
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.state = 1;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + "&state=1").then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            getNotRecited() {
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.state = 0;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + "&state=0").then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            getMaster() {
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.state = 2;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + "&state=2").then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.total = res.data.data.totalPage;
                });
            },
            //获取收藏
            getStar() {
                const _this = this;
                var bookId = this.$route.query.bookId;
                this.$axios.get('/getStar?bookId=' + bookId).then(res => {
                    _this.bookInfos = res.data.data;
                });
            },
            handleSizeChange(val) {
                var bookId = this.$route.query.bookId;
                var state = this.state;
                const _this = this;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + '&pageSize=' + val + "&state=" + state).then(res => {
                    _this.bookInfos = res.data.data.records;
                    _this.pageSize = val;
                    _this.total = res.data.data.totalPage;
                });
            },
            handleCurrentChange(val) {
                var bookId = this.$route.query.bookId;
                var pageSize = this.pageSize;
                var state = this.state;
                const _this = this;
                this.$axios.get('/getRecordsByPage?bookId=' + bookId + '&pageSize=' + pageSize + '&pageNum=' + val + "&state=" + state)
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
                        _this.bookInfos[index].coll
                        ection = 0;
                    } else {
                        _this.bookInfos[index].collection = 1;
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>