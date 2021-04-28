<template>
  <v-container>
    <div>ChainId: {{chainId > 0 ? chainId : '?'}} | {{chainId === ChainId.KOVAN ? '(Kovan) ✔' :  ('Please switch to the Kovan network')}}</div>
    <div>Address: {{address}}<span style="text-decoration: underline" v-if="!address" v-on:click="connectMM">connnect wallet</span></div>
    <!-- weth: 0xd0a1e359811322d97991e03f863a0c30c2cf029c -->
    <!-- usdc: 0xb7a4f3e9097c08da09517b5ab877f7a917224ede -->
    <!-- usdt: 0x07de306ff27a2b630b1141956844eb1552b956b5 -->
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
    this.connectMM();
  }

  async connectMM() {
    if (!window.ethereum) return;
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await this.updateWeb3();
  }

  async updateWeb3(): Promise<void> {

    await window.ethereum?.enable();
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
