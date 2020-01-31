<template>
  <div class="col-sm-4 col-md-3 d-flex">
    <v-card style="width: 100%">
      <v-card-text>
        <!-- <div>{{ this.valueEntityData.type }}</div> -->
        <p class="display-1 text--primary">
          {{ this.valueEntityData.name }}
        </p>
        
        <!-- <p class="headline text--primary" v-for="state in this.states" v-bind:key="state.id"> -->
        <p class="headline text--primary">
          {{ this.state && this.state.data }} {{ this.valueEntityData.number && this.valueEntityData.number.unit }}
        </p>
        <!-- <p>{{ this.valueEntityData.name }}</p> -->
        <!-- <div class="text--primary">
        </div> -->
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

export default Vue.extend({
  name: "ValueWidget",

  components: {
  },

  props: {
    valueEntity: {
      type: Object // not typed yet, due to difficulties with parser.
    }
  },

  computed: {
    valueEntityData: function(): ValueEntity {
      return this.valueEntity;
    },
    state: function(): StateEntity | null | undefined {
      var state: StateEntity | null | undefined = this.valueEntityData!.state!.find(
        x => x.type === "Report"
      );
      return state;
    //   return this!.valueEntityData!.state || new Array();
    }
  },
});
</script>
