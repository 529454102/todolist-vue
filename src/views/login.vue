<template>
  <div class="loginContainer">
    <el-form ref="loginForm" :model="loginForm" :rules="rules">
      <h1>todolist</h1>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" type="text"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          type="password"
          @keyup.enter.native="handleLogin"
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="el-button" @click="handleLogin">登录</el-button>
    </el-form>
    <div class="text">
      没有账号？
      <router-link to="/register">点击注册</router-link>
    </div>
  </div>
</template>

<script>
import { loginAPI } from "@/api/user";
import { setToken } from "@/utils/auth";
import Message from "@/utils/message";
export default {
  name: "login",
  components: {},
  data() {
    const checkUsername = (rule, value, callback) => {
      if (value.indexOf(" ") !== -1) {
        return callback(new Error("用户名不能有空格"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { validator: checkUsername, trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    async handleLogin() {
      this.$refs["loginForm"]
        .validate()
        .then(async () => {
          const obj = { ...this.loginForm };
          try {
            const res = await loginAPI(obj);
            setToken("token", res.token);
            setToken("username", this.loginForm.username);
            this.$store.commit("SET_TOKEN", res.token);
            this.$store.commit("SET_USERNAME", this.loginForm.username);
            Message({ message: "登陆成功", type: "success" });
            this.$router.push('/')
          } catch (error) {
            console.log(error);
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang='scss' scoped>
.loginContainer {
  width: 500px;
  margin: 0 auto;
  text-align: center;
  padding-top: 150px;
  .el-button {
    width: 100%;
  }
  .text {
    float: right;
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>