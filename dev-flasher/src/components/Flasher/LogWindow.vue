<template>
  <pre
    v-html="workingLogLine + htmlToDisplay"
    style="
      max-height: 30dvh;
      overflow-y: auto;
      height: 500px;
      width: 100%;
      background-color: cadetblue;
      color: white;
      padding: 8px;
      border-radius: 8px;
      font-family: monospace;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 12px;
    "
  />
  <button
    @click="terminal.clean()"
    style="
      margin-top: 8px;
      padding: 6px 12px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    "
  >
    Clear Log
  </button>
</template>
<script setup lang="ts">
const emit = defineEmits(['terminal']);

import type { IEspLoaderTerminal } from 'esptool-js';
import { onMounted, ref } from 'vue';

//const lastWrittenDataType = ref<'write' | 'writeLine'>('writeLine');
const workingLogLine = ref<string>('');
const terminal: IEspLoaderTerminal = {
  clean() {
    htmlToDisplay.value = '';
  },
  write(data: string) {
    if (workingLogLine.value) {
      workingLogLine.value += data;
    } else {
      workingLogLine.value = `${getDateTimeString()}${data}`;
    }
    //lastWrittenDataType.value = 'write';
  },
  writeLine(data: string) {
    /*if (lastWrittenDataType.value === 'write') {
      htmlToDisplay.value += `${data}<br/> `;
    } else {
      htmlToDisplay.value = `${getDateTimeString()}${data}<br/>${htmlToDisplay.value}`;
    }*/
    if (workingLogLine.value) {
      htmlToDisplay.value = `${workingLogLine.value}${data}<br/>${htmlToDisplay.value}`;
      workingLogLine.value = '';
    } else {
      htmlToDisplay.value = `${getDateTimeString()}${data}<br/>${htmlToDisplay.value}`;
    }
  },
};

const htmlToDisplay = ref<string>(`
Your log will be displayed here. Please select a device to start the flashing process.
  `);

onMounted(() => {
  emit('terminal', terminal);
});

const getDateTimeString = (): string => {
  const now = new Date();
  // retur in format DD/MM/YYYY HH:MM:SS.mmm
  return `[${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}]: `;
};
</script>
