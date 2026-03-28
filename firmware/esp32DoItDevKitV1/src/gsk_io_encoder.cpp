#include "main.h"


GSK_IO_ENCODER::GSK_IO_ENCODER (int id, int* pins):GSK_IO_PROPERTIES(id, pins) {
  this->pins = new int[2];
  this->pins[0] = pins[0];
  this->pins[1] = pins[1];
  reset();
}

void GSK_IO_ENCODER::reset() {
  encoder = new ESP32Encoder();
  ESP32Encoder::useInternalWeakPullResistors=puType::up;
  encoder->attachHalfQuad(pins[0], pins[1]);
  encoder->clearCount(); 
}

void GSK_IO_ENCODER::loop() {
  DATA_OUT[this->id] = encoder->getCount();
}

void GSK_IO_ENCODER::setVal(nlohmann::json a) {
}
