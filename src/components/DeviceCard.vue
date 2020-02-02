<template>
  <div class="col-md-6 d-flex">
    <v-card style="width: 100%;">
      <v-card-text>
        <div>{{ deviceData.manufacturer }}</div>
        <p class="display-1 text--primary">
          {{ this.deviceData.name }}
        </p>
        <p>{{ deviceData.version }}</p>
        <div class="text--primary">
          <div>{{ deviceData.description }}</div>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Value</th>
                  <th class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="value in deviceData.value" :key="value.id">
                  <td>{{ value.name }}</td>
                  <td v-if="value.type !== 'on_off'">
                    {{
                      value.type !== "on_off"
                        ? (value.state.find(x => x.type === "Report") || {})
                            .data
                        : (value.state.find(x => x.type === "Control") || {})
                            .data > 0
                        ? "On"
                        : "Off"
                    }}{{
                      value.type === "temperature"
                        ? "&deg;"
                        : value.number && value.number.unit === "%"
                        ? "%"
                        : value.number && value.number.unit
                    }}
                  </td>
                  <td v-if="hasControlState(value)">
                    <v-slider
                      v-if="!!value.number && !isBooleanControlValue(value)"
                      :min="value.number.min"
                      :max="value.number.max"
                      :step="value.number.step"
                      v-model="
                        (value.state.find(x => x.type === 'Control') || {}).data
                      "
                      @change="updateState($event, value)"
                    >
                      <template v-slot:append>
                        <v-text-field
                          v-model="
                            (value.state.find(x => x.type === 'Control') || {})
                              .data
                          "
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                    <v-switch
                      lg
                      true-value="1"
                      false-value="0"
                      v-if="isBooleanControlValue(value)"
                      v-model="
                        (value.state.find(x => x.type === 'Control') || {}).data
                      "
                      @change="updateState($event, value)"
                      label="On/Off"
                    ></v-switch>
                  </td>
                  <td v-if="!hasControlState"></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import axios from "axios";

export default Vue.extend({
  name: "DeviceCard",

  components: {},

  props: {
    device: {
      type: Object // not typed yet, due to difficulties with parser.
    }
  },

  computed: {
    deviceData: function(): Device {
      return this.device;
    }
  },

  methods: {
    hasControlState(value: ValueEntity): boolean {
      return value.state!.find(x => x.type === "Control") !== undefined;
    },
    controlStateByValue(value: ValueEntity): StateEntity | undefined {
      return value!.state!.find(x => x.type === "Control");
    },
    isBooleanControlValue(value: ValueEntity): boolean {
      return (
        value!.number! &&
        value!.number!.min === 0 &&
        value!.number! &&
        value!.number!.step === 1 &&
        value!.number! &&
        value!.number!.max === 1
      );
    },
    updateState(value: Event, valueEntity: ValueEntity): void {
      axios.post(
        "https://www.seluxit.com/smarthome/services/2.0/network/" +
          this.$store.state.networkId +
          "/device/" +
          this.deviceData.meta.id +
          "/value/" +
          valueEntity!.meta!.id +
          "/state/" +
          this.controlStateByValue(valueEntity)!.meta.id,
        {
          timestamp: Date.now().toString(),
          data: value,
          meta: { id: this.controlStateByValue(valueEntity)!.meta.id }
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
});
</script>
