
#include "main.h"

GSK_PROPERTIES_LIST::GSK_PROPERTIES_LIST() {
  size_ = 0;
  list = new GSK_IO_PROPERTIES*[0];
}

GSK_IO_PROPERTIES* GSK_PROPERTIES_LIST::get(int i) {
  return list[i];
}

int GSK_PROPERTIES_LIST::size() {
  return size_;
}

void GSK_PROPERTIES_LIST::add(GSK_IO_PROPERTIES* gsk_io_properties) {
  size_++;
  GSK_IO_PROPERTIES** list_ = new GSK_IO_PROPERTIES*[size_];
  for (int i = 0; i < size_ - 1; i++) {
    list_[i] = list[i];
  }
  list_[size_ - 1] = gsk_io_properties;
  delete[] list;
  list = list_;
}


void GSK_PROPERTIES_LIST::addByRewrite(GSK_IO_PROPERTIES* gsk_io_properties) {
  for (int i = 0; i < size_; i++) {
    if (list[i]->id == gsk_io_properties->id) {
      list[i] = gsk_io_properties;
      return;
    }
  }
  add(gsk_io_properties);
}

void GSK_PROPERTIES_LIST::loop() {
  for (int i = 0; i < size_; i++) {
    list[i]->loop();
  }
}

void GSK_PROPERTIES_LIST::setVal(int id, nlohmann::json val) {
  for (int i = 0; i < size_; i++) {
    if (list[i]->id == id) {
      list[i]->setVal(val);
    }
  }
}

void GSK_PROPERTIES_LIST::resetProperties() {
  for (int i = 0; i < size_; i++) {
    list[i]->reset();
  }
}

void GSK_PROPERTIES_LIST::reset() {
  delete[] list;
  size_ = 0;
  list = new GSK_IO_PROPERTIES*[0];
}
