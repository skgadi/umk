#ifndef GSK_DA_INTERFACE_H
#define GSK_DA_INTERFACE_H

#include "main.h"
class GSK_PROPERTIES_LIST;

class GSK_DA_INTERFACE {
  GSK_PROPERTIES_LIST* mainPropertiesList;
  public:
    GSK_DA_INTERFACE();
    void processInData(nlohmann::json);
    void processLoop();
};



#endif