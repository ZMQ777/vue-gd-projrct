<template>
  <div>
    <div style="margin-bottom: 10px;text-align: left;">
      <span style="color: #409EFF;">权限管理</span>
      <span>&nbsp;&nbsp;>&nbsp;&nbsp;</span>
      <span style="color: #409EFF;">角色管理</span>
    </div>
    <div class="ruleMain">
      <div class="ruleLeft">
        <el-table :data="tableData1" tooltip-effect="dark" ref="table1" :row-class-name="tableRowClassName" border style="width: 100%;height: auto;"
          max-height="700" @row-click='rowClick'>
          <el-table-column prop="rule_id" label="角色ID" width="100" align="center"></el-table-column>
          <el-table-column prop="rule_name" label="角色名称" width="155" align="center"></el-table-column>
          <el-table-column prop="rule_inro" label="角色简介" width="155" align="center"></el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template slot-scope="scope">
              <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="ruleRight">
        <el-table :data="tableData2" ref="table2" border @selection-change="handleSelectionChange" style="width: 100%;height: auto;"
          max-height="350">
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
          <el-table-column prop="auth_id" label="权限ID" width="150" align="center"></el-table-column>
          <el-table-column prop="auth_name" label="权限名称" width="150" align="center"></el-table-column>
          <el-table-column prop="auth_inro" label="权限信息" width="150" align="center"></el-table-column>
        </el-table>
        <div>
          <div>角色&nbsp;&nbsp;&nbsp;I&nbsp;&nbsp;&nbsp;D
            <el-input v-model="rule_id" placeholder="请输入内容" v-bind:disabled="true"></el-input>
          </div>
          <div>角色名称
            <el-input v-model="rule_name" placeholder="请输入内容" @change="inputchange()" @blur="inputBlur()"></el-input>
          </div>
          <div>角色信息
            <el-input v-model="rule_inro" placeholder="请输入内容" @change="inputchange()" @blur="inputBlur()"></el-input>
          </div>
          <div style="margin: 30px;">
            <el-button type="primary" @click="operating()" v-bind:disabled="beDisabled">保存</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  //角色修改
  export default {
    name: 'ruleManagement',
    data() {
      return {
        author: "微信公众号 jinkey-love",
        rule_inro: '',
        rule_id: '',
        rule_name: '',
        currentPage: 1,
        tpageSize: 20,
        pageCount: 100,
        pageSizeNum: 10,
        tableData1: [],
        tableData2: [],
        multipleSelection: [],
        beDisabled: true
      }
    },
    mounted: function () {

    },
    methods: {
      deleteClick(row) {
        var rule_id = row.rule_id;
        this.$confirm('此操作将永久删除条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://47.98.208.25/admin/Rule/delete', {
            "id": rule_id
          }, {
            emulateJSON: true
          }).then((response) => {
            if (response.data) {
              this.$http.get('http://47.98.208.25/admin/Rule/getRule').then((
                response) => {
                this.tableData1 = response.data.items;
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
      operating() {
        console.log(this.multipleSelection);

        var authList = [];
        this.multipleSelection.forEach(function (val, index, arr) {
          authList.push(val.auth_id);
        })
        var rule_authStr = authList.sort(function (a, b) {
          return a > b ? 1 : -1
        });
        rule_authStr = rule_authStr.join(",");

        var rule_id = this.rule_id;
        var rule_name = this.rule_name;
        var rule_inro = this.rule_inro;

        //				console.log(rule_id,rule_name,rule_inro,rule_authStr);

        this.$http.post('http://47.98.208.25/admin/Rule/update/id/' + rule_id, {
          "rule_id": rule_id,
          "rule_name": rule_name,
          "rule_inro": rule_inro,
          "rule_auth": rule_authStr
        }, {
          emulateJSON: true
        }).then((response) => {
          if (response.data) {
            this.$http.get('http://47.98.208.25/admin/Rule/getRule').then((
              response) => {
              this.tableData1 = response.data.items;
            });
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }
        });

      },
      inputchange: function () {
        if (this.rule_name != '' && this.rule_inro != '') {
          this.beDisabled = false;
        } else {
          this.beDisabled = true;
        }
      },
      inputBlur: function () {
        //				
        //				if(this.rule_name != '' && this.rule_inro != '') {
        //					this.beDisabled = false;
        //				}else{
        //					this.beDisabled = true;
        //				}
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      updateClick(row) {
        console.log(row.date);
      },
      rowClick(row, event) {
        this.beDisabled = false;
        this.rule_id = row.rule_id;
        this.rule_name = row.rule_name;
        this.rule_inro = row.rule_inro;

        var authArr = row.rule_auth.split(",");

        var rows = [];
        this.tableData2.forEach(function (val1, index1, arr1) {
          authArr.forEach(function (val2, index2, arr2) {
            if (val1.auth_id == val2) {
              rows.push(index1);
            }
          })
        })
        this.$refs.table2.clearSelection();
        rows.forEach(row => {
          this.$refs.table2.toggleRowSelection(this.tableData2[row], true);
        });
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
        alert(currentPage);
      },
      selectionChange: function (selections) {
        this.$emit("selectionChange", selections);
        alert("selectionChange");
      },
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (rowIndex % 2 == 1) {
          return 'warning-row';
        } else if (rowIndex % 2 == 0) {
          return 'success-row';
        }
        return '';
      }
    },
    created() {
      this.$http.get('http://47.98.208.25/admin/Rule/getRule').then((response) => {
        this.tableData1 = response.data.items;
      });
      this.$http.get('http://47.98.208.25/admin/Auth/get/rule_auth/0').then((response) => {
        this.tableData2 = response.data.items;
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
  .ruleMain {
    width: 80vw;
    /*border: black 1px solid;*/
    display: flex;
    flex-flow: row;
    height: 95vh;
  }

  .ruleLeft {
    /*border: #DD514C 1px solid;*/
    width: 50%;
    /*height: 100%;*/
    box-sizing: border-box;
  }

  .ruleRight {
    /*border: yellow 1px solid;*/
    width: 50%;
    box-sizing: border-box;
  }

  .ruleMain .el-textarea {
    margin-top: 30px;
    width: 50%;
  }

  .ruleMain .el-input {
    margin-top: 30px;
    width: 50%;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    /*background: #f0f9eb;*/
  }

</style>
