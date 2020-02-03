<template>
  <v-container fluid>
    <v-flex class="home-flex-wrap">
      <device-card
        v-for="device in devices"
        :device="device"
        :key="device.id"
        @update-state="updateState"
      ></device-card>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import DeviceCard from "@/components/DeviceCard.vue";
import { Device, ValueEntity } from "@/APITypes";
import axios from "axios";

export default {
  name: "MyHome",
  components: {
    DeviceCard
  },

  computed: {
    devices: function(): Device[] {
      return (
        (this.$store.state.network && this.$store.state.network.device) ||
        new Array<Device>()
      );
    }
  },
  methods: {
    updateState(value: Event, device: Device, valueEntity: ValueEntity): void {
      this.$emit("update-state", value, device, valueEntity);
    }
  }
};
</script>
