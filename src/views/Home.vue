<template>
  <div class="home">
    <div>
      欢迎您，{{username}}
      <el-link type="primary" @click="logout">退出</el-link>
    </div>
    <div class="inputContent">
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <el-input v-model="inputValue" placeholder="请输入代办事项" @keyup.enter.native="handleAdd"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane label="未完成" name="0">
        <template v-if="completeList.length > 0">
          <el-row
            class="tl mb-10"
            type="flex"
            justify="space-between"
            align="middle"
            v-for="(item, index) in completeList"
            :key="item.id"
          >
            <el-col :span="2">{{index + 1}}</el-col>
            <el-col :span="14" v-if="!item.editStatus">{{item.content}}</el-col>
            <el-col :span="14" v-if="item.editStatus">
              <el-row>
                <el-col :span="16">
                  <el-input v-model="contentValue" size="mini"></el-input>
                </el-col>
                <el-col :span="6" :offset="2">
                  <el-button
                    type="success"
                    icon="el-icon-check"
                    size="mini"
                    @click="handleEditSumbit(item)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-close"
                    size="mini"
                    @click="handleEditClose(item)"
                  ></el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-button
                type="primary"
                size="mini"
                @click="handleComplete(item.id)"
                v-show="!item.editStatus"
              >完成</el-button>
              <el-button
                type="success"
                size="mini"
                @click="handleEdit(item)"
                v-show="!item.editStatus"
              >修改</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="handleDel(item.id)"
                v-show="!item.editStatus"
              >删除</el-button>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <p>暂无待办事项</p>
        </template>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="1">
        <template v-if="completeList.length > 0">
          <el-row
            class="tl mb-10"
            type="flex"
            justify="space-between"
            align="middle"
            v-for="(item, index) in completeList"
            :key="item.id"
          >
            <el-col :span="2">{{index + 1}}</el-col>
            <el-col :span="19">{{item.content}}</el-col>
            <el-col :span="3">
              <el-button
                size="mini"
                @click="handelCancel(item.id)"
              >撤销</el-button>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <p>暂无完成事项</p>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getData, addData, editData, delData } from "@/api/list";
import Message from "@/utils/message";
export default {
  name: "home",
  data() {
    return {
      inputValue: "",
      status: 0,
      completeList: [],
      unfinishedList: [],
      contentValue: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const obj = {
        status: this.status
      };
      try {
        const res = await getData(obj);
        for (const item of res.list) {
          item.editStatus = 0;
        }
        this.completeList = res.list;
        console.log(this.completeList);
      } catch (error) {}
    },
    handleClick(tab, event) {
      this.getList()
    },
    async handleAdd() {
      if (this.inputValue.trim() === "") {
        return;
      }
      const obj = {
        content: this.inputValue.trim()
      };
      try {
        await addData(obj);
        this.inputValue = "";
        this.getList();
        Message({ message: "添加成功", type: "success" });
      } catch (error) {}
    },
    async handleComplete(id) {
      const obj = {
        id,
        status: 1
      };
      try {
        await editData(obj);
        this.getList();
        Message({ message: "完成成功", type: "success" });
      } catch (error) {}
    },
    async handleDel(id) {
      const obj = {
        id
      };
      try {
        await delData(obj);
        this.getList();
        Message({ message: "删除成功", type: "success" });
      } catch (error) {}
    },
    handleEdit(item) {
      for (const i of this.completeList) {
        i.editStatus = 0;
      }
      item.editStatus = 1;
      this.contentValue = item.content;
    },
    handleEditClose(item) {
      item.editStatus = 0;
      this.contentValue = "";
    },
    async handleEditSumbit(item) {
      const obj = {
        id: item.id,
        content: this.contentValue
      };
      try {
        await editData(obj);
        this.getList();
        Message({ message: "修改成功", type: "success" });
      } catch (error) {}
    },
    async handelCancel(id) {
      const obj = {
        id,
        status: 0
      }
      await editData(obj)
      this.getList();
      Message({ message: "撤销成功", type: "success" });
    },
    logout() {
      this.$store.dispatch("logout");
    }
  },
  computed: {
    ...mapGetters(["username"])
  }
};
</script>

<style lang="scss" scope>
.home {
  width: 500px;
  margin: 0 auto;
  text-align: center;
  padding-top: 150px;
  .inputContent {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .tl {
    text-align: left;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px;
  }
}
</style>
