<template>
  <v-container>
    <div>ChainId: {{chainId > 0 ? chainId : '?'}} | {{chainId === ChainId.MATIC ? '(Polygon) ✔' :  ('Please switch to the Polygon network')}}</div>
    <div>Address: {{address}}<span style="text-decoration: underline" v-if="!address" v-on:click="connectMM">connnect wallet</span></div>
    <hr>
    <div>Your Bentobox ETH balance: {{bweth}}</div>
    <small>(0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619)</small>
    <div>Your BentoBox MATIC balance: {{bdai}}</div>
    <small>(0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270)</small>
    <hr>
    <div>ETH / MATIC price {{ethPrice}}</div>
    <div>MATIC / ETH price {{ethPriceI}}</div>
    <hr>
    <span v-if="loaded && !mcApproved" style="text-decoration: underline; cursor: pointer" v-on:click="approveMC">Approve Limit Order master contract</span>
    <span v-if="loaded && mcApproved">Master contract is approved</span>
    <div v-if="!loaded" class="loading">Loading bento box balances</div>
  </v-container>
</template>

<style scoped>
.loading:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4,end) 900ms infinite;      
  animation: ellipsis steps(4,end) 900ms infinite;
  content: "\2026"; /* ascii code for the ellipsis character */
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 20px;    
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 20px;    
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ethers, Contract } from "ethers";
import { ChainId, ETHER, Price } from '@sushiswap/sdk';
import { bentoBox } from '../constants/bento';
import { erc20 } from '../constants/erc20';
import { getVerifyingContract } from 'limitorderv2-sdk';

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

  bentoAddress = "0x0319000133d3AdA02600f0875d2cf03D442C3367";
  stopLimitAddress = getVerifyingContract(ChainId.MATIC);
  wethAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  daiAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

  ethPrice = "...";
  ethPriceI = "...";

  chainId = -1;
  ChainId = ChainId;

  mcApproved = false;
  loaded = false;

  created(): void {
    this.connectMM();
    console.log('slp', this.stopLimitAddress)
  }

  async connectMM(): Promise<void> {
    if (!window.ethereum) return;
    await window.ethereum.request({ method: 'eth_requestAccounts' });
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

    this.getBalances(this.address, provider).then(() => this.loaded = true);

  }

  async getBalances(address: string, provider: ethers.providers.Web3Provider): Promise<void> {
    const weth = (await (new Contract(this.wethAddress, erc20, provider)).balanceOf("0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E")).toString();
    const dai = (await (new Contract(this.daiAddress, erc20, provider)).balanceOf("0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E")).toString();

    const _ethPrice = new Price(ETHER, ETHER, weth, dai);
    this.ethPrice = _ethPrice.toSignificant();
    this.ethPriceI = _ethPrice.invert().toSignificant();
    
    const BB = await new Contract(this.bentoAddress, bentoBox, this.$store.state.signer);

    const wethShare = await BB.balanceOf(this.wethAddress, address);
    const daiShare = await BB.balanceOf(this.daiAddress, address);
    const _bweth = (await BB.toAmount(this.wethAddress, wethShare, false)).toString() || "0";
    const _bdai = (await BB.toAmount(this.daiAddress, daiShare, false)).toString() || "0";

    this.bweth = _bweth.length > 17 ? _bweth.slice(0, _bweth.length - 18) + '.' + _bweth.slice(_bweth.length - 18, _bweth.length) : _bweth;
    this.bdai = _bdai.length > 17 ? _bdai.slice(0, _bdai.length - 18) + '.' + _bdai.slice(_bdai.length - 18, _bdai.length) : _bdai;

    this.mcApproved = await BB.masterContractApproved(this.stopLimitAddress, this.address);
  }

  async approveMC(): Promise<void> {
    const user = this.$store.state.address;
    const provider = this.$store.state.provider;
    const BB = new Contract(this.bentoAddress, bentoBox, this.$store.state.signer);
    const nonce = (await BB.nonces(user)).toString();
    const masterContract = this.stopLimitAddress;
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
        chainId: ChainId.MATIC,
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
