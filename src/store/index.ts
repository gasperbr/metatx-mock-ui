import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    provider: undefined,
    signer: undefined,
    address: ""
  },
  mutations: {
    setProvider(state, provider): void {
      state.provider = provider;
    },
    setSigner(state, signer): void {
      state.signer = signer;
    },
    setAddress(state, address): void {
      state.address = address;
    }
  },
  actions: {
  },
  modules: {
  }
})
