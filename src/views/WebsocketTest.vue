<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col>
        <h1>Websocket Test</h1>
        <button @click="disconnect" v-if="status === 'connected'">
          Disconnect
        </button>
        <button @click="connect" v-if="status === 'disconnected'">
          Connect
        </button>
        {{ status }} <br /><br />
        <div v-if="status === 'connected'">
          <form @submit.prevent="sendMessage" action="#">
            <input v-model="message" /><button type="submit">
              Send Message
            </button>
          </form>
          <ul id="logs">
            <li v-for="log in logs" class="log" :key="log.id">
              {{ log.event }}: {{ log.data }}
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export class LogEntry {
  event: string = "";
  data: string = "";
}

export default {
  name: "MyHome",
  components: {},

  data: () => ({
    message: "",
    logs: new Array() as LogEntry[],
    status: "disconnected",
    socket: null as WebSocket | null
  }),

  methods: {
    connect(): void {
      this.socket = new WebSocket("wss://www.seluxit.com/smarthome/services/2.0/network/" + this.$store.state.networkId + "/websocket");
      this.socket.onopen = () => {
        this.status = "connected";
        this.logs.push({
          event: "Connected to",
          data: "wss://www.seluxit.com/smarthome/services/2.0/network/" + this.$store.state.networkId + "/websocket"
        });

        this.socket!.onmessage = ({ data }) => {
          this.logs.push({
            event: "Recieved message",
            data
          });
        };
      };
    },
    disconnect(): void {
      this.socket!.close();
      this.status = "disconnected";
      this.logs = [];
    },
    sendMessage(e: Object): void {
      this.socket!.send(this.message);
      this.logs.push({ event: "Sent message", data: this.message });
      this.message = "";
    }
  }
};
</script>
