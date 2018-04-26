<template>
  <div class="login">
    <div class="dialog">
      <div class="loginPage">
        <h1>登录</h1>
        <el-form>
          <el-form-item label="user">
            <el-input type="text" id="user" v-model="formName.user" @blur="inputBlur('user',formName.user)"></el-input>
            <p>{{formName.userError}}</p>
          </el-form-item>
          <el-form-item label="password">
            <el-input type="password" id="password" v-model="formName.password" @blur="inputBlur('password',formName.password)"></el-input>
            <p>{{formName.passwordError}}</p>
          </el-form-item>
          <el-button type="primary" @click="submitForm('formName')" v-bind:disabled="formName.beDisabled">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'loginManagement',
    data() {
      return {
        msg: 'hello logincomponent!!!',
        formName: { //表单中的参数
          user: '',
          userError: '',
          password: '',
          passwordError: '',
          beDisabled: true
        },
        beShow: false //传值给父组件
      }
    },
    methods: {
      resetForm: function () {
        this.formName.user = '';
        this.formName.userError = '';
        this.formName.password = '';
        this.formName.passwordError = '';
      },
      submitForm: function (formName) {
        //与父组件通信传值
        //this.$emit('showState', [this.beShow,this.formName.user])
        //提交user password
        var username = this.formName.user,
          password = this.formName.password;

        this.$http.post('http://47.98.208.25/admin/User/login/', {
          "username": username,
          "password": password
        }, {
          emulateJSON: true
        }).then((response) => {
          var result = response.data.success;
          var user = response.data.items;
          if (result) {
            this.$http.post('http://47.98.208.25/admin/Rule/getRule', {
              "rule_id": user.rule
            }, {
              emulateJSON: true
            }).then((response1) => {
              var auth_list = JSON.stringify(response1.data.items);
              localStorage.setItem("auth_list", auth_list);
              this.$http.get('http://47.98.208.25/admin/Rule/getRule', {
                emulateJSON: true
              }).then(
                (response) => {
                  localStorage.setItem("ruleArr", JSON.stringify(response.data));
                  this.$http.get('http://47.98.208.25/admin/Group/getGroup', {
                    emulateJSON: true
                  }).then(
                    (
                      response) => {
                      localStorage.setItem("groupArr", JSON.stringify(response.data));
                      this.$router.push({
                        path: '/work_management'
                      })
                    });
                });


            });
            var str = JSON.stringify(response.data.items);
            localStorage.setItem("loginUSer", str);
            if (response.data.items.rule == 1) {
              localStorage.setItem("url", "http://47.98.208.25/admin/User/getJson/q/1");
            } else {
              localStorage.setItem("url", "http://47.98.208.25/admin/User/getJson");
            }
            this.$message({
              type: 'success',
              message: '登陆成功!'
            });
          } else {
            this.$message.error('登录失败!');
          }
        });
      },
      inputBlur: function (errorItem, inputContent) {
        if (errorItem === 'user') {
          if (inputContent === '') {
            this.formName.userError = '用户名不能为空'
          } else {
            this.formName.userError = '';
          }
        } else if (errorItem === 'password') {
          if (inputContent === '') {
            this.formName.passwordError = '密码不能为空'
          } else {
            this.formName.passwordError = '';
          }
        }
        //对于按钮的状态进行修改
        if (this.formName.user != '' && this.formName.password != '') {
          this.formName.beDisabled = false;
        } else {
          this.formName.beDisabled = true;
        }
      }
    }
  }

</script>

<style scoped>
  .login {
    width: 30%;
    margin: 0 auto;
  }

</style>
