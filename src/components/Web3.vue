<template>
  <v-container>
    <div>ChainId: {{chainId > 0 ? chainId : '?'}} | {{chainId === ChainId.KOVAN ? '(Kovan) ✔' :  ('Please switch to the Kovan network')}}</div>
    <div>Address: {{address}}<span style="text-decoration: underline" v-if="!address" v-on:click="connectMM">connnect wallet</span></div>
    <hr>
    <div>Your Bentobox WETH balance: {{bweth}}</div>
    <small>(0xd0A1E359811322d97991E03f863a0C30C2cF029C)</small>
    <div>Your BentoBox DAI balance: {{bdai}}</div>
    <small>(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa)</small>
    <hr>
    <div>ETH / DAI price {{ethPrice}}</div>
    <div>DAI / ETH price {{ethPriceI}}</div>
    <hr>
    <span style="text-decoration: underline; cursor: pointer" v-on:click="approveMC">Approve Limit Order master contract</span>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ethers, Contract } from "ethers";
import { ChainId, ETHER, Price } from 'limitorderv2-sdk';
import { bentoBox } from '../constants/bento';
import { erc20 } from '../constants/erc20';

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

  ethPrice = "...";
  ethPriceI = "...";

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
    const weth = (await (new Contract(this.wethAddress, erc20, provider)).balanceOf("0xB10cf58E08b94480fCb81d341A63295eBb2062C2")).toString();
    const dai = (await (new Contract(this.daiAddress, erc20, provider)).balanceOf("0xB10cf58E08b94480fCb81d341A63295eBb2062C2")).toString();
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
