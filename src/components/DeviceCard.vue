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
                      v-if="!!value.number && !isBooleanValue(value)"
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
                      v-if="isBooleanValue(value)"
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
      type: Device
    }
  },

  computed: {
    deviceData: function(): Device {
      return this.device;
    }
  },

  methods: {
    /**
     * Indicates whether a given value entity has a state of the type "Control".
     *
     * @remarks
     * Only values allowing manipulation have a Control state.
     * @param value The value entity.
     * @returns A boolean indicating whether the value has a Control state.
     */
    hasControlState(value: ValueEntity): boolean {
      return value.state!.find(x => x.type === "Control") !== undefined;
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
    /**
     * Indicates whether a given value entity has number data with a binary range.
     *
     * @param value The value entity.
     * @returns A boolean indicating whether the value is boolean.
     */
    isBooleanValue(value: ValueEntity): boolean {
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
      this.$emit("update-state", value, this.deviceData, valueEntity);
    }
  }
});
</script>
