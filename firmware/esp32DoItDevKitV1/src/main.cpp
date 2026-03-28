#include "main.h"



nlohmann::json DATA_OUT;
nlohmann::json DATA_IN;

GSK_DA_INTERFACE daInterface;




void setup() {
  xTaskCreate( 
    backgroundTask,       /* Task function. */
    "backgroundTask",     /* String with name of task. */
    10000,             /* Stack size in words. */
    NULL,              /* Parameter passed as input of the task */
    2,//configMAX_PRIORITIES -1,                 /* Priority of the task. */
    NULL);             /* Task handle. */

  Serial.begin(115200);

  //delay(10000);
}

void loop () {
  if (Serial.available()) {
    try {
      std::vector<std::uint8_t> cborArray = {};
      while (Serial.available()) {
        //cborArray.insert(cborArray.begin(), Serial.read());
        cborArray.push_back(Serial.read());
      }
      DATA_IN = nlohmann::json::from_cbor(cborArray);
      daInterface.processInData(DATA_IN);
    } catch (const std::exception& e) {
      //Serial.println(e.what());
      Serial.write(0xf6);
    }
  }
}


void backgroundTask(void * parameter) {
  while (1) {
    
    //Serial.print("background on core: ");
    //Serial.println(xPortGetCoreID());
    daInterface.processLoop();
    delay(1);
  }
}