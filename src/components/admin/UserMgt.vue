<template>
	<div class="user-mgt">
		<div class="btn-group">
			<el-button plain type="primary">新 增</el-button>

		</div>
		<div class="table-bg">
			<el-table
					:data="userList"
					border
					class="table"
					height="250"
					style="width: 100%">
				<el-table-column
						label="用户id"
						prop="id"
						width="180">
				</el-table-column>
				<el-table-column
						label="用户名"
						prop="name"
						width="180">
				</el-table-column>
				<el-table-column
						label="邮箱"
						prop="email">
				</el-table-column>
				<el-table-column
						label="等级"
						prop="level">
					<template slot-scope="scope">
						<el-tag disable-transitions type="primary" v-if="scope.row.level == 0">
							普通用户
						</el-tag>
						<el-tag disable-transitions type="success" v-else>
							管理员
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column
						align="center"
						label="操作"
						width="150">
					<template scope="scope">
						<el-button @click="editUser(scope.row)" size="small" v-if="scope.row.level==0">编辑</el-button>
						<el-button @click="" disabled size="small" v-if="scope.row.level>0">编辑</el-button>
						<el-button @click="del(scope.row.id)" size="small" type="danger" v-if="scope.row.level==0">删除
						</el-button>
						<el-button @click="del(scope.row.id)" disabled size="small" type="danger"
						           v-if="scope.row.level>0">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
					:page-count=total
					@current-change="handleCurrentChange"
					@size-change="handleSizeChange"
					background
					class="pagination"
					layout="total, prev, pager, next, jumper">
			</el-pagination>
		</div>
		<el-dialog :visible.sync="dialogFormVisible" title="编辑" width="30%">
			<el-form :model="editForm" ref="editForm">
				<el-form-item :label-width="20" label="昵称：">
					<el-input disabled v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item :label-width="20" label="邮箱：">
					<el-input disabled v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item :label-width="20" label="等级">
					<el-select v-model="editForm.level">
						<el-option label="普通用户" value="0"></el-option>
						<el-option label="管理员" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div class="dialog-footer" slot="footer">
				<el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
				<el-button @click="insertUser('editForm')" size="small" type="primary">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
    name: 'UserMgt',
    data() {
        return {
            userList: [],
            total: 0,
            dialogFormVisible: false,
            editForm: {
                name: '',
                email: '',
                level: ''
            }
        }
    },
    mounted: function () {
        this.initData()
    },
    methods: {
        initData() {
            const _this = this
            this.$axios.get('/admin/listUser').then(res => {
                if (res.data.code == 403) {
                    _this.$router.push('/home/info')
                }
                _this.userList = res.data.data.userList
                _this.total = res.data.data.total
            })
        },
        handleCurrentChange() {

        },
        handleSizeChange() {

        },
        insertUser(user) {

        },
        editUser(row) {
            this.dialogFormVisible = true
            this.editForm.name = row.name
            this.editForm.email = row.email

            let curLevel = row.level
            if (curLevel == 0) {
                curLevel = '普通用户'
            } else if (curLevel == 1) {
                curLevel = '管理员'
            }
            this.editForm.level = curLevel
        }
    }
}
</script>

<style scoped>
	.user-mgt {
		margin: 0 auto;
		width: 80%;
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
