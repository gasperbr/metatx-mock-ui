<template>
  <v-container>
    <div>ChainId: {{chainId > 0 ? chainId : '?'}} | {{chainId === ChainId.KOVAN ? '(Kovan) ✔' :  ('Please switch to the Kovan network')}}</div>
    <div>Address: {{address}}</div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ethers } from "ethers";
import { ChainId } from 'limitorderv2-sdk';

declare global {
  interface Window { ethereum: any }
}

@Component({})
export default class Web3 extends Vue {
  
  address = "";
  chainId = -1;
  ChainId = ChainId;

  created(): void {
    this.updateWeb3();
  }

  async updateWeb3(): Promise<void> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    if (!provider) return;
    
    const signer = provider.getSigner();
    
    provider.getNetwork().then(n => this.chainId = n.chainId);

    this.$store.commit('setProvider', provider);
    this.$store.commit('setSigner', signer);
    
    await signer.getAddress().then(a => this.address = a);
    this.$store.commit('setAddress', this.address);
  }

}
</script>
