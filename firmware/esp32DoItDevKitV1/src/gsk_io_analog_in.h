#ifndef GSK_IO_ANALOG_IN_H
#define GSK_IO_ANALOG_IN_H

#include "main.h"

class GSK_IO_ANALOG_IN:GSK_IO_PROPERTIES {
  public:
    GSK_IO_ANALOG_IN(int, int*);
    void reset();
    void loop();
    void setVal(nlohmann::json);
};

#endif