<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-h5">
          <q-icon name="task_alt" size="md" class="q-mr-sm" />
          Task Manager
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>Tasks</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          <div class="text-center">Task Manager © {{ currentYear }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'

const leftDrawerOpen = ref(false)
const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss">
.q-toolbar {
  min-height: 60px;
}

.q-toolbar-title {
  .q-icon {
    vertical-align: middle;
  }
}

.q-drawer {
  background-color: #f5f5f5;
  .q-item {
    border-radius: 0 24px 24px 0;
    margin-right: 12px;
    margin-bottom: 4px;

    &.q-router-link-active {
      background-color: $primary;
      color: white;
      .q-icon {
        color: white;
      }
    }
  }
}
</style>
