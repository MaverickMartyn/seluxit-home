<template>
  <v-sheet
    v-if="value.number"
    width="64"
    height="100"
    elevation="3"
    style="position: relative;"
  >
    <div class="bar-inner" :style="barInnerStyle"></div>
    <span class="bar-inner-text">{{
      value.state.find(x => x.type == "Report").data + " " + value.number.unit
    }}</span>
  </v-sheet>
</template>

<style lang="scss">
.bar-inner {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
}
.bar-inner-text {
  text-align: center;
  width: 100%;
  bottom: 0;
  position: absolute;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";

export default Vue.extend({
  name: "ValueMeter",

  props: {
    value: {
      type: ValueEntity
    }
  },

  computed: {
    barInnerStyle: function(): Object {
      var state: StateEntity | null | undefined = this.value!.state!.find(
        (x: StateEntity) => x.type === "Report"
      );
      var style: Object = {
        backgroundColor: "#3f51b5",
        top: 100 - (Number(state!.data) / this.value!.number!.max) * 100 + "%"
      };
      return style;
    }
  },

  data: () => ({}),

  methods: {}
});
</script>
