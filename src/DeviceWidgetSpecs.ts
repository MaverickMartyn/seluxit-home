import IndoorModule from "@/components/IndoorModule.vue";
import StovvyStove from "@/components/StovvyStove.vue";
import { Component } from "vue";

export interface IDeviceSpec {
  manufacturer: string;
  name: string;
  component: Component;
}

/**
 * Specifies devices and their respective display components.
 */
export default {
  devices: [
    {
      manufacturer: "EnviSens",
      name: "Indoor module",
      component: IndoorModule
    },
    {
      manufacturer: "Stovy",
      name: "Stove-2020",
      component: StovvyStove
    }
  ] as IDeviceSpec[]
};
