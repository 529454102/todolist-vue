<template>
  <div class="loginContainer">
    <el-form ref="Form" :model="Form" :rules="rules">
      <h1>注册</h1>
      <el-form-item prop="username">
        <el-input v-model="Form.username" placeholder="请输入用户名" type="text"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="Form.password"
          placeholder="请输入密码"
          type="password"
          @keyup.enter.native="handleRegister"
        ></el-input>
      </el-form-item>
      <el-form-item prop="rpassword">
        <el-input
          v-model="Form.rpassword"
          placeholder="请再次输入密码"
          type="password"
          @keyup.enter.native="handleRegister"
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="el-button" @click="handleRegister">注册</el-button>
    </el-form>
    <div class="text">
      已有账号？
      <router-link to="/login">点击登陆</router-link>
    </div>
  </div>
</template>

<script>
import { registerAPI } from "@/api/user";
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
    const checkPassword = (rule, value, callback) => {
      if (value !== this.Form.password) {
        return callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      Form: {
        username: "",
        password: "",
        rpassword: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { validator: checkUsername, trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        rpassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async handleRegister() {
      this.$refs["Form"]
        .validate()
        .then(async () => {
          const obj = {
              username: this.Form.username,
              password: this.Form.password
          };
          try {
            const res = await registerAPI(obj);
            Message({ message: "注册成功,请登陆", type: "success" });
            this.$router.push("login")
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