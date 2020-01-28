<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col>
        <device-card v-for="device in devices" :key="device.id"></device-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import DeviceCard from "@/components/DeviceCard.vue";

export default {
  name: "MyHome",
  components: {
    DeviceCard
  },

  computed: {
    devices: function (): Object[] {
      return this.$store.state.devices;
    }
  },
};
</script>
