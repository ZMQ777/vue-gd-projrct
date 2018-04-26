import Vue from "vue";
import Router from "vue-router";
import loginManagement from "../components/login";
import mainManagement from "../components/main";
import userManagement from "../components/user";
import groupManagement from "../components/group";
import ruleManagement from "../components/rule";
import addRuleManagement from "../components/addrule";
import authManagement from "../components/auth";
import work_management from "../components/work";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "logincomponent",
      component: loginManagement
    },
    {
      path: "/logincomponent",
      name: "loginManagement",
      component: loginManagement
    },
    {
      path: "/mainManagement",
      name: "mainManagement",
      component: mainManagement,
      children: [
        {
          path: "/userManagement",
          component: userManagement
        },
        {
          path: "/groupManagement",
          component: groupManagement
        },
        {
          path: "/ruleManagement",
          component: ruleManagement
        },
        {
          path: "/addRuleManagement",
          component: addRuleManagement
        },
        {
          path: "/authManagement",
          component: authManagement
        },
        {
          path: "/work_management",
          component: work_management
        }
      ]
    }
  ]
});
