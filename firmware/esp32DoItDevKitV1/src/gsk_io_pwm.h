#ifndef GSK_IO_PWM_H
#define GSK_IO_PWM_H

#include "main.h"


class GSK_IO_PWM:GSK_IO_PROPERTIES {
  float val;
  int channel, freq, res;
  uint32_t maxDutyCycle;
  public:
    GSK_IO_PWM(int, int*, float,  int, int, int); // Id, pin, initial value, channel, frequency, resolution
    void reset();
    void loop();
    void setVal(nlohmann::json);
};







#endif