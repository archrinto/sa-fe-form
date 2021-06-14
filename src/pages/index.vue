<template>
  <div>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      persistent
      v-model="isAgreementDialog"
      scrollable
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >Persetujuan</v-toolbar>
        <v-card-text>
          <div class="py-3">
            <agreement></agreement>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <v-btn 
            class="ma-1"
            outlined
            color="primary"
            @click="declineAgreement"
          >Tolak</v-btn>
          <v-btn 
            class="ma-1 px-4"
            color="primary"
            @click="acceptAgreement"
          >Setuju</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Agreement from '../components/Agreement.vue'
// @ is an alias to /src
export default {
  name: 'home',
  components: {
    Agreement
  },
  created () {
    document.title = process.env.VUE_APP_NAME
  },
  mounted () {
    window.localStorage.removeItem('agreementStatus')
  },
  data () {
    return {
      isAgreementDialog: true
    }
  },
  methods: {
    acceptAgreement() {
      window.localStorage.setItem('agreementStatus', true)
      this.$router.push('/form-photos')
    },
    declineAgreement() {
      window.localStorage.setItem('agreementStatus', false)
      this.$router.push('/decline-greeting')
    }
  }
}
</script>
