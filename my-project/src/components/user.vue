<template>
  <div class="user">
    <el-container id="userM">
      <el-header>
        <div style="margin-bottom: 10px;">
          <span style="color: #409EFF;">权限管理</span>
          <span>&nbsp;&nbsp;>&nbsp;&nbsp;</span>
          <span style="color: #409EFF;">用户管理</span>
        </div>
        <el-input v-model="name" placeholder="请输入姓名"></el-input>
        <el-button type="primary" @click="selectBtn()">查询</el-button>
      </el-header>
      <el-main>
        <template>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="50vw" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" width="100vw" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" width="100vw" align="center"></el-table-column>
            <el-table-column prop="phone" label="电话号码" width="100vw" align="center"></el-table-column>
            <el-table-column label="性别" width="100vw" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.sex==1">
                  男
                </div>
                <div v-else>
                  女
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="lock" label="锁定状态" width="120vw" align="center"></el-table-column>
            <el-table-column label="角色" width="100vw" align="center">
              <template slot-scope="scope">
                <div v-for="rule in ruleArr">
                  <div v-if="scope.row.rule==rule.rule_id">
                    {{rule.rule_name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="部门" width="200vw" align="center">
              <template slot-scope="scope">
                <div v-for="group in scope.row.tt">
                  <span>{{group.group_name}}</span>
                  <br />
                </div>
              </template>
            </el-table-column>
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
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageCount"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="ID" :label-width="formLabelWidth" style="display: none;">
            <el-input v-model="form.id" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" auto-complete="off" @change="inputchange()"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" auto-complete="off" @change="inputchange()"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" @change="inputchange()"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input v-model="form.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <!--<el-input v-model="form.sex" auto-complete="off"></el-input>-->
            <el-radio v-model="form.sex" label="1">男</el-radio>
            <el-radio v-model="form.sex" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="锁定状态" :label-width="formLabelWidth">
            <el-input v-model="form.lock" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <!--<el-input v-model="form.rule" auto-complete="off"></el-input>-->
            <el-select v-model="form.rule" placeholder="请选择" @change="inputchange()">
              <el-option v-for="rule in ruleArr" :key="rule.rule_id" :label="rule.rule_name" :value="rule.rule_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" :label-width="formLabelWidth">
            <el-select v-model="form.user_group" multiple placeholder="请选择" @change="inputchange()">
              <el-option v-for="group in groupArr" :key="group.group_id" :label="group.group_name" :value="group.group_id.toString()">
              </el-option>
            </el-select>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="operating();" v-bind:disabled="beDisabled">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: 'usercomponent',
    data() {
      return {
        msg: 'hello user!!!',
        name: '',
        title: '',
        currentPage: 1, //默认当前页
        tpageSize: 20,
        pageCount: 10, //每页最大记录数
        pageSizeNum: 10, //最大页数
        total: 100, //总记录数
        tableData: [],
        ruleArr: [], //角色集合
        groupArr: [], //部门集合
        user_groupArr: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        beDisabled: true,
        form: {
          id: '',
          username: '',
          password: '',
          name: '',
          phone: '',
          sex: '',
          lock: '',
          rule: '',
          user_group: ''
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      selectBtn() {
        var start = (this.currentPage - 1) * this.pageCount;
        this.currentPage = 1;
        if (this.name == "" || this.name == null || this.name.length == 0) {
          this.$http.post('http://47.98.208.25/admin/User/getUser', {
            "page": 0,
            "start": start,
            "limit": this.pageCount
          }, {
            emulateJSON: true
          }).then((response) => {
            this.tableData = response.data.items;
            this.total = response.data.total;

            var re = response.data.items;
            var user_group_List = re;
            re.forEach(function (val, index, arr) {
              var groupList = val.user_group.split(',');
              user_group_List[index].user_group = groupList;
            })
            this.user_groupArr = user_group_List;
          });
        } else {
          this.$http.post('http://47.98.208.25/admin/User/getUser', {
            "value": this.name,
            "page": 0,
            "start": start,
            "limit": this.pageCount
          }, {
            emulateJSON: true
          }).then((response) => {
            this.tableData = response.data.items;
            this.total = response.data.total;

            var re = response.data.items;
            var user_group_List = re;
            re.forEach(function (val, index, arr) {
              var groupList = val.user_group.split(',');
              user_group_List[index].user_group = groupList;
            })
            this.user_groupArr = user_group_List;
          });
        }
      },
      addClick(row) {
        this.dialogFormVisible = true;
        this.title = "角色新增"
        this.form.id = "";
        this.beDisabled = true;
        this.form.username = "";
        this.form.password = "";
        this.form.name = "";
        this.form.phone = "";
        this.form.sex = "1";
        this.form.lock = "";
        this.form.rule = "";
        this.form.user_group = [];

      },
      deleteClick(row) {
        var user_id = row.id;
        this.$confirm('此操作将永久删除条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://47.98.208.25/admin/User/delete', {
            "id": user_id
          }, {
            emulateJSON: true
          }).then((response) => {
            let start = (this.currentPage - 1) * this.pageCount;
            if (response.data) {
              this.$http.post('http://47.98.208.25/admin/User/getUser', {
                "page": 0,
                "start": start,
                "limit": this.pageCount
              }, {
                emulateJSON: true
              }).then((response) => {
                this.tableData = response.data.items;
                var re = response.data.items;
                var user_group_List = re;
                re.forEach(function (val, index, arr) {
                  var groupList = val.user_group.split(',');
                  user_group_List[index].user_group = groupList;
                })
                this.user_groupArr = user_group_List;
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
        this.dialogFormVisible = true;
        this.title = "角色修改"
        this.beDisabled = false;
        this.form.id = row.id;
        this.form.username = row.username;
        this.form.password = row.password;
        this.form.name = row.name;
        this.form.phone = row.phone;
        this.form.sex = row.sex.toString();
        this.form.lock = row.lock;
        this.form.rule = row.rule;
        this.form.user_group = row.user_group;

      },
      operating() { //角色新增或修改
        var id = this.form.id;
        var username = this.form.username;
        var password = this.form.password;
        var name = this.form.name;
        var phone = this.form.phone;
        var sex = this.form.sex;
        var lock = this.form.lock;
        var rule = this.form.rule;
        var user_group = this.form.user_group.join(",");
        this.dialogFormVisible = false

        if (this.title == "角色新增") {
          this.$http.post('http://47.98.208.25/admin/User/save', {
            "username": username,
            "password": password,
            "name": name,
            "phone": phone,
            "sex": sex,
            "lock": lock,
            "rule": rule,
            "user_group": user_group
          }, {
            emulateJSON: true
          }).then((response) => {
            if (response.data) {
              let start = (this.currentPage - 1) * this.pageCount;
              this.$http.post('http://47.98.208.25/admin/User/getUser', {
                "page": 0,
                "start": start,
                "limit": this.pageCount
              }, {
                emulateJSON: true
              }).then((response) => {
                this.tableData = response.data.items;
                var re = response.data.items;
                var user_group_List = re;
                re.forEach(function (val, index, arr) {
                  var groupList = val.user_group.split(',');
                  user_group_List[index].user_group = groupList;
                })
                this.user_groupArr = user_group_List;
              });

              this.$message({
                type: 'success',
                message: '新增成功!'
              });
            }
          });
        } else if (this.title == "角色修改") {
          this.$http.post('http://47.98.208.25/admin/User/update/', {
            "id": id,
            "username": username,
            "password": password,
            "name": name,
            "phone": phone,
            "sex": sex,
            "lock": lock,
            "rule": rule,
            "user_group": user_group
          }, {
            emulateJSON: true
          }).then((response) => {
            if (response.data) {
              let start = (this.currentPage - 1) * this.pageCount;
              this.$http.post('http://47.98.208.25/admin/User/getUser', {
                "page": 0,
                "start": start,
                "limit": this.pageCount
              }, {
                emulateJSON: true
              }).then((response) => {
                this.tableData = response.data.items;
                var re = response.data.items;
                var user_group_List = re;
                re.forEach(function (val, index, arr) {
                  var groupList = val.user_group.split(',');
                  user_group_List[index].user_group = groupList;
                })
                this.user_groupArr = user_group_List;
              });

              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            }
          });
        }

      },
      inputchange: function () {

        if (this.form.name != '' && this.form.username != '' && this.form.password != '' && this.form.rule != '' &&
          this.form.user_group.length != 0) {
          this.beDisabled = false;
        } else {
          this.beDisabled = true;
        }
      },
      changeSize: function () {
        this._data.tpageSize = this.pageSize;
        alert("changeSize");
      },
      //改变显示条数
      handleSizeChange: function (size) {
        this.$emit("pageSizeChange", size);
        alert("handleSizeChange");
      },
      //下一页
      handleCurrentChange: function (currentPage) {
        this.$emit("currentPageChange", currentPage);
        this.currentPage = currentPage;
        var start = (currentPage - 1) * this.pageCount;
        if (this.name == "" || this.name == null || this.name.length == 0) {
          this.$http.post('http://47.98.208.25/admin/User/getUser', {
            "page": 0,
            "start": start,
            "limit": this.pageCount
          }, {
            emulateJSON: true
          }).then((response) => {
            this.tableData = response.data.items;
            this.total = response.data.total;

            var re = response.data.items;
            var user_group_List = re;
            re.forEach(function (val, index, arr) {
              var groupList = val.user_group.split(',');
              user_group_List[index].user_group = groupList;
            })
            this.user_groupArr = user_group_List;
          });
        } else {
          this.$http.post('http://47.98.208.25/admin/User/getUser', {
            "value": this.name,
            "page": 0,
            "start": start,
            "limit": this.pageCount
          }, {
            emulateJSON: true
          }).then((response) => {
            this.tableData = response.data.items;
            this.total = response.data.total;

            var re = response.data.items;
            var user_group_List = re;
            re.forEach(function (val, index, arr) {
              var groupList = val.user_group.split(',');
              user_group_List[index].user_group = groupList;
            })
            this.user_groupArr = user_group_List;
          });
        }

      },
      selectionChange: function (selections) {
        this.$emit("selectionChange", selections);
        alert("selectionChange");
      }
    },
    created() {
      this.ruleArr = eval(JSON.parse(localStorage.getItem("ruleArr"))).items;
      this.groupArr = eval(JSON.parse(localStorage.getItem("groupArr"))).items;
      this.$http.get('http://47.98.208.25/admin/Rule/getRule').then((response) => {
        this.ruleArr = response.data.items;
      });
      this.$http.post('http://47.98.208.25/admin/User/getUser', {
        "page": 0,
        "start": 0,
        "limit": this.pageCount
      }, {
        emulateJSON: true
      }).then((response) => {
        // console.log(response);
        this.tableData = response.data.items;
        this.total = response.data.total;
        var re = response.data.items;
        var user_group_List = re;
        re.forEach(function (val, index, arr) {
          var groupList = val.user_group.split(',');
          user_group_List[index].user_group = groupList;
        })
        this.user_groupArr = user_group_List;
      });
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    beforeMount: function () {
      //载入前
    },
    mounted: function () {
      //载入后
    },
    beforeUpdate: function () {
      //更新前
      var groupArr = eval(JSON.parse(localStorage.getItem("groupArr"))).items;
      var arrT = this.tableData;
      this.tableData.forEach(function (val1, index1, arr1) {
        var val1_user_group = val1.user_group; //获取当前用户所属部门id集合
        var val1_user_group_list = []; //存储当前用户所属部门对象
        val1_user_group.forEach(function (val2, index2, arr2) {
          groupArr.forEach(function (val3, index3, arr3) {
            if (val2 == val3.group_id) {
              val1_user_group_list.push(val3);
            }
          })
          arrT[index1].tt = val1_user_group_list;
        })
      })
      this.tableData = arrT;
      //			console.log(this.tableData);
    },
    updated: function () {
      //更新后
    },
    ready() {

    }
  }

</script>

<style scoped>
  #userM .el-header {
    text-align: left;
    height: auto !important;
  }

  #userM .el-header .el-input {
    width: 200px;
  }

  #userM .el-header .el-button {
    margin-left: 5px;
  }

  .el-select-dropdown__item {
    display: block;
  }

</style>
