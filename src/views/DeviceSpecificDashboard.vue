<template>
  <grid-layout
    :layout.sync="widgets"
    :col-num="12"
    :cols="{ lg: 12, md: 10, sm: 6, xs: 2, xxs: 1 }"
    :row-height="30"
    :is-draggable="true"
    :is-resizable="true"
    :is-mirrored="false"
    :vertical-compact="false"
    :margin="[10, 10]"
    :use-css-transforms="true"
    :responsive="true"
  >
    <grid-item
      v-for="widget in widgets"
      v-bind.sync="widget"
      :key="widget.deviceId"
      ignoreDragFrom="*"
      drag-allow-from=".drag-handle"
    >
      <component
        :is="getComponentByDevice(widget.device)"
        :device="widget.device"
        @update-state="updateState"
      ></component>
      <v-icon large class="drag-handle">mdi-drag</v-icon>
    </grid-item>
  </grid-layout>
</template>

<style lang="scss">
.drag-handle {
  position: absolute;
  top: 0;
  right: 0;
}
</style>

<script lang="ts">
// @ is an alias to /src
/// <reference path="../vue-grid-layout.d.ts" />
import { GridLayout, GridItem, GridItemData } from "vue-grid-layout";
import IndoorModule from "@/components/IndoorModule.vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import axios from "axios";
import DeviceWidgetSpecs, { IDeviceSpec } from "@/DeviceWidgetSpecs";
import { Component } from "vue";

interface IWidget extends GridItemData {
  deviceId: string;
  device: Device | null;
  component: Component | null;
}

export default {
  name: "DeviceSpecificDashboard",
  components: {
    IndoorModule,
    GridLayout,
    GridItem
  },

  mounted(): void {
    this.loadDeviceWidgets();
  },

  data: () => ({
    hiddenWidgetTypes: ["color", "brightness"],
    widgets: [] as IWidget[]
  }),

  computed: {
    devices: function(): Device[] {
      return (
        (this.$store.state.network && this.$store.state.network.device) || []
      );
    }
  },

  watch: {
    devices: function(val: Device[]): void {
      this.loadDeviceWidgets();
    },
    // updates localStorage when widgets are repositioned or resized.
    widgets: function(val: IWidget[]): void {
      var newVal: IWidget[] = JSON.parse(JSON.stringify(val));
      newVal.forEach((w: IWidget) => {
        w.device = null;
        w.component = null;
      });
      localStorage.setItem("widgets", JSON.stringify(newVal));
    }
  },

  methods: {
    updateState(value: Event, device: Device, valueEntity: ValueEntity): void {
      this.$emit("update-state", value, device, valueEntity);
    },
    /**
     * Returns the component to use for a given device.
     *
     * @remarks
     * Device and component mappings can be found in DeviceWidgetSpecs.ts
     * @param device The device.
     * @returns A vue component to display and/or manipulate the device data.
     */
    getComponentByDevice: function(device: Device): Component {
      var spec: IDeviceSpec | undefined = DeviceWidgetSpecs.devices.find(
        obj => {
          return (
            obj &&
            device &&
            obj!.name === device!.name &&
            obj!.manufacturer === device!.manufacturer
          );
        }
      );
      return spec !== undefined ? spec!.component : IndoorModule;
    },
    /**
     * Get a device by its meta id.
     *
     * @param deviceId The id.
     * @returns The device if found, otherwise null.
     */
    getDeviceById: function(deviceId: string): Device | null {
      return this.devices.find((d: Device) => d.meta.id === deviceId) || null;
    },
    /**
     * Load all widgets with their respective devices attached, into this.widgets.
     *
     * @remarks
     * All widget objects have their device attached in a field for easy access in child components.
     */
    loadDeviceWidgets: function(): void {
      var x: number = 0;
      var y: number = 0;
      var widgets: IWidget[] = JSON.parse(
        localStorage.getItem("widgets") || "[]"
      ) as IWidget[];
      this.devices.forEach((d: Device) => {
        var wid: IWidget | undefined = widgets.find(
          (w: IWidget) => w.deviceId === d.meta.id
        );
        if (wid === undefined) {
          widgets.push({
            i: widgets.length.toString(),
            x: x,
            y: y,
            w: 3,
            h: 5,
            deviceId: d.meta.id,
            device: this.getDeviceById(d.meta.id),
            component: this.getComponentByDevice(d) || IndoorModule
          });
          x += 3;
          if (x > 12) {
            y++;
            x = 0;
          }
        } else {
          widgets[widgets.indexOf(wid)].device = d;
          widgets[widgets.indexOf(wid)].component =
            this.getComponentByDevice(d) || IndoorModule;
        }
      });
      this.widgets = widgets;
    }
  }
};
</script>
