<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "app",
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
      // var url = "http://47.98.208.25/admin/User/getJson";
      // this.$http.get(url).then((response) => {
      //   this.arr = response.data;
      // });
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

  #mainbox .el-menu {}

  body {
    padding: 0;
    margin: 0;
  }

  #app {
    min-width: 1400px !important;
    max-width: 1400px !important;
    margin: 0 auto;
  }

</style>
