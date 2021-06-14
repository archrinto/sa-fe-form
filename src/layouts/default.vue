<template>
  <div>
    <v-app-bar color="primary" dark fixed>
      <v-app-bar-title @click="$router.push('/')">{{ APP_NAME }}</v-app-bar-title>
    </v-app-bar>
    <router-view class="mt-15"/>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        APP_NAME: process.env.VUE_APP_NAME
      }
    }
  }
</script>