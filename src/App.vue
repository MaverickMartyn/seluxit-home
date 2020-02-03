<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Device Specific Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/devices">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Generic Device Overview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/values">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Generic Value Overview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/about">
          <v-list-item-action>
            <v-icon>mdi-help-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Seluxit Home</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view @update-state="updateState"></router-view>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
.home-flex-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { Network, StateEntity, Device, ValueEntity } from "@/APITypes";

export default Vue.extend({
  name: "App",

  components: {},

  data: () => ({
    drawer: null,
    message: "",
    status: "disconnected",
    socket: null as WebSocket | null
  }),

  mounted(): void {
    axios
      .get(
        "https://www.seluxit.com/smarthome/services/2.0/network/" +
          this.$store.state.networkId
      )
      .then(response => {
        var network: Network = response.data as Network;
        this.$store.commit("updateNetwork", network);
      });
    this.connect();
  },

  methods: {
    updateState(value: Event, device: Device, valueEntity: ValueEntity): void {
      axios.post(
        "https://www.seluxit.com/smarthome/services/2.0/network/" +
          this.$store.state.networkId +
          "/device/" +
          device.meta.id +
          "/value/" +
          valueEntity!.meta!.id +
          "/state/" +
          valueEntity.state!.find(s => s.type === "Control")!.meta.id,
        {
          timestamp: Date.now().toString(),
          data: value,
          meta: {
            id: valueEntity.state!.find(s => s.type === "Control")!.meta.id
          }
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
    },
    connect(): void {
      this.socket = new WebSocket(
        "wss://www.seluxit.com/smarthome/services/2.0/network/" +
          this.$store.state.networkId +
          "/websocket"
      );
      this.socket.onopen = () => {
        this.status = "connected";
        // eslint-disable-next-line no-console
        console.log({
          event: "Connected to",
          data:
            "wss://www.seluxit.com/smarthome/services/2.0/network/" +
            this.$store.state.networkId +
            "/websocket"
        });

        this.socket!.onmessage = ({ data }) => {
          data = JSON.parse(data);
          // eslint-disable-next-line no-console
          console.log({
            event: "Recieved message",
            data
          });
          if (data.meta.type === "state") {
            this.$store.commit("updateDeviceState", data);
          }
        };
      };
    },
    disconnect(): void {
      this.socket!.close();
      this.status = "disconnected";
    },
    sendMessage(e: Object): void {
      this.socket!.send(this.message);
      this.message = "";
    }
  }
});
</script>
