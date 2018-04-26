<template>
  <el-container id="addRuleM">
    <el-header>
      <div style="margin-bottom: 10px;">
        <span style="color: #409EFF;">权限管理</span>
        <span>&nbsp;&nbsp;>&nbsp;&nbsp;</span>
        <span style="color: #409EFF;">添加角色</span>
      </div>
    </el-header>
    <el-main>
      <template>
        <el-table ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange" :data="tableData" border style="width: 100%"
          max-height="400">
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
          <el-table-column prop="auth_id" label="ID" width="300vw" align="center"></el-table-column>
          <el-table-column prop="auth_name" label="分组名称" width="350vw" align="center"></el-table-column>
          <el-table-column prop="auth_inro" label="分组详细" width="350vw" align="center"></el-table-column>
        </el-table>
      </template>
    </el-main>
    <el-footer>
      <div class="demo-input-suffix">
        角色名称：
        <el-input placeholder="请输入角色名称" prefix-icon="el-icon-search" v-model="rule_name" @change="inputchange('rule_name',rule_name)">
        </el-input>
      </div>
      <div class="demo-input-suffix">
        角色信息：
        <el-input placeholder="请输入角色信息" prefix-icon="el-icon-search" v-model="rule_inro" @change="inputchange('rule_inro',rule_inro)">
        </el-input>
      </div>
      <div>
        <el-button type="primary" @click="operating()" v-bind:disabled="beDisabled">添加</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
  //角色新增
  export default {
    name: "addRuleManagement",
    data() {
      return {
        author: "",
        rule_name: '',
        rule_inro: '',
        currentPage: 1,
        tpageSize: 20,
        pageCount: 100,
        pageSizeNum: 10,
        tableData: [],
        multipleSelection: [],
        beDisabled: true
      }
    },
    mounted: function () {

    },
    methods: {
      deleteClick(row) {
        console.log(row);
      },
      updateClick(row) {
        console.log(row.date);
      },
      operating(row, data) {
        var rule_name = this.rule_name;
        var rule_inro = this.rule_inro;
        var authArr = [];
        this.multipleSelection.forEach(function (val, index, arr) {
          authArr.push(val.auth_id);
        })
        var rule_auth = authArr.sort(function (a, b) {
          return a > b ? 1 : -1
        });
        rule_auth = authArr.join(",");

        this.$http.post('http://47.98.208.25/admin/Rule/save', {
          "rule_name": rule_name,
          "rule_inro": rule_inro,
          "rule_auth": rule_auth
        }, {
          emulateJSON: true
        }).then((response) => {
          if (response.data) {
            this.dialogFormVisible = false;
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          }
        });

      },
      inputchange: function (errorItem, inputContent) {

        if (this.rule_name != '' && this.rule_inro != '') {
          this.beDisabled = false;
        } else {
          this.beDisabled = true;
        }
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
  #addRuleM {}

  #addRuleM .el-header {
    text-align: left;
    /* height: 20px !important; */
  }

  #addRuleM .el-footer .el-input {
    width: 200px;
  }

  .demo-input-suffix {
    margin-bottom: 30px;
  }

</style>
