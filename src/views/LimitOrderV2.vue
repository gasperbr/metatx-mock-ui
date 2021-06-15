<template>
  <div>
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
    <div class="container">
      <h3>My orders</h3>
      <div>showing {{orders.length}} orders</div>
      <div class="table-row">
        <div class="order-info">Order info</div>
        <div class="order-status">Status</div>
      </div>
      <div v-if="!ordersLoaded">Loading..</div>
      <div v-for="_order in orders" v-bind:key="_order.index" class="table-row">
        <div class="order-info" v-if="!!_order.limitOrder">
          <div>Input: <small>{{_order.limitOrder.amountIn.token.address}}</small></div>
          <div>Input amount: {{_order.inRaw}}</div><!-- {{_order.limitOrder.amountInRaw}} would be prefered but vue breaks the toString method that gets called in this nested object-->
          <div>output: <small>{{_order.limitOrder.amountIn.token.address}}</small></div>
          <div>Min output amount: {{_order.minOutRaw}}</div>
        </div>
        <div class="order-status" v-if="!!_order.limitOrder">
          <div>Filled amount:</div>
          <div>{{_order.filledPercent}}%</div>
          <div v-if="_order.isCanceled">Canceled</div>
          <div v-if="_order.filled">Filled</div>
          <v-btn v-if="!_order.isCanceled && !_order.filled" text color="primary" v-on:click="cancelOrder(_order.index)">Cancel order</v-btn>
        </div>
      </div>

    </div>
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

.table-row {
  display: flex;
  border-bottom: 1px solid gray;
  .order-info {
    flex-grow: 1;
  }
  .order-status {
    flex: 0 1 200px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { LimitOrder, LAMBDA_URL, getVerifyingContract, ILimitOrderData } from 'limitorderv2-sdk';
import { ChainId, Token, TokenAmount, JSBI, } from '@sushiswap/sdk';
import { Price } from '@sushiswap/sdk';
import { BigNumber, Contract } from "ethers";
import { stopLimitOrder } from '../constants/stopLimitOrder';
import axios from 'axios';

@Component({
  components: {
  },
})
export default class LimitOrderV2 extends Vue {
  
  inputToken = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
  inputTokenDecimals = 18;
  inputAmount = "1";
  outputToken = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  outputTokenDecimals = 18;
  outputAmount = "1";
  price = "";
  amountIn = new TokenAmount(new Token(ChainId.MATIC, this.inputToken, 18), "1");
  amountOut = new TokenAmount(new Token(ChainId.MATIC, this.outputToken, 18), "1");

  order!: LimitOrder;
  orders = [];

  ordersLoaded = false;

  created(): void {
    this.updateOrder();
    this.fetchMyOrders();
  }

  updateOrder(): void {
    if (!this.validParams()) return;
    this.order = new LimitOrder(
      this.$store.state.address,
      new TokenAmount(new Token(ChainId.MATIC, this.inputToken, this.inputTokenDecimals, 'DUMMY1'), this.inputAmount || "0"),
      new TokenAmount(new Token(ChainId.MATIC, this.outputToken, this.outputTokenDecimals, 'DUMMY2'), this.outputAmount || "0"),
      this.$store.state.address,
      0,
      Math.floor(new Date().getTime() / 1000) + 100000,
      "0",
      "0x0000000000000000000000000000000000000000",
      "0x00000000000000000000000000000000000000000000000000000000000000"
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
  inputTokenChange(): void {
    this.updateOrder();
    if (this.inputToken) {
      this.amountIn = new TokenAmount(new Token(ChainId.MATIC, this.inputToken, 18), "1");
    }
  }

  @Watch("inputAmount")
  inputAmountChange(): void {
    this.updateOrder();
  }

  @Watch("outputToken")
  outputTokenChange(): void {
    this.updateOrder();
    if (this.outputToken) {
      this.amountOut = new TokenAmount(new Token(ChainId.MATIC, this.outputToken, 18), "1");
    } 
  }

  @Watch("outputAmount")
  outputAmountChange(): void {
    this.updateOrder();
  }

  @Watch("price")
  priceChange(price: number): void {
    if (!this.order) this.updateOrder();
    
    const _price = new Price(this.amountIn.currency, this.amountOut.currency, JSBI.BigInt(1e6), JSBI.BigInt(Math.floor(price * 1e6)));
    
    this.order = this.order.usePrice(_price);
    this.outputAmount = this.order.amountOut.raw.toString();
  }

  async sign(): Promise<void> {
    this.updateOrder();
    await this.order.signOrderWithProvider(ChainId.MATIC, this.$store.state.provider);

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
    await this.order.send();
    alert('Your tx has been relayed.');
  }

  async fetchMyOrders(): Promise<void> {
    
    if (!this.$store.state.address) {
      setTimeout(() => this.fetchMyOrders(), 500); // ¯\_(ツ)_/¯
      return;
    }
    
    const stopLimitOrderContract = new Contract(getVerifyingContract(ChainId.MATIC), stopLimitOrder, this.$store.state.provider);

    const orders = ((await axios.post(`${LAMBDA_URL}/orders/view`, {address: this.$store.state.address, chainId: ChainId.MATIC})).data.data || []).map(async (order: ILimitOrderData, index: number) => { 
      
      order.chainId = +order.chainId,
      order.tokenInDecimals = +order.tokenInDecimals || 18;
      order.tokenOutDecimals = +order.tokenOutDecimals || 18;
      const limitOrder = LimitOrder.getLimitOrder(order);
      const digest = limitOrder.getTypeHash();

      const filledAmount = await stopLimitOrderContract.orderStatus(digest);
      const filledPercent = filledAmount.mul(BigNumber.from("100")).div(BigNumber.from(order.amountIn)).toString();
      const isCanceled = await stopLimitOrderContract.cancelledOrder(this.$store.state.address, digest);
      const filled = filledAmount.toString() == order.amountIn;

      return {
        limitOrder,
        filledPercent,
        index,
        isCanceled,
        filled,
        inRaw: limitOrder.amountInRaw, // make this accessable at the base of the object because vue fucks up the toString method of a nested object??
        minOutRaw: limitOrder.amountOutRaw
      };
    });
    
    await Promise.all(orders).then(o => this.orders = o as any);
    
    this.ordersLoaded = true;

  }

  cancelOrder(i: number): void {
    const stopLimitOrderContract = new Contract(getVerifyingContract(ChainId.MATIC), stopLimitOrder, this.$store.state.signer);
    stopLimitOrderContract.cancelOrder((this.orders[i] as any).limitOrder.getTypeHash());
  }
  
}
</script>
