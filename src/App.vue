<template>
  <v-app>
    <div class="page">

      <Web3/>

      <v-container>


        <v-btn-toggle
          mandatory
        >
          <v-btn to="/limit-order">
            Limit Order
          </v-btn>
          <v-btn to="/swap">
            Swap
          </v-btn>

        </v-btn-toggle>

      </v-container>

      <router-view/>

    </div>
  </v-app>
</template>

<style scoped>
.page {
  width: 95vw;
  max-width: 700px;
  margin: 0 auto;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Web3 from '@/components/Web3.vue'

@Component({
  components: {
    Web3
  }
})
export default class App extends Vue {}
</script>