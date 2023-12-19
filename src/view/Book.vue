<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/book'}">馆藏图书管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="6"><el-input v-model="bname" clearable @change="bookList" placeholder="请输入书名"></el-input></el-col>
      <el-col :span="6"><el-button type="primary" @click="openAddDialog">添加</el-button></el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column prop="bid" label="图书id"/>
      <el-table-column prop="bname" label="书名"/>
      <el-table-column prop="price" label="价格"/>
      <el-table-column prop="author" label="作者"/>
      <el-table-column prop="ddesc" label="简介"/>
      <el-table-column prop="quantity" label="数量"/>
      <el-table-column prop="catename" label="所属类别"/>
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
<!--    添加图书对话框-->
    <el-dialog title="添加图书" :visible.sync="addFlag">
      <el-form :model="newbook" :rules="rules" ref="addBook">
        <el-form-item label="书名" prop="bname">
          <el-input v-model="newbook.bname"/>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="newbook.price"/>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="newbook.author"/>
        </el-form-item>
        <el-form-item label="简介" prop="ddesc">
          <el-input v-model="newbook.ddesc"/>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="newbook.quantity"/>
        </el-form-item>
        <el-form-item label="所属类型">
<!--          <el-input v-model="newbook.catename"/>-->
          <el-select v-model="newbook.cateid" placeholder="请选择类别">
            <el-option v-for="(item, key) in options"
              :key="key"
              :label="item.catename"
              :value="item.cateid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="addSave">确 定</el-button>
      </div>
    </el-dialog>

<!--    编辑对话框-->
    <el-dialog title="编辑图书" :visible.sync="editFlag">
      <el-form :model="book" :rules="rules" ref="editBook">
        <el-form-item label="书名" prop="bname">
          <el-input v-model="book.bname"/>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="book.price"/>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="book.author"/>
        </el-form-item>
        <el-form-item label="简介" prop="ddesc">
          <el-input v-model="book.ddesc"/>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="book.quantity"/>
        </el-form-item>
        <el-form-item label="所属类型">
<!--          <el-input v-model="book.catename"/>-->
          <el-select v-model="newbook.cateid" placeholder="请选择类别">
            <el-option v-for="(item, key) in options"
                       :key="key"
                       :label="item.catename"
                       :value="item.cateid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="editSave">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      newbook:[],
      editFlag: false,
      addFlag: false,
      tableData:[],
      book: [],//暂存当前行数据方便在对话框显示
      pager: {
        page:1,
        size: 10,
        total: 0,
      },
      options:[],
      rules:{
        bname: [{required: true, message:"请输入书名",trigger: 'blur'}],
        price: [{required: true, message:"请输入价格",trigger: 'blur'}],
        author: [{required: true, message:"请输入作者",trigger: 'blur'}],
        quantity: [{required: true, message:"请输入数量",trigger: 'blur'}],
        catename: [{required: true, message:"请输入类型",trigger: 'blur'}],
      },
    }
  },
  methods: {
    findCategory() {
        this.$http.get('http://localhost:8081/category/findAllCategory')
          .then(res => {
          if (res.data.code == 200) {
            this.options = res.data.data.data;
          }
        })
          .catch(error => {
            this.$message({
              showClose: true,
              message: "获取类型异常",
              type: 'error',
            })
          })
    },

    editSave() {
      this.$refs['editBook'].validate(value => {
        if (value) {
          this.$http.put('http://localhost:8081/book/update', this.book)
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: 'success',
                })
              };
              this.editFlag = !this.editFlag;
              this.bookList();
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: "修改异常",
                type: 'error',
              })
            })
        }
      })
    },

    addSave() {
      this.$refs['addBook'].validate(value => {
        this.$http.post('http://localhost:8081/book/save', this.newbook)
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'success',
              })
            };
            this.addFlag = !this.addFlag;
            this.bookList();
          })
          .catch(error => {
            this.$message({
              showClose: true,
              message: "增加异常",
              type: 'error',
            })
          })
      })
    },

    openAddDialog() {
      this.addFlag = !this.addFlag;
    },
    openEditDialog(row) {
      this.book = row;
      this.editFlag = !this.editFlag;
    },

    remove(row) {
      this.$http.delete('http://localhost:8081/book/remove?bid=' + row.bid)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'success',
            })
          };
          this.bookList();
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
      this.bookList();
    },
    handleCurrentChange(val) {
      this.pager.page=val;
      this.bookList();
    },
    bookList() {
      this.$http.get('http://localhost:8081/book/list', {
        params: {
          page: this.pager.page,
          size: this.pager.size,
          bname: this.bname,
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
    this.bookList();
    this.findCategory();
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
