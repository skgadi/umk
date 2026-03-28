#include "main.h"


GSK_DA_INTERFACE::GSK_DA_INTERFACE() {
  mainPropertiesList = new GSK_PROPERTIES_LIST();
}



void GSK_DA_INTERFACE::processInData(nlohmann::json json) {
  for (int i = 0; i < json.size(); i++) {
    try {
      nlohmann::json element = json[i];
      if (element.is_object()) {
        if (element["type"] == "DI") {
          int pins[1];
          pins[0] = element["pin"];
          GSK_IO_DIGITAL_IN* io = new GSK_IO_DIGITAL_IN(i, pins);
          mainPropertiesList->addByRewrite((GSK_IO_PROPERTIES*)io);
        }
        if (element["type"] == "DO") {
          int pins[1];
          pins[0] = element["pin"];
          GSK_IO_DIGITAL_OUT* io = new GSK_IO_DIGITAL_OUT(i, pins, element["initVal"]);
          mainPropertiesList->addByRewrite((GSK_IO_PROPERTIES*)io);
        }
        if (element["type"] == "AI") {
          int pins[1];
          pins[0] = element["pin"];
          GSK_IO_ANALOG_IN* io = new GSK_IO_ANALOG_IN(i, pins);
          mainPropertiesList->addByRewrite((GSK_IO_PROPERTIES*)io);
        }
        if (element["type"] == "PM") {
          int pins[1];
          pins[0] = element["pin"];
          GSK_IO_PWM* io = new GSK_IO_PWM(i, pins, element["initVal"], element["ch"], element["freq"], element["res"]);
          mainPropertiesList->addByRewrite((GSK_IO_PROPERTIES*)io);
        }
        if (element["type"] == "EN") {
          int pins[2];
          pins[0] = element["pins"][0];
          pins[1] = element["pins"][1];
          GSK_IO_ENCODER* io = new GSK_IO_ENCODER(i, pins);
          mainPropertiesList->addByRewrite((GSK_IO_PROPERTIES*)io);
        }
      } else {
        mainPropertiesList->setVal(i, element);
      }
    } catch (const std::exception& e) {
      Serial.write(0xf6);
    }
  }
  //Serial.println(DATA_OUT.dump(2).c_str());
  std::vector <std::uint8_t> outBinArray = nlohmann::json::to_cbor(DATA_OUT);
  Serial.write(outBinArray.data(), outBinArray.size());
}

void GSK_DA_INTERFACE::processLoop() {
  mainPropertiesList->loop();
}