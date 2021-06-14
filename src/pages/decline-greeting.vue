<template>
    <div></div>
</template>
<script>
  export default {
    mounted () {
      if (window.localStorage.getItem('agreementStatus') == null) {
        this.$router.push('/')
      }
    }
  }
</script>