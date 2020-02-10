<template>
  <v-list dense>
    <template v-for="(item, index) in items">
      <v-subheader
        class="text-capitalize py-1"
        style="height:auto"
        v-if="item.group"
        :key="item.group"
        v-text="item.group"
      ></v-subheader>

      <v-divider
        v-else-if="item.divider"
        :key="index"
        :inset="item.inset"
      ></v-divider>

      <v-list-item v-else @click="$emit(item.callback, evt)" :key="index">
        <v-list-item-icon class="mr-2">
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
export default {
  props: ["evt", "items"]
};
</script>

<style></style>
