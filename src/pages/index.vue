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
            :loading="isLoading"
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
      isAgreementDialog: true,
      clientId: null,
      isLoading: false
    }
  },
  methods: {
    async acceptAgreement() {
      this.isLoading = true
      window.localStorage.setItem('agreementStatus', true)
      await this.clientCheckin()
      this.isLoading = false
      this.$router.push('/form-photos')
    },
    declineAgreement() {
      window.localStorage.setItem('agreementStatus', false)
      this.$router.push('/decline-greeting')
    },
    async clientCheckin() {
      await this.$axios.get('/api/checkin')
      .then(res => {
        this.clientId = res.data.client_id
        // console.log(res.data.client_id)
        // this.clientId = '25ba507a-7953-4b0b-a02b-0eff0459df97'
        this.$axios.defaults.headers.common['Client-Id'] = this.clientId
        window.axios.defaults.headers.common['Client-Id'] = this.clientId
      })
    },
  }
}
</script>
