class umk_1774369913335 extends umk_model {
  Icon() {
    return {
      html:  "<center style='font-size: 12px;'><i class='fab fa-usb'></i><br/>" + this.Parameters.port.Value[0][0] + "<br/> DI: " + this.Parameters.pin.Value[0][0] + "</center>",
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
    return "<center><i class='fab fa-usb'></i><br/> " + this.Parameters.port.Value[0][0] + "<br/> DI: " + this.Parameters.pin.Value[0][0] + "</center>";
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
            "en-us": "Digital Port/pin",
            "es-mx": "Puerto/pin Digital"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            0: {
              "en-us": "0",
              "es-mx": "0"
            },
            1: {
              "en-us": "1",
              "es-mx": "1"
            },
            2: {
              "en-us": "2",
              "es-mx": "2"
            }
          },
          "Value": [
            [1]
          ]
        }
      },
      isSerial: true, //shows that this block is associated with serial communication (COM port)
      TerminalsOut: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      }
    }, obj));
  }
}