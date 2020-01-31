<template>
  <div class="col-md-6">
    <v-card>
      <v-card-text>
        <div>{{ this.deviceData.manufacturer }}</div>
        <p class="display-1 text--primary">
          {{ this.deviceData.name }}
        </p>
        <p>{{ this.deviceData.version }}</p>
        <div class="text--primary">
          <div>{{ this.deviceData.description }}</div>
          <ul>
            <li v-for="value in this.deviceData.value" v-bind:key="value.id">
              {{ value.name }}
              <div v-if="!!value.number">
                <value-meter :value="value"></value-meter>
              </div>
              <ul>
                <li v-for="state in value.state" v-bind:key="state.id">
                  {{ state.data }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="deep-purple accent-4">
          Learn More
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import ValueMeter from "@/components/ValueMeter.vue";

export default Vue.extend({
  name: "DeviceCard",

  components: {
    ValueMeter
  },

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
    barInnerStyle(value: ValueEntity): Object {
      // eslint-disable-next-line no-console
      console.log(value);
      var state: StateEntity | null | undefined = value!.state!.find(
        x => x.type === "Report"
      );
      var style: Object = {
        backgroundColor: "#FF0000",
        top: (Number(state!.data) / value!.number!.max) * 100
      };
      // eslint-disable-next-line no-console
      console.log(style);
      return style;
    }
  }
});
</script>
