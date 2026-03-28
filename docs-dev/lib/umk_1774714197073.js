class umk_1774714197073 extends umk_model {
  Icon() {
    return {
      html:  "<center style='font-size: 12px;'><i class='fab fa-usb'></i><br/>" + this.Parameters.port.Value[0][0] + "<br/> PWM: " + this.Parameters.pin.Value[0][0] + "</center>",
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //console.log(this.Parameters.constant.Value);
    this.outputs[0] = 1;
  }
  Details() {
    return "<center><i class='fab fa-usb'></i><br/> " + this.Parameters.port.Value[0][0] + "<br/> PWM: " + this.Parameters.pin.Value[0][0] + "</center>";
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "port": {
          "Name": {
            "en-us": "Port name",
            "es-mx": "Nombre del puerto"
          },
          "Dimension": "Scalar",
          "Type": "Text",
          "Value": [
            ['Port 1']
          ]
        },

        "pin": {
          "Name": {
            "en-us": "PWM Port/pin",
            "es-mx": "Puerto/pin PWM"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options" : Object.fromEntries(Array.from({length: 40}, (_, i) => [
            String(i),
            {
              "en-us": "GPIO" + String(i),
              "es-mx": "GPIO" + String(i)
            }
          ])),
          "Value": [
            ['1']
          ]
        }
      },
      isSerial: true, //shows that this block is associated with serial communication (COM port)
      TerminalsIn: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      }
    }, obj));
  }
}