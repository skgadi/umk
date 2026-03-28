#include "main.h"


GSK_IO_ANALOG_IN::GSK_IO_ANALOG_IN (int id, int* pins):GSK_IO_PROPERTIES(id, pins) {
  this->pins = new int[1];
  this->pins[0] = pins[0];
  reset();
}

void GSK_IO_ANALOG_IN::reset () {
  pinMode(this->pins[0], INPUT);
}


void GSK_IO_ANALOG_IN::loop() {
  DATA_OUT[this->id] = analogRead(this->pins[0]);
}


void GSK_IO_ANALOG_IN::setVal(nlohmann::json a) {
}