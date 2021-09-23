<template>
  <div>
    <template v-if="!isGuidanceDialog">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-stepper v-model="currentPhotoIndex" vertical>
              <template v-for="(key, index) in Object.keys(photos)">
                <v-stepper-step
                  :key="key + 'stepper'"
                  :step="index + 1"
                  :complete="photos[key].file != null"
                >
                  {{ photos[key].name }}
                  <p class="mt-2 text-caption grey--text">{{ photos[key].guideText }}</p>
                </v-stepper-step>

                <v-stepper-content :key="key + 'content'" :step="index + 1">
                  <v-card 
                    class="mb-4" 
                    @click="openCameraDialog(key)"
                    color="white lighten-1"
                    style="position: relative"
                  >
                    <v-img
                      :height="photoHeight"
                      :src="photos[key].file"
                    ></v-img>

                    <div class="card-camera-icon text-center d-flex flex-column pa-5">
                      <!-- <v-icon large class="white--text align-center">mdi-camera</v-icon> -->
                      <v-img class="v-icon" contain height="50%" :src="photos[key].guideImage"></v-img>
                      <span class="text-caption grey--text mt-2">Click to get picture</span>
                    </div>

                  </v-card>

                  <div class="d-flex justify-end">
                    <v-btn text v-if="index != 0" small @click="prevPhoto(index + 1)">
                      kembali
                    </v-btn>
                    <v-btn
                      :disabled="photos[key].file == null"
                      color="primary"
                      @click="nextPhoto(index + 1)"
                      small
                    >
                      Selanjutnya
                    </v-btn>
                  </div>
                </v-stepper-content>
              </template>

              <v-stepper-step :step="Object.keys(photos).length + 1">
                Upload
              </v-stepper-step>

              <v-stepper-content :step="Object.keys(photos).length + 1">
                <div class="mb-5">
                  Upload keseluruhan foto yang telah diambil.
                </div>
                <div class="d-flex justify-end">
                    <v-btn text small @click="Object.keys(photos).length"
                      :disabled="isUploadLoading"
                    >
                      kembali
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="uploadPhotos"
                      small
                      :loading="isUploadLoading"
                    >
                      Upload
                    </v-btn>
                  </div>
              </v-stepper-content>

            </v-stepper>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <v-dialog 
      v-model="isGuidanceDialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title>Panduan Pengambilan Foto</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-4">
          <photo-guidance></photo-guidance>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <v-btn 
            text
            color="primary" 
            @click="okGuidance"
          >
            Ok, Mengerti
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog 
      fullscreen
      hide-overlay
      v-model="isCameraDialog"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
          dense
        >
          <v-btn
            icon
            dark
            @click="closeCameraDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Camera</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              :disabled="selectedFile == null"
              @click="addCurrentPhoto"
            >
              Ok
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="justify-center px-3">
          <v-row no-gutters class="justify-center">
            <v-col cols="8" sm="4" md="4">
                <v-select
                  class="mr-5"
                  v-model="selectedCamera"
                  :items="listCamera"
                  menu-props="auto"
                  hide-details
                  prepend-icon="mdi-camera"
                  @change="onCameraChange"
                  :disabled="!isCameraOpen || listCamera.length <= 1"
                ></v-select>
            </v-col>
            <v-col cols="4" sm="3" md="2">
                <v-switch
                  :disabled="!isCameraOpen"
                  v-model="isMirror"
                  label="mirror"
                  hide-details
                ></v-switch>
            </v-col>
          </v-row>
          <v-row no-gutters class="justify-center mt-2">
            <v-col cols="12" md="7">
              <div style="position: relative;">
                <video :class="{mirror: isMirror}" v-show="isCameraOpen" ref="camera" autoplay width="100%"></video>
                <canvas v-show="!isCameraOpen" ref="canvas" width="100%"></canvas>
                <div style="position: absolute; height: 100%; widht: 100%; top: 0; left: 0" class="pa-2 d-flex align-center">
                  <v-img class="v-icon" contain height="80%" :src="photos[currentPhoto].guideImageO"></v-img>
                </div>
              </div>
              <div class="text-center mt-2">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  color="primary"
                  :disabled="!isCameraOpen"
                  @click="takePhoto"
                >
                  <v-icon dark>
                    mdi-camera
                  </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped>
.card-camera-icon {
  height: 100%;
  width: 100%;
  margin: auto;
  position: absolute;
  top: 0; left: 0;
}
.card-camera-icon > .v-icon {
  text-align: center;
  margin: auto;
}
.mirror
{
    transform: rotateY(180deg);
    -webkit-transform:rotateY(180deg); /* Safari and Chrome */
    -moz-transform:rotateY(180deg); /* Firefox */
}
</style>
<script>
import PhotoGuidance from '../components/PhotoGuidance.vue'
export default {
  components: { PhotoGuidance },
  created () {
    document.title = 'Photos - ' + process.env.VUE_APP_NAME

    if (window.localStorage.getItem('agreementStatus') == null) {
      this.$router.push('/')
    }
  },
  data () {
    return {
      isUploadLoading: false,
      isMirror: false,
      isGuidanceDialog: true,
      isCameraDialog: false,
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      selectedCamera: null,
      selectedFile: null,
      listCamera: [],
      currentPhoto: 'face1',
      currentPhotoIndex: 1,
      photos: {
        face1: {
          name: 'Hadap Kanan',
          file: null,
          guideImage: '/images/face-right.png',
          guideImageO: '/images/face-right-o.png',
          guideText: 'Posisi wajah menghadap ke arah kanan, menunjukan pipi sebelah kiri, 90 derajat dari posisi kamera',
        },
        face2: {
          name: 'Serong Kanan',
          file: null,
          guideImage: '/images/face-front-right.png',
          guideImageO: '/images/face-front-right-o.png',
          guideText: 'Posisi wajah menghadap serong ke arah kanan, 45 derajat dari posisi kamera',
        },
        face3: {
          name: 'Depan',
          file: null,
          guideImage: '/images/face-front.png',
          guideImageO: '/images/face-front-o.png',
          guideText: 'Posisi wajah menghadap lurus ke arah kamera',
        },
        face4: {
          name: 'Serong Kiri',
          file: null,
          guideImage: '/images/face-front-left.png',
          guideImageO: '/images/face-front-left-o.png',
          guideText: 'Posisi wajah menghadap serong ke arah kiri, 45 derajat dari posisi kamera',
        },
        face5: {
          name: 'Hadap Kiri',
          file: null,
          guideImage: '/images/face-left.png',
          guideImageO: '/images/face-left-o.png',
          guideText: 'Posisi wajah menghadap ke arah kiri, menunjukan pipi sebelah kanan, 90 derajat dari posisi kamera',
        }
      }
    }
  },
  computed: {
    photoHeight () {
      console.log(this.$vuetify.breakpoint.name)
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': 
          return 150;
        case 'sm': 
          return 200;
        case 'md': 
          return 200;
        case 'lg': 
          return 250;
        default:
          return 250
      }
    },
  },
  methods: {
    okGuidance () {
      this.isGuidanceDialog = false
    },
    openCameraDialog(key) {
      this.currentPhoto = key
      this.isCameraDialog = true
      
      const constraints = (window.constraints = {
        audio: false,
        video: true
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(() => {
          this.getUserMediaDevice()
        })
        .catch(error => {
          console.log(error)
          alert("May the browser didn't support or there is some errors.")
        })

      this.openCamera()
    },
    closeCameraDialog() {
      this.isCameraDialog = false
      this.closeCamera()
    },
    async getUserMediaDevice() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
        return
      }

      // List cameras and microphones.
      const listDevice = []
      await navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        console.log(devices)
        devices.forEach(function(device) {
          if (device.kind == 'videoinput') {
            listDevice.push(
              { value: device.deviceId, text: device.label}
            )
          }
        });
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      })
      this.listCamera = listDevice

      if (listDevice.length > 0) {
        this.selectedCamera = listDevice[0].value
      }
    },
    openCamera() {
      this.isCameraOpen = true;
      this.createCameraElement();
    },
    closeCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      }
    },
      
    createCameraElement() {
      this.isLoading = true;

      console.log(this.selectedCamera)
      
      let video = true
      if (this.selectedCamera) {
        video = { deviceId: this.selectedCamera}
      }

      const constraints = (window.constraints = {
        audio: false,
        video: video
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch(error => {
          console.log(error)
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },
    
    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach(track => {
        track.stop();
      });
    },
    
    takePhoto() {
      if(!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }
      
      // this.isPhotoTaken = !this.isPhotoTaken;
      
      this.$refs.canvas.width = this.$refs.camera.videoWidth
      this.$refs.canvas.height = this.$refs.camera.videoHeight
      const context = this.$refs.canvas.getContext('2d');
      if (this.isMirror) {
        context.translate(this.$refs.canvas.width, 0);
        context.scale(-1, 1)
      }
      context.drawImage(this.$refs.camera, 0, 0, this.$refs.camera.videoWidth, this.$refs.camera.videoHeight);

      this.$refs.canvas.style.width = '100%'

      this.selectedFile = this.$refs.canvas.toDataURL("image/jpeg")

      this.closeCamera()
    },

    onCameraChange() {
      this.closeCamera()
      setTimeout(() => {
        this.openCamera()
      }, 1000)
    },

    addCurrentPhoto() {
      this.photos[this.currentPhoto].file = this.selectedFile
      this.closeCameraDialog()
      this.selectedFile = null
    },

    nextPhoto(index) {
      const keys = Object.keys(this.photos)
      this.currentPhotoIndex = index + 1
      this.currentPhoto = this.photos[keys[this.currentPhotoIndex - 1]]
    },

    prevPhoto(index) {
      const keys = Object.keys(this.photos)
      this.currentPhotoIndex = index - 1
      this.currentPhoto = this.photos[keys[this.currentPhotoIndex - 1]]
    },
    async uploadPhoto(item){
      if (this.photos[item].file == null) {
        console.log('image null')
        return false
      } else {
        const formData = new FormData();
        const blobBin = atob(this.photos[item].file.split(',')[1]);
        const array = [];

        for(var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }

        const file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

        formData.append('image', file)
        formData.append('face', item)

        const config = {
          headers: {
            "content-type": "multipart/form-data"
          }
        }

        return await this.$axios.post('/api/upload-image', formData, config)
        .then(() => {
          return true
        })
        .catch(err => {
          console.log(err)
          return false
        })
      }
    },
    async uploadPhotos() {
        this.isUploadLoading = true

        let uploadSuccess = true
        
        if (uploadSuccess) {
          uploadSuccess = await this.uploadPhoto('face1')
        }
        if (uploadSuccess) {
          this.photos['face1'].file = null
          uploadSuccess = await this.uploadPhoto('face2')
        }
        if (uploadSuccess) {
          this.photos['face2'].file = null
          uploadSuccess = await this.uploadPhoto('face3')
        }
        if (uploadSuccess) {
          this.photos['face3'].file = null
          uploadSuccess = await this.uploadPhoto('face4')
        }
        if (uploadSuccess) {
          this.photos['face4'].file = null
          uploadSuccess = await this.uploadPhoto('face5')
        }

        if (uploadSuccess) {
          this.photos['face5'].file = null

          window.localStorage.removeItem('agreementStatus')
          this.$router.push('/thanks-greeting')
        }
        this.isUploadLoading = false
    }

  }
}
</script>