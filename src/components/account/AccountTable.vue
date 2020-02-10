<template>
  <v-data-table
    v-model="selectedRows"
    :search="search"
    :headers="headers"
    :items="items"
    item-key="name"
    show-select
    :loading="loading"
    loading-text="Loading... Please wait"
    multi-sort
    :dense="dense"
    v-bind="$attrs"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-text-field
          v-model="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <div class="flex-grow-1"></div>

        <!-- slot -->
        <slot></slot>
        <!-- slot -->

        <v-menu v-model="menu" :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-action>
                  <v-switch v-model="dense" color="green lighten-1"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Dense</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon class="mr-2" @click="setEditItem(item)">mdi-pencil</v-icon>
    </template>
    <template v-if="selectedRows.length" v-slot:footer>
      <v-btn small class="ma-3" @click="deleteItems">
        <v-icon>mdi-delete</v-icon>Delete selected
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { EventBus } from "@/bus";
export default {
  props: ["title", "headers", "loading", "items"],
  data() {
    return {
      search: "",
      dense: false,
      selectedRows: [],
      menu: false,
      editedIndex: null
    };
  },
  methods: {
    setEditItem(item) {
      this.$store.commit("account/setEditedObject", item);
      this.$router.push({ name: "editplace", params: { editId: item.id } });
    },
    deleteItems() {
      if (this.selectedRows.length) {
        this.$emit("delete", this.selectedRows);
      }
    }
  }
};
</script>

<style></style>
