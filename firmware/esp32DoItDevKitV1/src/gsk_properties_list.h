#ifndef GSK_PROPERTIES_LIST_H
#define GSK_PROPERTIES_LIST_H

#include "main.h"

class GSK_PROPERTIES_LIST {
  public:
    GSK_PROPERTIES_LIST();
    void addByRewrite(GSK_IO_PROPERTIES*);
    void loop();
    void setVal(int, nlohmann::json);
    void resetProperties();
    void getVal(int, void**);
    GSK_IO_PROPERTIES* get(int);
    int size();
    void reset();
  private:
    void add(GSK_IO_PROPERTIES*);
    int size_;
    GSK_IO_PROPERTIES** list;
};



#endif