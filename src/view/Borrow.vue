<template>
<el-card>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path: '/borrow'}">借阅管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-row>
    <el-col :span="6"><el-input v-model="name" clearable @change="borrowList" placeholder="请输入添加的"></el-input></el-col>
    <el-col :span="6"><el-button type="primary" @click="openAddDialog">添加</el-button></el-col>
  </el-row>
  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column prop="boid" label="借阅id"/>
    <el-table-column prop="name" label="借阅人名称"/>
    <el-table-column prop="bid" label="借阅书id"/>
    <el-table-column prop="otime" label="借出时间"/>
    <el-table-column prop="itime" label="归还时间"/>
    <el-table-column prop="quantity" label="借出数量"/>
    <el-table-column prop="tel" label="联系方式"/>
    <el-table-column label="操作">
      <template v-slot="scop">
        <el-button type="success" @click="openEditDialog(scop.row)" size="small" icon="el-icon-edit-outline">编辑</el-button>
        <el-button type="danger" @click="remove(scop.row)" size="small" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--  分页-->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pager.page"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="pager.size"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pager.total">
  </el-pagination>
  <el-dialog>

  </el-dialog>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      editFlag: false,
      addFlag: false,
      name:"",
      tableData:[],
      borrow: [],//暂存当前行数据方便在对话框显示
      pager: {
        page:1,
        size: 10,
        total: 0,
      }
    }
  },
  methods: {
    openAddDialog() {
       this.addFlag = !this.addFlag;
    },
    openEditDialog(row) {
      this.borrow = row;
      this.editFlag = !this.editFlag;
    },
    remove() {
      this.$http.delete('http://localhost:8081/borrow/remove?boid=' + row.boid)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'success',
            })
            this.borrowList();
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: "删除异常",
            type: 'error',
          })
        })
    },
    handleSizeChange(val) {
      this.pager.size=val;
      this.borrowList();
    },
    handleCurrentChange(val) {
      this.pager.page=val;
      this.borrowList();
    },
    borrowList() {
      this.$http.get('http://localhost:8081/borrow/list', {
        params: {
          page: this.pager.page,
          size: this.pager.size,
          bname: this.name,
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.data;
            this.pager.total = res.data.data.total;
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: "获取异常",
            type: 'error',
          })
      })
    }
  },
  mounted() {
      this.borrowList();
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 10px;
}

.el-col {
  margin-left: 10px;
}
</style>
