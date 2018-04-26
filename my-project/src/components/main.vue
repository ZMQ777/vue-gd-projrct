<template>
  <div>
    <el-container id="mainbox">
      <el-header>
        xxxx
      </el-header>
      <el-container>
        <el-aside width="201px" style="overflow: hidden;height: calc(100vh - 60px);">
          <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :router="true" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
            <div v-for="a in arr">
              <div v-if="a.children.length==0">
                <el-menu-item v-bind:index="a.index">
                  <i v-bind:class="a.icon"></i>
                  <span slot="title">{{a.title}}</span>
                </el-menu-item>
              </div>
              <div v-else>
                <el-submenu v-bind:index="a.index">
                  <template slot="title">
                    <i v-bind:class="a.icon"></i>
                    <span slot="title">{{a.title}}</span>
                  </template>
                  <el-menu-item-group v-for="b in a.children">
                    <el-menu-item v-bind:index="b.index">{{b.title}}</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </div>
            </div>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  export default {
    name: "mainManagement",
    data() {
      return {
        msg: "Welcome to Your Vue.js App",
        isCollapse: false,
        arr: []
      };
    },
    methods: {
      handleOpen(key, keyPath) {

      },
      handleClose(key, keyPath) {

      }
    },
    created() {
      var url = localStorage.getItem("url");
      this.$http.get(url).then((response) => {
        if (typeof (response.data) == "string") {
          this.arr = JSON.parse(response.data);
        } else {
          this.arr = response.data;
        }
      });
    }
  };

</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  #mainbox .el-submenu {
    width: 100%;
  }

  #mainbox .el-header {
    line-height: 60px;
    font-weight: 600;
    font-size: 20px;
  }

  #mainbox .el-menu {
    height: 100%;
  }

  body {
    padding: 0;
    margin: 0;
  }

</style>
