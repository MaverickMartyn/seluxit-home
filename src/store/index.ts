import Vue from "vue";
import Vuex from "vuex";
import { Network, Device, StateEntity } from "@/APITypes";

Vue.use(Vuex);

export class AppState {
  networkId: null | string = null;
  network: Network | null = null;

  public constructor(init?: Partial<AppState>) {
    Object.assign(this, init);
  }
}

export default new Vuex.Store<AppState>({
  state: new AppState({
    network: null,
    networkId: "8c70e49c-48bd-4ec1-ad2b-725bdc4477a0"
  }),
  mutations: {
    /**
     * Updates the vuex state representation of the network.
     *
     * @param state The vuex app state.
     * @param network The network object.
     */
    updateNetwork(state: AppState, network: Network): void {
      state.network = network;
    },
    /**
     * Updates the vuex state representation of a particular device value.
     *
     * @param state The vuex app state.
     * @param value The value entity.
     */
    updateDeviceState(state: AppState, stateEntity: StateEntity): void {
      state!.network!.device!.forEach((deviceEl: Device, deviceKey: number) => {
        deviceEl!.value!.forEach((valEl, valKey) => {
          valEl!.state!.forEach((stateEl, stateKey) => {
            if (stateEl.meta.id === stateEntity.meta.id) {
              state!.network!.device![deviceKey]!.value![valKey]!.state![
                stateKey
              ]!.data = stateEntity.data;
              state!.network!.device![deviceKey]!.value![valKey]!.state![
                stateKey
              ]!.timestamp = stateEntity.timestamp;
            }
          });
        });
      });
    }
  },
  actions: {},
  modules: {}
});
