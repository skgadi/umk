#ifndef GSK_IO_ENCODER_H
#define GSK_IO_ENCODER_H

#include "main.h"
#include <ESP32Encoder.h>

class GSK_IO_ENCODER:GSK_IO_PROPERTIES {
  public:
    ESP32Encoder* encoder;
    GSK_IO_ENCODER(int, int*);
    void reset();
    void loop();
    void setVal(nlohmann::json);
};


#endif