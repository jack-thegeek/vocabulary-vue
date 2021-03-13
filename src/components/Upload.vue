<template>
    <div class="table-bg">
        <el-table
                :cell-style="rowStyle"
                :data="uploadList"
                :header-cell-style="headStyle"
                border
                class="table"
                height="250"
                style="width: 100%">
            <el-table-column
                    label="词库名"
                    prop="fileName"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="上传日期"
                    prop="uploadDate"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="词库信息"
                    prop="bookInfo">
            </el-table-column>
            <el-table-column
                    filter-placement="bottom-end"
                    label="公有/私有"
                    prop="isPublic">
                <template slot-scope="scope">
                    <el-tag disable-transitions type="warning" v-if="scope.row.isPublic == 0">
                        私有
                    </el-tag>
                    <el-tag disable-transitions type="success" v-else-if="scope.row.isPublic == 1">
                        公有
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    filter-placement="bottom-end"
                    label="审核状态"
                    prop="state">
                <template slot-scope="scope">
                    <el-tag disable-transitions type="info" v-if="scope.row.state == 0">
                        审核中
                    </el-tag>
                    <el-tag disable-transitions type="success" v-else-if="scope.row.state == 1">
                        通过审核
                    </el-tag>
                    <el-tag disable-transitions type="danger" v-else>
                        未通过审核
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="审核日期"
                    prop="checkDate">
            </el-table-column>
            <el-table-column
                    label="审核员回复"
                    prop="reply">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Upload",
        data() {
            return {
                uploadList: [],
            };
        },
        mounted: function () {
            this.initData();
        },
        methods: {
            headStyle() {
                return "text-align:center"
            },
            rowStyle() {
                return "text-align:center"
            },
            initData() {
                const _this = this;
                this.$axios.get('/listUpload').then(res => {
                    _this.uploadList = res.data.data;
                });
            },
        }
    }
</script>

<style scoped>
    .table-bg {
        margin: 0 auto;
        width: 80%;
        background-color: #fff;
        padding: 20px;
    }
</style>