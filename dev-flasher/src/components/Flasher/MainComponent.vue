<template>
  <template v-if="isSerialSupported">
    <div class="column items-center q-pa-md" style="max-width: 800px; margin: 0 auto">
      <div class="text-h5">Welcome to the Flasher for Uyamak</div>
      <p class="text-caption text-italic">
        This tool allows you to flash firmware onto your Uyamak devices using the Web Serial API.
        Please connect a compatible device and select it to get started.
      </p>
      <div class="text-caption" style="text-align: justify">
        Supported devices include those based on the <code>ESP32-D0WD</code>,
        <code>ESP32-D2WD</code>, and <code>ESP32-V3</code> chips. Please ensure your device is in
        bootloader mode before attempting to flash. To enter bootloader mode, typically you need to
        hold the "<code>BOOT</code>" button while pressing the "<code>RESET</code>" button on your
        device, then release the "<code>RESET</code>" button first. Refer to your device's
        documentation for specific instructions.
        <ol>
          <li>Connect your ESP32 device to your computer via USB.</li>
          <li>Select the device by clicking on button "<code>Select a device</code>".</li>
          <li>Click "<code>Fetch Device Info</code>" to verify the connection.</li>
          <li>Click "<code>Proceed to Flashing</code>" to start the flashing process.</li>
        </ol>
      </div>
      <q-btn
        push
        no-caps
        color="primary"
        v-if="!selectedPort"
        label="Select a device"
        icon="mdi-serial-port"
        @click="onSelectDevice"
      />
      <template v-else>
        <q-btn-group push>
          <q-btn
            push
            no-caps
            color="secondary"
            label="Change device"
            icon="mdi-serial-port"
            @click="onSelectDevice"
          />
          <q-btn
            push
            no-caps
            color="primary"
            label="Fetch Device Info"
            icon="mdi-information-outline"
            @click="getChipName"
            :disabled="!selectedPort"
          />
          <q-btn
            push
            no-caps
            color="primary"
            label="Proceed to Flashing"
            icon="mdi-flash"
            @click="flashDevice"
            :disabled="!firmwareData"
          />
          <q-btn
            push
            no-caps
            color="negative"
            label="Reset Device"
            icon="mdi-restart"
            @click="resetDevice"
            :disabled="!selectedPort"
          />
        </q-btn-group>
      </template>
      <div v-if="selectedPort" class="q-mt-md text-center">
        <div class="text-subtitle1">
          Selected Device ({{ numberToHex(selectedPort.getInfo().usbVendorId) }}:{{
            numberToHex(selectedPort.getInfo().usbProductId)
          }}): {{ displayChipInfo }}
        </div>
        <div class="text-caption text-italic">
          Note: The Web Serial API may not provide detailed device information. Please ensure you
          have selected the correct device.
        </div>
        <template v-if="isFlashing">
          <q-linear-progress
            stripe
            size="10px"
            :value="flashProgress"
            :indeterminate="flashProgress === 0"
          />
        </template>
      </div>
      <log-window @terminal="prepareTerminal" />
    </div>
  </template>
  <template v-else>
    <q-card>
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
import LogWindow from 'src/components/Flasher/LogWindow.vue';

//import firmwareEsp32D0wdBlinkPin4 from 'assets/firmware-bins/esp32-d0wd-blink-pin-4.bin?url';
import firmwareEsp32D0wd from 'assets/firmware-bins/esp32-d0wd.bin?url';
import firmwareEsp32D2wd from 'assets/firmware-bins/esp32-d0wd.bin?url'; // Test if the same firmware works for both D0WD and D2WD variants
import firmwareEsp32V3 from 'assets/firmware-bins/esp32-d0wd.bin?url'; // Test if the same firmware works for ESP32-V3 variant as well

import { computed, onMounted, ref, watch } from 'vue';
import {
  ESPLoader,
  type LoaderOptions,
  Transport,
  type IEspLoaderTerminal,
  type FlashOptions,
  type FlashModeValues,
  type FlashFreqValues,
  type FlashSizeValues,
} from 'esptool-js';

const isSerialSupported = 'serial' in navigator;
const chipName = ref<string | null>(null);
const espLoader = ref<ESPLoader | null>(null);
const terminal = ref<IEspLoaderTerminal | null>(null);
const isFetchingInfo = ref(false);
const isFlashing = ref(false);
const flashProgress = ref(0);
const firmwareData = ref<Uint8Array | null>(null);
const acceptableChips = ref<{ chipNameStartsWith: string; binData: Uint8Array }[]>([]);
const displayChipInfo = computed(() => {
  if (isFetchingInfo.value) {
    return 'Fetching device information...';
  }
  if (chipName.value) {
    return chipName.value;
  }
  return 'Failed to fetch device information.';
});

const onSelectDevice = async () => {
  try {
    await closeTransporterAndSerialPort(); // Ensure any previously opened port is closed before selecting a new one
    selectedPort.value = null; // Reset selected port
    // Optionally, filter by USB vendor/product IDs
    const portFilters = [
      { usbVendorId: 0x10c4, usbProductId: 0xea60 }, // Example: Silicon Labs CP210x
    ];
    selectedPort.value = await navigator.serial.requestPort({ filters: portFilters });
  } catch (error) {
    alert('Device selection was cancelled or failed. Please try again.');
    console.warn('Error selecting device:', error);
  }
};

const getChipName = async () => {
  console.log('Attempting to fetch chip name...');
  isFetchingInfo.value = true;
  try {
    chipName.value = null; // Reset chip name before fetching new info
    await createEspLoader();
    if (!espLoader.value) {
      alert('Loader not initialized. Refresh the page and select a device.');
      return;
    }
    chipName.value = await espLoader.value.main();
  } catch (error) {
    console.warn('Error fetching chip name:', error);
  } finally {
    isFetchingInfo.value = false;
  }
};

const createEspLoader = async () => {
  await closeTransporterAndSerialPort();
  espLoader.value = null;
  if (!selectedPort.value) {
    alert('Please select a device first.');
    return;
  }
  if (!terminal.value) {
    alert('Terminal not ready. Please try again after a moment.');
    return;
  }
  const transport = new Transport(selectedPort.value, true);
  const loaderOptions: LoaderOptions = {
    transport,
    terminal: terminal.value,
    baudrate: 115200,
    debugLogging: true,
  };
  espLoader.value = new ESPLoader(loaderOptions);
};

const selectedPort = ref<SerialPort | null>(null);

const prepareTerminal = (inTerminal: IEspLoaderTerminal) => {
  terminal.value = inTerminal;
};

watch([selectedPort, terminal], async ([port, term]) => {
  espLoader.value = null; // Reset any existing loader instance

  if (!term) {
    console.warn('Terminal not ready. Loader will be prepared once terminal is available.');
    return;
  }
  if (!port) {
    console.warn('No device selected. Loader will be prepared once a device is selected.');
    return;
  }
  await getChipName();
});

const numberToHex = (num: number | undefined): string => {
  return '0x' + (num ?? 0).toString(16).padStart(4, '0');
};

const closeTransporterAndSerialPort = async () => {
  if (espLoader.value) {
    try {
      await espLoader.value.transport.disconnect();
      console.log('ESP loader closed successfully.');
    } catch (error) {
      console.warn('Error closing ESP loader:', error);
    }
  }
  if (selectedPort.value) {
    try {
      await selectedPort.value.close();
      console.log('Serial port closed successfully.');
    } catch (error) {
      console.warn('Error closing serial port:', error);
    }
  }
};

const resetDevice = async () => {
  await closeTransporterAndSerialPort();
  selectedPort.value = null;
  chipName.value = null;
  espLoader.value = null;
};

watch(chipName, () => {
  firmwareData.value = null;
  if (!chipName.value) {
    return;
  }
  const matchingChip = acceptableChips.value.find((chip) =>
    chipName.value!.startsWith(chip.chipNameStartsWith),
  );
  if (matchingChip) {
    firmwareData.value = matchingChip.binData;
  }
});

const flashDevice = async () => {
  try {
    if (!selectedPort.value) {
      alert('Please select a device first.');
      throw new Error('No device selected');
    }
    const confirm = window.confirm(
      `Are you sure you want to flash the selected device (${numberToHex(selectedPort.value.getInfo().usbVendorId)}:${numberToHex(selectedPort.value.getInfo().usbProductId)})?. This action cannot be undone.`,
    );
    if (!confirm) {
      // Implement flashing logic here
      alert('Flashing cancelled by user.');
      throw new Error('Flashing cancelled by user');
    }
    await getChipName();
    isFlashing.value = true; // Set flashing state to true when starting the process
    if (!firmwareData.value) {
      alert('No firmware data available.');
      throw new Error('No firmware data available');
    }
    if (!espLoader.value) {
      alert('Loader not initialized. Please fetch device info first.');
      throw new Error('Loader not initialized');
    }

    const flashOptions: FlashOptions = {
      fileArray: [{ data: firmwareData.value, address: 0x0 }],
      flashMode: 'dio' as FlashModeValues,
      flashFreq: '40m' as FlashFreqValues,
      flashSize: '4MB' as FlashSizeValues,
      eraseAll: false,
      compress: true,
      reportProgress: (fileIndex, written, total) => {
        flashProgress.value = written / total;
        console.log(`Progress: ${((written / total) * 100).toFixed(1)}%`);
      },
    };
    await espLoader.value.writeFlash(flashOptions);
    await espLoader.value.after('hard_reset');
    await closeTransporterAndSerialPort();
    alert('Flashing completed successfully!');
  } catch (error) {
    console.warn('Error during flashing:', error);
    alert(
      'An error occurred while trying to flash the device. Please check the console for details.',
    );
  } finally {
    isFlashing.value = false; // Reset flashing state after attempt
  }
};

onMounted(async () => {
  const newAcceptableChips: { chipNameStartsWith: string; binData: Uint8Array }[] = [
    {
      chipNameStartsWith: 'ESP32-D0WD',
      binData: await loadUnit8ArrayFromFile(firmwareEsp32D0wd), //firmwareEsp32D0wd),
    },
    {
      chipNameStartsWith: 'ESP32-D2WD',
      binData: await loadUnit8ArrayFromFile(firmwareEsp32D2wd),
    },
    {
      chipNameStartsWith: 'ESP32-V3',
      binData: await loadUnit8ArrayFromFile(firmwareEsp32V3),
    },
  ];

  acceptableChips.value = newAcceptableChips;
});

const loadUnit8ArrayFromFile = async (filePath: string): Promise<Uint8Array> => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error loading file:', error);
    throw error;
  }
};
</script>
