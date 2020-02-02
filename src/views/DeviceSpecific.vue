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
      drag-allow-from=".v-card > .v-list-item"
    >
      <component
        :is="getComponentByDevice(widget.device)"
        :device="widget.device"
      ></component>
    </grid-item>
  </grid-layout>
</template>

<script lang="ts">
// @ is an alias to /src
/// <reference path="../vue-grid-layout.d.ts" />
import { GridLayout, GridItem, GridItemData } from "vue-grid-layout";
import IndoorModule from "@/components/IndoorModule.vue";
import { Device, ValueEntity, StateEntity } from "@/APITypes";
import axios from "axios";
import DeviceWidgetSpecs from "@/DeviceWidgetSpecs";
import { Component } from "vue";

interface IWidget extends GridItemData {
  deviceId: string;
  device: Device | null;
  component: Component | null;
}

export default {
  name: "ValueDashboard",
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
    getComponentByDevice: function(device: Device): Component {
      return (
        DeviceWidgetSpecs.devices.find(obj => {
          return (
            obj.name === device.name && obj.manufacturer === device.manufacturer
          );
        })!.component || IndoorModule
      );
    },
    getDeviceById: function(deviceId: string): Device | null {
      return this.devices.find((d: Device) => d.meta.id === deviceId) || null;
    },
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
            component:
              DeviceWidgetSpecs.devices.find(obj => {
                return (
                  obj.name === d.name && obj.manufacturer === d.manufacturer
                );
              })!.component || IndoorModule
          });
          x += 3;
          if (x > 12) {
            y++;
            x = 0;
          }
        } else {
          widgets[widgets.indexOf(wid)].device = d;
          widgets[widgets.indexOf(wid)].component =
            DeviceWidgetSpecs.devices.find(obj => {
              return obj!.name === d.name && obj!.manufacturer === d.manufacturer;
            })!.component || IndoorModule;
        }
      });
      this.widgets = widgets;
    }
  }
};
</script>
