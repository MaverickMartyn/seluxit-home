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
        <v-col cols="12">
          <v-switch
            xl
            true-value="1"
            false-value="0"
            v-if="!!onOffValue"
            v-model="onOffValue.state.find(s => s.type === 'Control').data"
            @change="updateState($event, onOffValue)"
            label="On/Off"
            style="margin-top: 0;"
            class="d-inline"
          ></v-switch>
        </v-col>
      </v-row>

      <v-row
        align="center"
        style="font-size: 16px;"
        v-if="!!smokeTemperatureValue"
      >
        <v-col cols="6" style="max-width: fit-content;"
          >Smoke Temperature</v-col
        >
        <v-col cols="6"
          >{{
            Number(
              smokeTemperatureValue.state.find(s => s.type === "Report").data
            ).toFixed(2)
          }}&deg;C</v-col
        >
      </v-row>

      <!-- Alarm/Info message disabled, as there is no way to differentiate it from the On/Off status message. -->
      <!-- <v-row
        align="center"
        style="font-size: 16px;"
        v-if="
          !!alarmValue &&
            alarmValue.state.find(s => s.type === 'Report').data !== 'none'
        "
      >
        <v-col cols="6" style="max-width: fit-content;">Info</v-col>
        <v-col cols="6"
          >{{
            alarmValue.state.find(s => s.type === "Report").data
          }}&deg;C</v-col
        >
      </v-row> -->
    </v-card-text>

    <v-slider
      v-if="!!desiTemperatureValue"
      v-model="desiTemperatureState.data"
      :min="desiTemperatureValue.number.min"
      :max="desiTemperatureValue.number.max"
      :step="desiTemperatureValue.number.step"
      label="Desired Temperature"
      class="mx-4"
      :thumb-size="22"
      thumb-label="always"
      @change="updateState($event, desiTemperatureValue)"
    >
      <template v-slot:append>&deg;C</template>
    </v-slider>

    <v-slider
      v-if="!!heatLevelValue"
      v-model="heatLevelValue.state.find(s => s.type === 'Control').data"
      :min="heatLevelValue.number.min"
      :max="heatLevelValue.number.max"
      :step="heatLevelValue.number.step"
      label="Heat level"
      class="mx-4"
      ticks
      append-icon="mdi-percent"
      :thumb-size="22"
      thumb-label="always"
      @change="updateState($event, heatLevelValue)"
    ></v-slider>
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
    heatLevelValue: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find(v => v.type === "heat_intensity") || null
      );
    },
    // alarm/Info message disabled, as there is no way to differentiate it from the On/Off status message.
    // alarmValue: function(): ValueEntity | null {
    //   return (
    //     this.deviceData.value!.find(
    //       v => v.type === "state" && !!this.controlStateByValue(v)
    //     ) || null
    //   );
    // },
    smokeTemperatureValue: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find(
          v => v.type === "temperature" && this.controlStateByValue(v) !== null
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
    }
  },

  methods: {
    controlStateByValue(value: ValueEntity): StateEntity | undefined {
      return value!.state!.find(x => x.type === "Control");
    },
    updateState(value: Event, valueEntity: ValueEntity): void {
      this.$emit("update-state", value, this.deviceData, valueEntity);
    }
  }
});
</script>
