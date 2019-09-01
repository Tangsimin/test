<template>
    <div class="login_container">
       <div class="login_box">
           <!-- 头像区 -->
           <div class="login_logo">
               <img src="../assets/logo.png" alt="">
           </div>
          <!-- 表单区 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
              <!-- 用户名区 -->
            <el-form-item prop="username">               
                <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码区 -->
            <el-form-item prop="password">               
               <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
            </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">               
              <el-button type="primary" @click="login">登录</el-button>
               <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
       </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm:{
                username:"唐思敏",
                password:"123"
            },
            // 这是表单的验证规则对象
            loginFormRules: {
                username:[
                    // 验证登录名称是否合法
                    {required:true,message:"请输入登录名称",trigger:"blur"},
                    {min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur'}],
                // 验证密码是否合法
                password:[
                    {required: true, message: '请输入登录密码', trigger: 'blur'},
                    {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}]
            }
        }
    },
    methods:{
        // 定义重置按钮
        resetLoginForm(){
            // console.log(this)
            this.$refs.loginFormRef.resetFields();
        },
        // 登录的预验证
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
               if(!valid) return ;
               const res= await this.$http.post('login',this.loginForm)
            //    if(res.meta.status !==200) return console.log("登录失败")
            //    console.log("登录成功")
            consolo.log(res)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width:450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
}
.login_logo{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;    
    padding: 10px;
    left:50%;
    transform: translate(-50%,-50%);
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }   
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
        display:flex;
        justify-content: flex-end;
    }
</style>