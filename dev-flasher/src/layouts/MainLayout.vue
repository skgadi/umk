<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Flasher for Uyamak</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Uyamak',
    caption: 'Main website',
    icon: 'mdi-web',
    link: 'https://umk.skgadi.com/',
  },
  {
    title: 'Uyamak editor',
    caption: 'Model based design tool',
    icon: 'mdi-application-outline',
    link: 'https://umk.skgadi.com/app/latest/',
  },
  {
    title: 'YouTube',
    caption: 'The official YouTube channel',
    icon: 'mdi-youtube',
    link: 'https://www.youtube.com/@uyamak',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
