<template>
  <v-container fluid>
    <v-flex class="home-flex-wrap">
      <value-widget
        v-for="valueEntity in valueEntities"
        :valueEntity="valueEntity"
        :key="valueEntity.id"
        @update-state="updateState"
      ></value-widget>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import ValueWidget from "@/components/ValueWidget.vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import axios from "axios";

export default {
  name: "GenericValueOverview",
  components: {
    ValueWidget
  },

  data: () => ({
    hiddenWidgetTypes: ["color", "brightness"]
  }),

  computed: {
    valueEntities: function(): ValueEntity[] {
      return (
        (this.$store.state.network &&
          Array.prototype.concat.apply(
            [],
            this.$store.state.network.device!.map((d: Device) => {
              var values: ValueEntity[] = d.value || [];
              values.forEach(element => {
                element.deviceId = d.meta.id;
              });
              return d.value;
            })
          )) ||
        new Array<ValueEntity>()
      ).filter(
        (x: ValueEntity) =>
          x.type === "on_off" ||
          (this.hiddenWidgetTypes.indexOf(x.type || "") < 0 &&
            x.state!.filter((s: StateEntity) => s.type === "Report").length > 0)
      );
    }
  },

  methods: {
    updateState(value: Event, device: Device, valueEntity: ValueEntity): void {
      this.$emit("update-state", value, device, valueEntity);
    }
  }
};
</script>
