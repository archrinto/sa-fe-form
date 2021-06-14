<template>
  <div>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>{{ APP_NAME }}</v-app-bar-title>
    </v-app-bar>
    <router-view/>
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