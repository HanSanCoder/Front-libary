<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/category'}">馆藏类型管理</el-breadcrumb-item>
      <el-breadcrumb-item>借阅管理</el-breadcrumb-item>
      <el-breadcrumb-item>日子信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="6"><el-input v-model="catename" clearable @change="bookList" placeholder="请输入添加的馆藏名"></el-input></el-col>
      <el-col :span="6"><el-button type="primary" @click="openAddDialog">添加</el-button></el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="cateid"
        label="馆藏id">
      </el-table-column>
      <el-table-column
        prop="catename"
        label="馆藏名">
        <template v-slot="scope">
          <el-popover trigger="hover" ></el-popover>
          <p>图书介绍：{{scope.row.catename}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifytime"
        label="修改时间">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scop">
          <el-button type="success" @click="openEditDialog(scop.row)" size="small" icon="el-icon-edit-outline">编辑</el-button>
          <el-button type="danger" @click="remove(scop.row)" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  添加图书对话框-->
    <el-dialog title="添加馆藏" :visible.sync="addFlag">
      <el-form :model="categorys" :rules="rules" ref="addcategory">
        <el-form-item label="馆藏名">
          <el-input v-model="categorys.catename"></el-input>
        </el-form-item>
        <el-form-item label="馆藏ID" prop="author">
          <el-input v-model="categorys.createtime"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="addSave">保存</el-button>
      </div>
    </el-dialog>
    <!--  编辑图书对话框-->
    <el-dialog title="编辑馆藏" :visible.sync="editFlag">
      <el-form :model="category">
        <el-form-item label="馆藏名称" prop="catename">
          <el-input v-model="category.catename"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createtime">
          <el-input v-model="category.createtime"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="editSave()">保存</el-button>
      </div>
    </el-dialog>
    <!--  分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pages.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pages.total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pages: {
        page: 1,
        size: 5,
        total: 0,
      },
      categorys:[],
      createtime: '',
      addFlag: false,
      editFlag: false,
      tableData: [],
      cateid: '',
      catename: '',
      author: '',
      price: '',
      availability: '',
      isDelete: '',
      category: {},
      rules: {
        catename: [{required: true, message: '请输入图书名称', trigger: 'blur'}],
        author: [{required: true, message: '请输入作者', trigger: 'blur'}],
        price: [{required: true, message: '请输入价格', trigger: 'blur'}],
      },
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pages.page = val;
      this.bookList();
    },
    handleSizeChange(val) {
      this.pages.size = val;
      this.bookList();
    },
    openEditDialog(row) {
      this.editFlag = !this.editFlag;
      this.category = row;
    },
    openAddDialog() {
      this.addFlag = !this.addFlag;
    },
    addSave() {
      //表单验证后就将数据保存后端
      this.$refs['addcategory'].validate(valid => {
        if (valid) {
          this.$http.post("http://localhost:8081/category/save", this.categorys).then(res => {
            if (res.data.code = 200) {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success',
              })
              this.openAddDialog();
              this.bookList();
            }
          }).catch(error => {
            this.$message({
              showClose: true,
              message: "添加异常",
              type: 'error',
            })
          })
        }
      })
    },
    editSave() {
      this.$http.put('http://localhost:8081/category/update', this.category)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'success'
            })
          }
          ;
          this.editFlag = !this.editFlag;
          this.bookList();
        }).catch(error => {
        this.$message({
          showClose: true,
          message: '编辑异常',
          type: 'error',
        })
      })
    },
    bookList() {
      this.$http.get("http://localhost:8081/category/list", {
        params: {
          page: this.pages.page,
          size: this.pages.size,
          catename: this.catename,
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data.data;
            this.pages.total = res.data.data.total;
          }
        }).catch(error => {
        this.$message({
          showClose: true,
          message: "网络异常",
          type: 'error',
        })
      })
    },
    remove(row) {
      this.$http.delete('http://localhost:8081/category/remove?cid=' + row.cateid).then(res => {
        if (res.data.code == 200) {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success',
          })
        }
        ;
        this.bookList();
      }).catch(error => {
        this.$message({
          showClose: true,
          message: '删除异常',
          type: 'error',
        })
      })
    },
  },

  mounted() {
    this.bookList();
  }
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
