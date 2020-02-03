<template>
  <v-card
    max-height="100%"
    max-width="100%"
    height="100%"
    width="100%"
    style="overflow-y: auto;"
    v-if="!!device"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">{{
          device.name
        }}</v-list-item-title>
        <v-list-item-subtitle
          >{{ device.manufacturer
          }}{{
            !!device.description ? " | " + device.description : ""
          }}</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col class="display-3" cols="12">
          <v-switch
            xl
            true-value="1"
            false-value="0"
            v-if="!!onOffValue"
            v-model="onOffValue.state.find(s => s.type === 'Control').data"
            @change="updateState($event, onOffValue)"
            label="On/Off"
            style="margin-top: 0;"
          ></v-switch>
        </v-col>
      </v-row>
    </v-card-text>

    <v-list-item v-if="!!temperatureValue">
      <v-list-item-icon>
        <v-icon>mdi-thermometer</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle
        >{{
          Number(
            temperatureValue.state.find(s => s.type === "Report").data
          ).toFixed(2)
        }}&deg;C</v-list-item-subtitle
      >
    </v-list-item>

    <v-slider
      v-if="!!desiTemperatureValue"
      v-model="desiTemperatureState.data"
      :min="desiTemperatureValue.number.min"
      :max="desiTemperatureValue.number.max"
      :step="desiTemperatureValue.number.step"
      label="Desired Temp"
      class="mx-4"
      append-icon="°C"
      :thumb-size="18"
      thumb-label="always"
      @change="updateState($event, desiTemperatureValue)"
    ></v-slider>

    <v-list-item v-if="!!temperatureValue">
      <v-list-item-icon>
        <v-icon>mdi-thermometer</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle
        >{{
          Number(
            temperatureValue.state.find(s => s.type === "Report").data
          ).toFixed(2)
        }}&deg;C</v-list-item-subtitle
      >
    </v-list-item>

    <v-list-item v-if="!!temperatureValue">
      <v-list-item-icon>
        <v-icon>mdi-thermometer</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle
        >{{
          Number(
            temperatureValue.state.find(s => s.type === "Report").data
          ).toFixed(2)
        }}&deg;C</v-list-item-subtitle
      >
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import axios from "axios";

export default Vue.extend({
  name: "StovvyStoveDeviceCard",

  components: {},

  data: () => ({}),

  props: {
    device: {
      type: Object // not typed yet, due to difficulties with parser.
    }
  },

  computed: {
    deviceData: function(): Device {
      return this.device;
    },
    temperatureValue: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find(
          v => v.type === "temperature" && v.permission === "r"
        ) || null
      );
    },
    desiTemperatureValue: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find(
          v => v.type === "temperature" && v.permission !== "r"
        ) || null
      );
    },
    desiTemperatureState: function(): StateEntity | null {
      return (
        this.desiTemperatureValue!.state!.find(s => s.type === "Control") ||
        null
      );
    },
    onOffValue: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find((v: ValueEntity) => v.type === "on_off") ||
        null
      );
    },
    pressureValue: function(): ValueEntity | null {
      return (
        this.deviceData!.value!.find(
          (v: ValueEntity) => v.type === "pressure"
        ) || null
      );
    }
  },

  methods: {
    example(value: ValueEntity): Object {
      return {};
    },
    updateState(value: Event, valueEntity: ValueEntity): void {
      this.$emit("update-state", value, this.deviceData, valueEntity);
    }
  }
});
</script>
