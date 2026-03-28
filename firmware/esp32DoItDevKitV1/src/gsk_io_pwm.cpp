#include "main.h"



GSK_IO_PWM::GSK_IO_PWM (int id, int* pins, float initVal, int channel, int freq, int res):GSK_IO_PROPERTIES(id, pins) {
  this->pins = new int[1];
  this->pins[0] = pins[0];
  this->val = initVal;
  this->channel = channel;
  this->freq = freq;
  this->res = res;
  this->maxDutyCycle = (int)(pow(2, res) - 1);
  Serial.print("maxDutyCycle");
  Serial.println(maxDutyCycle);
  reset();
}


void GSK_IO_PWM::reset() {
  pinMode(this->pins[0], OUTPUT);
  ledcSetup(channel, freq, res);
  ledcAttachPin(pins[0], channel);
  this->loop();
}


void GSK_IO_PWM::loop() {
  ledcWrite(channel, (uint32_t)((maxDutyCycle/100.0)*val));
  DATA_OUT[this->id] = this->val;
}

void GSK_IO_PWM::setVal(nlohmann::json val) {
  this->val = val.get<float>();
}
