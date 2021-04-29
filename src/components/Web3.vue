<template>
  <v-container>
    <div>ChainId: {{chainId > 0 ? chainId : '?'}} | {{chainId === ChainId.KOVAN ? '(Kovan) ✔' :  ('Please switch to the Kovan network')}}</div>
    <div>Address: {{address}}<span style="text-decoration: underline" v-if="!address" v-on:click="connectMM">connnect wallet</span></div>
    <hr>
    <div>Your WETH balance: {{weth}}</div>
    <div>Your DAI balance: {{dai}}</div>
    <hr>
    <div>Your Bentobox WETH balance: {{bweth}}</div>
    <div>Your BentoBox DAI balance: {{bdai}}</div>
    <hr>
    <span style="text-decoration: underline; cursor: pointer" v-on:click="approveMC">Approve Limit Order master contract</span>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ethers, Contract } from "ethers";
import { ChainId } from 'limitorderv2-sdk';
import { erc20 } from '../constants/erc20';
import { bentoBox } from '../constants/bento';

declare global {
  interface Window { ethereum: any }
}

@Component({})
export default class Web3 extends Vue {
  
  address = "";
  weth = "";
  bweth = "";
  dai = "";
  bdai = "";

  bentoAddress = "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966";
  wethAddress = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";
  daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";

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

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    if (!provider) return;
    
    const signer = provider.getSigner();
    
    provider.getNetwork().then(n => this.chainId = n.chainId);

    this.$store.commit('setProvider', provider);
    this.$store.commit('setSigner', signer);
    
    await signer.getAddress().then(a => this.address = a);
    this.$store.commit('setAddress', this.address);

    this.getBalances(this.address, provider);

  }

  async getBalances(address: string, provider: ethers.providers.Web3Provider): Promise<void> {
    this.weth = (await (new Contract(this.wethAddress, erc20, provider)).balanceOf(address));
    this.dai = (await (new Contract(this.daiAddress, erc20, provider)).balanceOf(address));
    // todo bento balance of
    this.bdai = "";
    this.bweth = "";
  }

  async approveMC() {
    const user = this.$store.state.address;
    const provider = this.$store.state.provider;
    const BB = await new Contract(this.bentoAddress, bentoBox, this.$store.state.signer);
    const nonce = (await BB.nonces(user)).toString();
    const masterContract = "0x1C25797201499c88da0ED3C3160952300d915F90"; // kovan
    const message = {
      warning: 'Give FULL access to funds in (and approved to) BentoBox?',
      user,
      masterContract,
      approved: true,
      nonce: nonce
    }
    const typedData = {
      types: {
        SetMasterContractApproval: [
          { name: 'warning', type: 'string' },
          { name: 'user', type: 'address' },
          { name: 'masterContract', type: 'address' },
          { name: 'approved', type: 'bool' },
          { name: 'nonce', type: 'uint256' }
        ],
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ]
      },
      primaryType: 'SetMasterContractApproval',
      domain: {
        name: 'BentoBox V1',
        chainId: ChainId.KOVAN,
        verifyingContract: this.bentoAddress
      },
      message: message
    }
    const signature = await provider.send('eth_signTypedData_v4', [user, JSON.stringify(typedData)]);
    const { v, r, s } = ethers.utils.splitSignature(signature);
    const tx = await BB.setMasterContractApproval(user, masterContract, true, v, r, s);
    alert(tx.hash);
  }

}
</script>
