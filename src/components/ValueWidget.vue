<template>
  <div class="col-sm-4 col-md-3 d-flex">
    <v-card style="width: 100%">
      <v-card-text>
        <div>{{ this.device.name }}</div>
        <p class="display-1 text--primary">
          {{ this.valueEntityData.name }}
        </p>

        <p
          v-if="this.valueEntityData.type === 'on_off'"
          class="headline text--primary"
        >
          {{ (state || controlState).data > 0 ? "On" : "Off" }}
        </p>

        <p
          v-if="this.valueEntityData.type !== 'on_off'"
          class="headline text--primary"
        >
          {{
            (this.state || this.controlState) &&
              (this.state || this.controlState).data
          }}{{
            this.valueEntityData.type === "temperature"
              ? "&deg;"
              : this.valueEntityData.number &&
                this.valueEntityData.number.unit === "%"
              ? "%"
              : this.valueEntityData.number &&
                " " + this.valueEntityData.number.unit
          }}
        </p>
      </v-card-text>
      <v-card-actions v-if="hasControlState">
        <v-slider
          v-if="!!valueEntityData.number && !isBooleanValue"
          :min="valueEntityData.number.min"
          :max="valueEntityData.number.max"
          :step="valueEntityData.number.step"
          v-model="(state || controlState).data"
          @change="updateState"
        >
          <template v-slot:append>
            <v-text-field
              v-model="(state || controlState).data"
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
          v-if="isBooleanValue"
          v-model="(state || controlState).data"
          @change="updateState"
          label="On/Off"
        ></v-switch>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import axios from "axios";

export default Vue.extend({
  name: "ValueWidget",

  components: {},

  props: {
    valueEntity: {
      type: ValueEntity
    }
  },

  computed: {
    valueEntityData: function(): ValueEntity {
      return this.valueEntity;
    },
    device: function(): Device {
      return this.$store.state.network.device.find(
        (x: Device) => x.meta.id === this.valueEntityData.deviceId
      );
    },
    state: function(): StateEntity | null | undefined {
      var state:
        | StateEntity
        | null
        | undefined = this.valueEntityData!.state!.find(
        x => x.type === "Report"
      );
      return state;
    },
    hasControlState: function(): boolean {
      return this.controlState !== null;
    },
    controlState: function(): StateEntity | null {
      return (
        this.valueEntityData.state!.find(
          (s: StateEntity) => s.type === "Control"
        ) || null
      );
    },
    isBooleanValue: function(): boolean {
      return (
        this.valueEntityData!.number!.min === 0 &&
        this.valueEntityData!.number!.step === 1 &&
        this.valueEntityData!.number!.max === 1
      );
    }
  },

  methods: {
    updateState(value: Event): void {
      this.$emit("update-state", value, this.device, this.valueEntity);
    }
  }
});
</script>
