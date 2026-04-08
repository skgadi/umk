<template>
  <template v-if="isSerialSupported">
    <div class="column items-center q-pa-md">
      <div class="text-h5">Welcome to the Flasher for Uyamak</div>
      <p>
        This tool allows you to flash firmware onto your Uyamak devices using the Web Serial API.
        Please connect a compatible device and select it to get started.
      </p>
      <q-btn
        no-caps
        outline
        rounded
        v-if="!selectedPort"
        label="Select a device"
        icon="mdi-serial-port"
        @click="onSelectDevice"
      />
      <q-btn
        no-caps
        outline
        rounded
        color="secondary"
        v-else
        label="Change device"
        icon="mdi-serial-port"
        @click="onSelectDevice"
      />
      <div v-if="selectedPort" class="q-mt-md text-center">
        <div class="text-subtitle1">
          Selected Device: {{ selectedPort.getInfo().usbVendorId }}:{{
            selectedPort.getInfo().usbProductId
          }}
        </div>
        <div class="text-body2">
          Note: The Web Serial API may not provide detailed device information. Please ensure you
          have selected the correct device.
        </div>
        <q-btn
          no-caps
          outline
          rounded
          color="primary"
          class="q-mt-md"
          label="Proceed to Flashing"
          icon="mdi-flash"
          @click="flashDevice"
        />
      </div>
      <br />
      <br />
    </div>
  </template>
  <template v-else>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Web Serial API Not Supported</div>
        <p>
          Your browser does not support the Web Serial API. Please use a compatible browser like
          Chrome or Edge.
        </p>
      </q-card-section>
    </q-card>
  </template>
</template>
<script setup lang="ts">
import { evaFlash } from '@quasar/extras/eva-icons';
import { ref } from 'vue';

const isSerialSupported = 'serial' in navigator;

const onSelectDevice = async () => {
  try {
    // Optionally, filter by USB vendor/product IDs
    const portFilters = [
      { usbVendorId: 0x10c4, usbProductId: 0xea60 }, // Example: Silicon Labs CP210x
    ];
    selectedPort.value = await navigator.serial.requestPort({ filters: portFilters });
  } catch (error) {
    console.error('Error selecting device:', error);
  }
};

const selectedPort = ref<SerialPort | null>(null);

const flashDevice = () => {
  if (!selectedPort.value) {
    alert('Please select a device first.');
    return;
  }
  const confirm = window.confirm(
    `Are you sure you want to flash the selected device (${selectedPort.value.getInfo().usbVendorId}:${selectedPort.value.getInfo().usbProductId})?. This action cannot be undone.`,
  );
  if (confirm) {
    // Implement flashing logic here
    alert('Flashing process started! (This is a placeholder action.)');
  }
};
</script>
