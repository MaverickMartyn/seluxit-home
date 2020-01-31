<template>
  <v-container fluid>
    <button @click="setStoveOff">Set Stove to OFF</button>
    <button @click="setStoveOn">Set Stove to ON</button>
    <v-flex style="display: flex; flex-direction: row; flex-wrap: wrap;">
      <value-widget
        v-for="valueEntity in valueEntities"
        :valueEntity="valueEntity"
        :key="valueEntity.id"
      ></value-widget>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import ValueWidget from "@/components/ValueWidget.vue";
import { Device, ValueEntity } from "@/APITypes";
import axios from "axios";

export default {
  name: "ValueDashboard",
  components: {
    ValueWidget
  },

  computed: {
    valueEntities: function(): ValueEntity[] {
      return (
        (this.$store.state.network &&
          Array.prototype.concat.apply(
            [],
            this.$store.state.network.device!.map((d: Device) => d.value)
          )) ||
        new Array<ValueEntity>()
      );
    }
  },

  methods: {
    setStoveOn(): void {
      axios.post(
        "https://www.seluxit.com/smarthome/services/2.0/network/" +
          this.$store.state.networkId +
          "/device/bc455c88-ae17-4fd6-a4f1-1deadbeef01e/value/ac455c88-ae17-4fd6-a4f1-1deadbeef01e/state/ac455c88-ae17-4fd6-a4f1-1deadbeef01c",
        {
          timestamp: Date.now.toString(),
          data: 1,
          meta: { id: "ac455c88-ae17-4fd6-a4f1-1deadbeef01c" }
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
    },
    setStoveOff(): void {
      axios.post(
        "https://www.seluxit.com/smarthome/services/2.0/network/" +
          this.$store.state.networkId +
          "/device/bc455c88-ae17-4fd6-a4f1-1deadbeef01e/value/ac455c88-ae17-4fd6-a4f1-1deadbeef01e/state/ac455c88-ae17-4fd6-a4f1-1deadbeef01c",
        {
          timestamp: Date.now.toString(),
          data: 0,
          meta: { id: "ac455c88-ae17-4fd6-a4f1-1deadbeef01c" }
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
    }
  }
};
</script>
