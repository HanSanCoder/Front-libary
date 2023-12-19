<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path: '/category'}">馆藏类型管理</el-breadcrumb-item>
    <el-breadcrumb-item>借阅管理</el-breadcrumb-item>
    <el-breadcrumb-item>日子信息</el-breadcrumb-item>
  </el-breadcrumb>
  <template>
    <!--  占位符-->
    <div style="height: 100px"></div>
  </template>
  <el-row>
    <el-col :span="6"><el-input v-model="bname" placeholder="请输入添加的书名"></el-input></el-col>
    <el-col :span="6"><el-button type="primary" @click="openAddDialog">添加</el-button></el-col>
  </el-row>
  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="学号"
      label="s_no">
    </el-table-column>
    <el-table-column
      prop="姓名"
      label="s_name">
    </el-table-column>
    <el-table-column
      prop="性别"
      label="s_age">
    </el-table-column>
    <el-table-column
      prop="年龄"
      label="s_age">
    </el-table-column>
    <el-table-column
      prop="部门"
      label="s_department">
    </el-table-column>
    <el-table-column label="操作">
      <template v-slot="scop">
        <el-button type="success" @click="openEditDialog(scop.row)">编辑</el-button>
        <el-button type="danger" @click="remove(scop.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
<!--  添加图书对话框-->
  <el-dialog title="添加图书" :visible.sync="addFlag">
    <el-form :model="book" :rules="rules" ref="addbook">
      <el-form-item label="图书名称" prop="bname">
        <el-input v-model="book.bname"></el-input>
      </el-form-item>
      <el-form-item label="图书作者" prop="author">
        <el-input v-model="book.author"></el-input>
      </el-form-item>
      <el-form-item label="图书价格" prop="price">
        <el-input v-model="book.price"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addFlag = false">取 消</el-button>
      <el-button type="primary" @click="addSave">保存</el-button>
    </div>
  </el-dialog>
  <!--  编辑图书对话框-->
  <el-dialog title="添加图书" :visible.sync="editFlag">
    <el-form :model="book">
      <el-form-item label="图书名称" prop="bname">
        <el-input v-model="book.bname"></el-input>
      </el-form-item>
      <el-form-item label="图书作者" prop="author">
        <el-input v-model="book.author"></el-input>>
      </el-form-item>
      <el-form-item label="图书价格" prop="price">
        <el-input v-model="book.price"></el-input>>
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
    :current-page="currentPage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400">
  </el-pagination>
</div>
</template>

<script>
export default {
  data() {
    return {
      pages: {
        page: '',
        size:'',
        total:0,
      },
      addFlag: false,
      editFlag: false,
      tableData: [],
      bid: '',
      bname: '',
      author: '',
      price: '',
      availability:'',
      isDelete:'',
      book: {},
      rules: {
        bname: [{required: true, message: '请输入图书名称', trigger: 'blur'}],
        author: [{required: true, message: '请输入作者', trigger: 'blur'}],
        price: [{required: true, message: '请输入价格', trigger: 'blur'}],
      },
    }
  },
  methods: {
    openEditDialog(row) {
      this.editFlag = !this.editFlag;
      this.book = row;
    },
    openAddDialog() {
      this.addFlag = !this.addFlag;
    },
    addSave() {
      //表单验证后就将数据保存后端
      this.$refs['addbook'].validate(valid=>{
        if(valid) {
          this.$http.post("http://localhost:8080/book/addBook", this.book).then(res=>{
            if (res.data.code=200) {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success',
              })
              this.openAddDialog();
              this.bookList();
            }
          }).catch(error=>{
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
        this.$http.put('http://localhost:8080/book/editBook', this.book)
          .then(res=>{
            if (res.data.code == 200){
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success'
              })
            };
            this.editFlag = !this.editFlag;
            this.bookList();
          }).catch(error=>{
            this.$message({
              showClose: true,
              message: '编辑异常',
              type: 'error',
            })
        })
    },
    bookList() {
      this.$http.get("http://localhost:8080/book/BookList", config)
        .then(res=>{
          if (res.data.code == 200) {
            this.tableData = res.data.data;
          }
      }).catch(error => {
        this.$message({
          showClose: true,
          message: "网络异常",
          type: 'error',
        })
      })
    }
  },

  remove(row) {
    this.$http.get('http://localhost:8080/book/deleteBook?bid=' + row).then(res=>{
      if (res.data.code == 200) {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success',
          })
      };
      this.bookList();
    }).catch(error=>{
      this.$message({
        showClose:true,
        message:'删除异常',
        type:'error',
      })
    })
  },
  handleSizeChange(page) {
    this.pages.page=page;
    this.bookList()
  },
  handleCurrenetChange(size) {
    this.pages.size=size;
    this.bookList();
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
</style>
