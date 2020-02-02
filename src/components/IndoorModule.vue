<template>
  <v-card
    max-height="100%"
    max-width="100%"
    height="100%"
    width="100%"
    style="overflow-y: auto;"
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
          {{ Number(temperatureValue.state.find(s => s.type === "Report").data).toFixed(2) }}&deg;C
        </v-col>
        <!-- <v-col cols="6">
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sun.png"
            alt="Sunny image"
            width="92"
          ></v-img>
        </v-col> -->
      </v-row>
    </v-card-text>

    <v-list-item v-if="!!co2Value">
      <v-list-item-icon>
        <v-icon>mdi-send</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>CO2: {{ co2Value.state.find(s => s.type === "Report").data }} PPM</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if="!!pressureValue">
      <v-list-item-icon>
        <v-icon>mdi-cloud-download</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>Pressure: {{ pressureValue.state.find(s => s.type === "Report").data }} Pa</v-list-item-subtitle>
    </v-list-item>

    <v-slider
      v-if="!!humidityModel"
      v-model="humidityModel"
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
    >
    <template :slot="append">
      <div></div>
    </template>
    </v-slider>

    <!-- <v-list class="transparent">
      <v-list-item v-for="item in forecast" :key="item.day">
        <v-list-item-title>{{ item.day }}</v-list-item-title>

        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-subtitle class="text-right">
          {{ item.temp }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list> -->

    <!-- <v-divider></v-divider>

    <v-card-actions>
      <v-btn text>Full Report</v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
// import ValueMeter from "@/components/ValueMeter.vue";

export default Vue.extend({
  name: "DeviceCard",

  components: {
    // valueMeter
  },

  data: () => ({
    labels: ["color", "brightness"],
    time: "",
    forecast: []
  }),

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
        this.deviceData.value!.find((v: ValueEntity) => v.type === "temperature") ||
        null
      );
    },
    co2Value: function(): ValueEntity | null {
      return (
        this.deviceData.value!.find((v: ValueEntity) => v.type === "co2") ||
        null
      );
    },
    pressureValue: function(): ValueEntity | null {
      return (
        this.deviceData!.value!.find((v: ValueEntity) => v.type === "pressure") ||
        null
      );
    },
    humidityValue: function(): ValueEntity | null {
      return (
        this.deviceData!.value!.find((v: ValueEntity) => v.type === "humidity") ||
        null
      );
    },
    humidityModel: function(): Number | null {
      if (this.humidityValue !== null) {
        return Number(this.humidityValue!.state!.find(s => s.type === "Report")!.data)!.toFixed(2) || null;
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
