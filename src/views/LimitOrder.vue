<template>
  <div class="container">
    <h3>Limit Order</h3>

    <div class="form-field flex">
      <div class="address">
        <label for="inputToken">Input token address *</label>
        <input id="inputToken" v-model="inputToken" type="text">
      </div>
      <div class="decimals">
        <label for="inputToken">Decimals</label>
        <input id="inputToken" v-model="inputTokenDecimals" type="number" step="1">
      </div>
    </div>

    <div class="form-field">
      <div class="flex">
        <label for="inputAmount">Input amount *</label><small v-on:click="addZerosInput">add {{this.inputTokenDecimals}} zeroes</small>
      </div>
      <input id="inputAmount" v-model="inputAmount" type="text">
    </div>

    <div class="form-field flex">
      <div class="address">
        <label for="outputToken">Output token address *</label>
        <input id="outputToken" v-model="outputToken" type="text">
      </div>
      <div class="decimals">
        <label for="outputToken">Decimals</label>
        <input id="outputTokenDecimals" v-model="outputTokenDecimals" type="number" step="1">
      </div>
    </div>

    <div class="form-field">
      <div class="flex">
        <label for="outputAmount">Min output amount *</label><small v-on:click="addZerosOutput">Add {{this.outputTokenDecimals}} zeroes</small>
      </div>
      <input id="outputAmount" v-model="outputAmount" type="text">
    </div>

    <div class="form-field">
      <label for="price">Price</label>
      <input id="price" v-model="price" type="number">
      <!-- <div><small>Price of output token in terms of input. e.g. if input is ETH and output is DAI the price is 2200. Otherwise it should be 0.0004545</small></div> -->
    </div>

    <v-btn text color="primary" v-on:click="sign">Sign</v-btn>

  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.43);
}

input {
  min-height: 1.5rem;
  width: 100%;
  border: 1px solid rgb(206, 206, 206);
  border-radius: 5px;
  padding-left: 5px;
}

.form-field {
  margin: 0.5rem 0;
  &.flex {
    display: flex;
    .decimals {
      width: 100px;
      margin-left: 1rem;
    }
    .address {
      flex-grow: 1;
    }
  }
  small {
    margin-left: auto;
    text-decoration: underline;
  }
}

.flex {
  display: flex;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ChainId, LimitOrder, Token, TokenAmount, Price, JSBI, parseBigintIsh } from 'limitorderv2-sdk';
import { ethers } from 'ethers';

@Component({
  components: {
  },
})
export default class LimitOrderV2 extends Vue {
  
  inputToken = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";
  inputTokenDecimals = 18;
  inputAmount = "1";
  outputToken = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
  outputTokenDecimals = 18;
  outputAmount = "1";
  price = "";
  amountIn = new TokenAmount(new Token(ChainId.KOVAN, this.inputToken, 18), "1");
  amountOut = new TokenAmount(new Token(ChainId.KOVAN, this.outputToken, 18), "1");

  order!: LimitOrder;

  created(): void {
    this.updateOrder();
  }

  updateOrder(): void {
    if (!this.validParams()) return;
    console.log(this.amountOut);
    this.order = new LimitOrder(
      this.$store.state.address,
      this.amountIn,
      this.amountOut,
      this.$store.state.address,
      "0",
      "2000000000000",
      "0",
      "0x0000000000000000000000000000000000000000",
      ethers.utils.keccak256("0x00000000000000000000000000000000000000000000000000000000000000")
    );
  }

  addZerosInput(): void {
    this.inputAmount += new Array(this.inputTokenDecimals + 1).join("0");
  }

  addZerosOutput(): void {
    this.outputAmount += new Array(this.inputTokenDecimals + 1).join("0");
  }

  validParams(): boolean {
    return !!this.$store.state.address && !!this.inputToken && !!this.inputAmount && !!this.outputToken && !!this.outputAmount;
  }

  @Watch("inputToken")
  inputTokenChange(address: string): void {
    this.amountIn = new TokenAmount(new Token(ChainId.KOVAN, address, 18), this.inputAmount || "0");
    this.updateOrder();
  }

  @Watch("inputAmount")
  inputAmountChange(amount = "0"): void {
    this.amountIn = new TokenAmount(this.amountIn.token, "10000000000000000000000");
    // console.log('NUMBER', parseBigintIsh("10000000000000000000000").toString());
    console.log(parseBigintIsh("10000000000000000000000"))
    console.log(this.amountIn.raw)
    console.log(parseBigintIsh("10000000000000000000000").toString())
    console.log(this.amountIn.raw.toString())
    this.updateOrder();
  }

  @Watch("outputToken")
  outputTokenChange(address: string): void {
    this.amountOut = new TokenAmount(new Token(ChainId.KOVAN, address, 18), this.outputAmount || "0");
    this.updateOrder();
  }

  @Watch("outputAmount")
  outputAmountChange(amount: string): void {
    this.amountOut = new TokenAmount(this.amountOut.token, amount || "0");
    this.updateOrder();
  }

  @Watch("price")
  priceChange(price: number): void {
    if (!this.order) this.updateOrder();
    const den = JSBI.BigInt(1e6)
    const num = JSBI.BigInt(price * 1e6);
    const _price = new Price(this.amountIn.currency, this.amountOut.currency, den, num);

    let limitOrder = new LimitOrder(
      this.order.maker,
      new TokenAmount(this.amountIn.token, this.inputAmount),
      new TokenAmount(this.amountOut.token, this.outputAmount),
      this.order.recipient,
      this.order.startTime,
      this.order.endTime,
      this.order.stopPrice,
      this.order.oracleAddress,
      this.order.oracleData
    );
    this.order = limitOrder.usePrice(_price);
    this.outputAmount = this.order.amountOut.raw.toString();
    console.log(this.outputAmount, this.order.amountOut);
  }

  async sign(): Promise<void> {
    this.updateOrder();
    await this.order.signOrderWithProvider(ChainId.KOVAN, this.$store.state.provider);
    // 0xce9365dB1C99897f04B3923C03ba9a5f80E8DB87
    console.log(JSON.stringify([
      this.order.maker,
      this.order.amountIn.raw.toString(),
      this.order.amountOut.raw.toString(),
      this.order.recipient,
      this.order.startTime,
      this.order.endTime,
      this.order.stopPrice,
      this.order.oracleAddress,
      "0x00000000000000000000000000000000000000000000000000000000000000",
      this.order.amountIn.raw.toString(),
      this.order.v,
      this.order.r,
      this.order.s]));
    // 0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cc7090d567f902f50cb5621a7d6a59874364ba10000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c0000000000000000000000004f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa
    await this.order.send();
    alert('Your tx has been relayed.')
  }
  
}
</script>
