#include "main.h"



GSK_IO_DIGITAL_OUT::GSK_IO_DIGITAL_OUT (int id, int* pins, bool initVal):GSK_IO_PROPERTIES(id, pins) {
  this->pins = new int[1];
  this->pins[0] = pins[0];
  this->val = initVal;
  reset();
}

void GSK_IO_DIGITAL_OUT::reset() {
  pinMode(this->pins[0], OUTPUT_OPEN_DRAIN);
  this->loop();
}


void GSK_IO_DIGITAL_OUT::loop() {
  digitalWrite(this->pins[0], this->val);
  DATA_OUT[this->id] = this->val;
}

void GSK_IO_DIGITAL_OUT::setVal(nlohmann::json val) {
  this->val = val.get<boolean>();
}
