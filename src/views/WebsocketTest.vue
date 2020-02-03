<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col>
        <h1>Websocket Test</h1>
        <v-btn @click="disconnect" v-if="status === 'connected'">
          Disconnect
        </v-btn>
        <v-btn
          color="primary"
          @click="connect"
          v-if="status === 'disconnected'"
        >
          Connect
        </v-btn>
        <p>Status: {{ status }}</p>
        <div v-if="status === 'connected'">
          <v-form @submit.prevent="sendMessage" action="#">
            <v-text-field
              label="Send a message to the websocket"
              v-model="message"
            ></v-text-field>
            <v-btn type="submit">
              Send Message
            </v-btn>
          </v-form>
          <v-sheet elevation="3" class="pa-5">
            <ul id="logs">
              <li v-for="log in logs" class="log" :key="log.id">
                {{ log.event }}: {{ log.data }}
              </li>
            </ul>
          </v-sheet>
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
      this.socket = new WebSocket(
        "wss://www.seluxit.com/smarthome/services/2.0/network/" +
          this.$store.state.networkId +
          "/websocket"
      );
      this.socket.onopen = () => {
        this.status = "connected";
        this.logs.push({
          event: "Connected to",
          data:
            "wss://www.seluxit.com/smarthome/services/2.0/network/" +
            this.$store.state.networkId +
            "/websocket"
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
