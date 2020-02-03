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

    <v-flex class="d-flex flex-row justify-space-evenly mx-4 flex-wrap">
      <v-flex class="d-flex flex-column justify-center">
        <p class="text-center">Desired Temperature</p>
        <knob-control
          v-if="!!desiTemperatureValue"
          v-model="desiTemperatureState.data"
          :min="desiTemperatureValue.number.min"
          :max="desiTemperatureValue.number.max"
          :stepSize="desiTemperatureValue.number.step"
          :valueDisplayFunction="toDegreesString"
          class="mx-auto"
          @change="updateState($event, desiTemperatureValue)"
        ></knob-control>
      </v-flex>
      <v-flex class="d-flex flex-column justify-center">
        <p class="text-center">Heat level</p>
        <knob-control
          v-if="!!heatLevelValue"
          v-model="heatLevelValue.state.find(s => s.type === 'Control').data"
          :min="heatLevelValue.number.min"
          :max="heatLevelValue.number.max"
          :stepSize="heatLevelValue.number.step"
          :valueDisplayFunction="toPercentageString"
          class="mx-auto"
          @change="updateState($event, heatLevelValue)"
        ></knob-control>
      </v-flex>
    </v-flex>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import axios from "axios";
import KnobControl from "vue-knob-control";

export default Vue.extend({
  name: "StovvyStoveDeviceCard",

  components: {
    KnobControl
  },

  data: () => ({}),

  props: {
    device: {
      type: Device
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
    toPercentageString(val: string): string {
      return val + "%";
    },
    toDegreesString(val: string): string {
      return val + "°";
    },
    /**
     * Returns the state of type "Control" belonging to a given value, if one exists.
     *
     * @remarks
     * Only values allowing manipulation have a Control state.
     * @param value The value entity.
     * @returns A state entity to manipulate the value, or null if none exists.
     */
    controlStateByValue(value: ValueEntity): StateEntity | null {
      return value!.state!.find(x => x.type === "Control") || null;
    },
    updateState(value: Event, valueEntity: ValueEntity): void {
      this.$emit("update-state", value, this.deviceData, valueEntity);
    }
  }
});
</script>
