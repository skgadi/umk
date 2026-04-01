class umk_1774706876440 extends umk_model {
  Icon() {
    return {
      html:  "<center style='font-size: 12px;'><i class='fab fa-usb'></i><br/>" + this.Parameters.port.Value[0][0] + "<br/> DO: " + this.Parameters.pin.Value[0][0] + "</center>",
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.portDetails.sendValue = this.inputs[0].get([0,0]) ? true : false;
  }
  Details() {
    return "<center><i class='fab fa-usb'></i><br/> " + this.Parameters.port.Value[0][0] + "<br/> DO: " + this.Parameters.pin.Value[0][0] + "</center>";
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
          "Options" : Object.fromEntries([2, 4, 5, 12, 13, 14, 15, 16, 17,18, 19, 21, 22, 23, 25, 26, 27, 32, 33]
            .map((ele)=>[String(ele), {
              "en-us": "GPIO"+ele,
              "es-mx": "GPIO"+ele
            }])),
          "Value": [
            ['4']
          ]
        },

        "ic": {
          "Name": {
            "en-us": "Set $(y_0) = \\texttt{true}$",
            "es-mx": "Establecer $(y_0) = \\texttt{true}$"
          },
          "Dimension": "Scalar",
          "Type": "Checkbox",
          "Value": [
            [false]
          ]
        },

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