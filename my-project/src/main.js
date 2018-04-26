import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueResource from "vue-resource";
import App from "./App.vue";
import router from "./router";

Vue.use(ElementUI);
Vue.use(VueResource);

router.beforeEach((to, from, next) => {
  var loginstate = localStorage.getItem("loginUSer");
  if (to.path == "/logincomponent") {
    localStorage.setItem("loginUSer", null);
    localStorage.setItem("auth_list", null);
    next();
  } else if (
    loginstate == "null" ||
    loginstate == "false" ||
    loginstate == null
  ) {
    next({
      path: "/logincomponent"
    });
  } else {
    next();
  }
});
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
