<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4 mt-15">
        <h1 class="display-2 font-weight-bold mb-3">
          Maaf.. :(
        </h1>

        <p class="subheading font-weight-regular">
          Semoga kita dapat berkejasama di lain kesempatan
          <br>
        </p>
          <a
            class="mt-5"
            @click="$router.push('/')"
            target="_blank"
          >Kembali</a>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    created () {
      document.title = 'Maaf.. - ' + process.env.VUE_APP_NAME
    },
  }
</script>