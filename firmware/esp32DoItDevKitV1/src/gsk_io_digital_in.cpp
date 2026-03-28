#include "main.h"


GSK_IO_DIGITAL_IN::GSK_IO_DIGITAL_IN (int id, int* pins):GSK_IO_PROPERTIES(id, pins) {
  this->pins = new int[1];
  this->pins[0] = pins[0];
  reset();
}

void GSK_IO_DIGITAL_IN::reset() {
  pinMode(this->pins[0], INPUT_PULLUP);
  this->loop();
}

void GSK_IO_DIGITAL_IN::loop() {
  DATA_OUT[this->id] = 0x01 && digitalRead(this->pins[0]);
}


void GSK_IO_DIGITAL_IN::setVal(nlohmann::json a) {
}