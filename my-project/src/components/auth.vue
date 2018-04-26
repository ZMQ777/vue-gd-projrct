<template>
  <el-container id="authM">
    <el-header>
      <div style="margin-bottom: 10px;">
        <span style="color: #409EFF;">权限管理</span>
        <span>&nbsp;&nbsp;>&nbsp;&nbsp;</span>
        <span style="color: #409EFF;">权限管理</span>
      </div>
    </el-header>
    <el-main>
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="auth_id" label="权限ID" width="300vw" align="center"></el-table-column>
          <el-table-column prop="auth_name" label="权限名称" width="320vw" align="center"></el-table-column>
          <el-table-column prop="auth_inro" label="权限信息" width="320vw" align="center"></el-table-column>
          <el-table-column label="操作" width="190vw" align="center">
            <template slot-scope="scope">
              <el-button @click="addClick(scope.row)" type="text" size="small">新增</el-button>
              <el-button @click="updateClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-main>
    <div>
      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="权限ID" :label-width="formLabelWidth" style="display: none;">
            <el-input v-model="form.auth_id" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限名称" :label-width="formLabelWidth">
            <el-input v-model="form.auth_name" auto-complete="off" @change="inputchange('auth_name',form.auth_name)" @blur="inputBlur('auth_name',form.auth_name)"></el-input>
            <p>{{form.auth_nameError}}</p>
          </el-form-item>
          <el-form-item label="权限信息" :label-width="formLabelWidth">
            <el-input v-model="form.auth_inro" auto-complete="off" @change="inputchange('auth_inro',form.auth_inro)" @blur="inputBlur('auth_inro',form.auth_inro)"></el-input>
            <p>{{form.auth_inroError}}</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="operating()" v-bind:disabled="form.beDisabled">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
  //权限管理
  export default {
    data() {
      return {
        author: "",
        input: '',
        currentPage: 1,
        tpageSize: 20,
        pageCount: 100,
        pageSizeNum: 10,
        tableData: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        title: '',
        form: {
          auth_name: '',
          auth_nameError: '',
          auth_inro: '',
          auth_inroError: '',
          auth_id: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          beDisabled: false
        },
        formLabelWidth: '120px'
      }
    },
    mounted: function () {

    },
    methods: {
      deleteClick(row) {
        var auth_id = row.auth_id;
        this.$confirm('此操作将永久删除条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('http://47.98.208.25/admin/Auth/delete/id/' +
            auth_id).then((response) => {
            if (response.data) {
              this.$http.get('http://47.98.208.25/admin/Auth/get/rule_auth/0')
                .then((response) => {
                  this.tableData = response.data.items;
                });
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      updateClick(row) {
        this.dialogFormVisible = true
        this.form.auth_nameError = "";
        this.form.auth_inroError = "";
        this.title = "权限修改";
        console.log(row.auth_id);
        this.form.auth_id = row.auth_id;
        this.form.auth_name = row.auth_name;
        this.form.auth_inro = row.auth_inro;
        this.form.beDisabled = false;
      },
      addClick(row) {
        this.dialogFormVisible = true
        this.form.auth_nameError = "";
        this.form.auth_inroError = "";
        this.title = "权限新增";
        this.form.auth_id = "";
        this.form.auth_name = "";
        this.form.auth_inro = "";
        this.form.beDisabled = true;
      },
      inputchange: function (errorItem, inputContent) {

        if (this.form.auth_name != '' && this.form.auth_inro != '') {
          this.form.beDisabled = false;
        } else {
          this.form.beDisabled = true;
        }
        console.log(this.form.beDisabled)
      },
      inputBlur: function (errorItem, inputContent) {
        if (errorItem === 'auth_name') {
          if (inputContent === '') {
            this.form.auth_nameError = '权限名称不能为空'
          } else {
            this.form.auth_nameError = '';
          }
        } else if (errorItem === 'auth_inro') {
          if (inputContent === '') {
            this.form.auth_inroError = '权限信息不能为空'
          } else {
            this.form.auth_inroError = '';
          }
        }
      },
      operating() {

        var auth_id = this.form.auth_id;
        var auth_name = this.form.auth_name;
        var auth_inro = this.form.auth_inro;

        if (this.title == "权限新增") {
          this.$http.post('http://47.98.208.25/admin/Auth/save', {
            "auth_id": auth_id,
            "auth_name": auth_name,
            "auth_inro": auth_inro
          }, {
            emulateJSON: true
          }).then((response) => {
            if (response.data) {
              this.$http.get('http://47.98.208.25/admin/Auth/get/rule_auth/0').then(
                (response) => {
                  this.tableData = response.data.items;
                });
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
            }
          });
        } else if (this.title == "权限修改") {
          this.$http.post('http://47.98.208.25/admin/Auth/update/id/' + auth_id, {
            "auth_id": auth_id,
            "auth_name": auth_name,
            "auth_inro": auth_inro
          }, {
            emulateJSON: true
          }).then((response) => {
            if (response.data) {
              this.$http.get('http://47.98.208.25/admin/Auth/get/rule_auth/0').then(
                (response) => {
                  this.tableData = response.data.items;
                });
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            }
          });
        }

      }
    },
    created() {
      this.$http.get('http://47.98.208.25/admin/Auth/get/rule_auth/0').then((response) => {
        this.tableData = response.data.items;
      });
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    ready: function () {

    }
  }

</script>

<style>
  #authM .el-header {
    text-align: left;
  }

</style>
