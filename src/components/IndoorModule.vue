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
          {{
            Number(
              temperatureValue.state.find(s => s.type === "Report").data
            ).toFixed(2)
          }}&deg;C
        </v-col>
      </v-row>
    </v-card-text>

    <v-list-item v-if="!!co2Value">
      <v-list-item-icon>
        <v-icon>mdi-send</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle
        >CO2:
        {{ co2Value.state.find(s => s.type === "Report").data }}
        PPM<span v-if="!!alarmText" class="d-block red--text">{{
          alarmText
        }}</span></v-list-item-subtitle
      >
    </v-list-item>

    <v-list-item v-if="!!pressureValue">
      <v-list-item-icon>
        <v-icon>mdi-cloud-download</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle
        >Pressure:
        {{
          Number(
            pressureValue.state.find(s => s.type === "Report").data
          ).toFixed(2)
        }}
        Pa</v-list-item-subtitle
      >
    </v-list-item>

    <v-slider
      v-if="!!humidityModel"
      :value="humidityModel"
      :min="humidityValue.number.min"
      :max="humidityValue.number.max"
      :step="humidityValue.number.step"
      label="Humidity"
      class="mx-4"
      ticks
      readonly
      append-icon="mdi-percent"
      :thumb-size="18"
      thumb-label="always"
    ></v-slider>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";

export default Vue.extend({
  name: "IndoorModuleDeviceCard",

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
          (v: ValueEntity) => v.type === "temperature"
        ) || null
      );
    },
    co2Value: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find((v: ValueEntity) => v.type === "co2") ||
        null
      );
    },
    alarmValue: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find((v: ValueEntity) => v.type === "message") ||
        null
      );
    },
    alarmText: function(): string | null {
      return (
        this.alarmValue!.state!.find(s => s.type === "Report")!.data || null
      );
    },
    pressureValue: function(): ValueEntity | null {
      return (
        this.deviceData!.value!.find(
          (v: ValueEntity) => v.type === "pressure"
        ) || null
      );
    },
    humidityValue: function(): ValueEntity | null {
      return (
        this.deviceData!.value!.find(
          (v: ValueEntity) => v.type === "humidity"
        ) || null
      );
    },
    humidityModel: function(): string | null {
      if (this.humidityValue !== null) {
        return (
          Number(
            this.humidityValue!.state!.find(s => s.type === "Report")!.data
          )!.toFixed(2) || null
        );
      } else {
        return null;
      }
    }
  },

  methods: {
    example(value: ValueEntity): Object {
      return {};
    }
  }
});
</script>
