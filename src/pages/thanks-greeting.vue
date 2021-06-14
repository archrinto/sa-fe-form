<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4 mt-15">
        <h1 class="display-2 font-weight-bold mb-3">
          Terima Kasih
        </h1>

        <p class="subheading font-weight-regular">
          Kami ucapkan terima kasih karena telah ikut berkontribusi dalam penelitian ini
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
    mounted () {
    document.title = 'Thanks :) - ' + process.env.VUE_APP_NAME
  },
  }
</script>