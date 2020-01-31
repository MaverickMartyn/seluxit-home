import Vue from "vue";
import Vuex from "vuex";
import { Network, Device, StateEntity } from "@/APITypes";

Vue.use(Vuex);

export interface IAppState {
  networkId: null | string;
  network: Network | null;
}

export default new Vuex.Store({
  state: {
    network: null as Network | null,
    networkId: "8c70e49c-48bd-4ec1-ad2b-725bdc4477a0"
  } as IAppState,
  mutations: {
    updateNetwork(state: IAppState, network: Network): void {
      state.network = network;
    },
    updateDeviceState(state: IAppState, stateEntity: StateEntity): void {
      state!.network!.device!.forEach((deviceEl: Device, deviceKey: number) => {
        deviceEl!.value!.forEach((valEl, valKey) => {
          valEl!.state!.forEach((stateEl, stateKey) => {
            if (stateEl.meta.id === stateEntity.meta.id) {
              state!.network!.device![deviceKey]!.value![valKey]!.state![stateKey]!.data = stateEntity.data;
              state!.network!.device![deviceKey]!.value![valKey]!.state![stateKey]!.timestamp = stateEntity.timestamp;
            }
          });
        });
      });
    }
  },
  actions: {},
  modules: {}
});
