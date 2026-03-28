#ifndef GSK_IO_DIGITAL_OUT_H
#define GSK_IO_DIGITAL_OUT_H

#include "main.h"


class GSK_IO_DIGITAL_OUT:GSK_IO_PROPERTIES {
  bool val;
  public:
    GSK_IO_DIGITAL_OUT(int, int*, bool); // Id, pin, initial value
    void reset();
    void loop();
    void setVal(nlohmann::json);
};







#endif