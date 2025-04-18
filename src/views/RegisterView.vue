<!-- src/views/RegisterView.vue -->
<template>
    <div class="register-view">
      <div class="left">
        <img src="@/assets/dcu-bot.png" alt="DCU BOT" style="width: 300px;" />
      </div>
      <div class="right">
        <RegisterForm />
      </div>
    </div>
  </template>
  
  <script>
  import RegisterForm from '@/components/RegisterForm.vue'
  
  export default {
    name: 'RegisterView',
    components: {
      RegisterForm
    }
  }
  </script>
  
  <style scoped>
  .register-view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .left {
    margin-right: 50px;
    text-align: center;
  }
  .right {
    margin-left: 70px;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    background: #fff;
  }
  </style>
  