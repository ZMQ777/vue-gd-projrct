<template>
  <el-container id="groupM">
    <el-header id="groupH">
      <el-button type="primary" @click="tt">+分组添加</el-button>
    </el-header>
    <el-main>
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="group_id" label="ID" width="300vw" align="center"></el-table-column>
          <el-table-column prop="group_name" label="分组名称" width="620vw" align="center"></el-table-column>
          <el-table-column label="操作" width="190vw" align="center">
            <template slot-scope="scope">
              <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="updateClick(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-main>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分组ID" :label-width="formLabelWidth" style="display: none;">
          <el-input v-model="form.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分组名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="operating()">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    name: 'groupcomponent',
    data() {
      return {
        tableData: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        title: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    mounted: function () {

    },
    methods: {
      tt() {
        this.title = "分组添加"
        this.form.name = "";
        this.dialogFormVisible = true;
      },
      deleteClick(row) {
        var group_id = row.group_id;
        this.$confirm('此操作将永久删除条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('http://47.98.208.25/admin/Group/delete/id/' + group_id).then((response) => {
            if (response.data) {
              this.$http.get('http://47.98.208.25/admin/Group/get').then((response) => {
                this.tableData = response.body;
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
        console.log(row.date);
        this.title = "分组修改"
        this.form.name = row.group_name;
        this.form.id = row.group_id;
        this.dialogFormVisible = true;
      },
      operating() { //操作

        var group_name = this.form.name;
        var group_id = this.form.id
        if (this.title == "分组添加") {
          this.$http.post('http://47.98.208.25/admin/Group/save/', {
            "group_name": group_name
          }).then((response) => {
            if (response.data) {
              this.$http.get('http://47.98.208.25/admin/Group/get').then((response) => {
                this.tableData = response.body;
              });
              this.dialogFormVisible = false;
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
            }
          });
        } else if (this.title == "分组修改") {
          this.$http.post('http://47.98.208.25/admin/Group/update/id/' + group_id, {
            "group_id": group_id,
            "group_name": group_name
          }).then((response) => {
            if (response.data) {
              this.$http.get('http://47.98.208.25/admin/Group/get').then((response) => {
                this.tableData = response.body;
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
      this.$http.get('http://47.98.208.25/admin/Group/get').then((response) => {
        if (typeof (response.body) == "string") {
          this.tableData = JSON.parse(response.body);
        } else {
          this.tableData = response.body;
        }
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
  #groupH {
    text-align: left !important;
  }

  #groupM {
    width: 80vw;
  }

</style>
