<template>
    <div class="review-mgt">
        <div class="btn-group">
            <el-button plain type="danger" size="small" @click="getNotReview">未审核</el-button>
            <el-button plain type="primary" size="small" @click="getReviewed">已审核</el-button>
        </div>
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
                        label="用户id"
                        prop="uid"
                        width="50">
                </el-table-column>
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
                        label="审核日期"
                        prop="checkDate">
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
                        label="审核员回复"
                        prop="reply">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        width="250">
                    <template scope="scope">
                        <el-button @click="" size="small" type="success" @click="acceptUpload(scope.row.id)">通过
                        </el-button>
                        <el-button @click="" size="small" type="danger" @click="denyUpload(scope.row.id)">不通过
                        </el-button>
                        <el-button @click="downloadExcel(scope.row.pathName)" size="small" type="primary">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :page-count="total"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    background
                    class="pagination"
                    layout="total, prev, pager, next, jumper">
            </el-pagination>
        </div>
        <el-dialog :visible.sync="denyFormVisible" title="审核不通过" width="30%">
            <el-form :model="dataForm" label-width="20%" ref="dataForm">
                <el-form-item label="" prop="name" v-show="false">
                    <el-input v-model="dataForm.denyId"></el-input>
                </el-form-item>
                <el-form-item label="原因：" prop="reason">
                    <el-input
                            :rows="4"
                            placeholder="请输入拒绝理由"
                            type="textarea"
                            v-model="dataForm.textarea">
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="submitDeny" size="small" type="primary">确 认</el-button>
                <el-button @click="denyFormVisible = false" ref="cancel" size="small" type="danger">取 消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "ReviewMgt",
        data() {
            return {
                uploadList: [],
                total: 0,
                state: 0,
                denyFormVisible: false,
                dataForm: {
                    denyId: '',
                    textarea: '',
                },

            };
        },
        mounted: function () {
            this.getNotReview();
        },
        methods: {
            headStyle() {
                return "text-align:center"
            },
            rowStyle() {
                return "text-align:center"
            },

            getNotReview() {
                this.state = 0;
                const _this = this;
                this.$axios.get('/admin/listAllUpload').then(res => {
                    _this.uploadList = res.data.data.uploadList;
                    _this.total = res.data.data.total;
                });
            },
            getReviewed() {
                this.state = 1;
                const _this = this;
                this.$axios.get('/admin/listAllUpload?state=1').then(res => {
                    _this.uploadList = res.data.data.uploadList;
                    _this.total = res.data.data.total;
                });
            },
            handleCurrentChange() {
                const _this = this;
                this.$axios.get('/admin/listAllUpload?state=' + _this.state).then(res => {
                    _this.uploadList = res.data.data.uploadList;
                    _this.total = res.data.data.total;
                });
            },
            handleSizeChange() {

            },
            downloadExcel(pathName) {
                window.open("http://localhost:8081/admin/downloadExcel?fileName=" + pathName);
            },
            acceptUpload(uploadId) {
                const _this = this;
                this.$axios.get('/admin/acceptUpload?uploadId=' + uploadId).then(res => {
                    if (res.data.code == 200) {
                        _this.$message('通过成功');
                        location.reload();
                    }
                });
            },
            denyUpload(id) {
                this.denyFormVisible = true;
                this.dataForm.denyId = id;
            },
            submitDeny() {
                const _this = this;
                const formData = new FormData;
                formData.append("uploadId", this.dataForm.denyId);
                formData.append("reply", this.dataForm.textarea);
                this.$axios.post('/admin/denyUpload', formData).then(res => {
                    if (res.data.code == 200) {
                        _this.$message('操作成功');
                        location.reload();
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .review-mgt {
        margin: 0 auto;
        width: 100%;
    }

    .table-bg {
        background-color: #fff;
        padding: 20px;
    }

    .btn-group {
        margin: 20px 0 15px 0;
        background-color: #fff;
        padding: 20px;
    }

    .el-pagination {
        margin: 30px 0 0 0;
    }
</style>