class umk_1774714206020 extends umk_model {
  Icon() {
    return {
      html:  "<center style='font-size: 12px;'><i class='fab fa-usb'></i><br/>" + this.Parameters.port.Value[0][0] + "<br/>" + this.Parameters.pin_A.Value[0][0] + " , " + this.Parameters.pin_B.Value[0][0] + "</center>",
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //console.log(this.portDetails.recValue);
    this.outputs[0] = math.matrix(this.portDetails.recValue? [[this.portDetails.recValue]] : [[0]]);
  }
  Details() {
    return "<center><i class='fab fa-usb'></i><br/> " + this.Parameters.port.Value[0][0] + "<br/> Encoder: " + this.Parameters.pin_A.Value[0][0] + " , " + this.Parameters.pin_B.Value[0][0] + "</center>";
  }
  invalidParams() {
    if (this.Parameters.pin_A.Value[0][0] === this.Parameters.pin_B.Value[0][0]) {
      return "Encoder pin A and B cannot be the same.";
    }
    return false;
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

        "pin_A": {
          "Name": {
            "en-us": "Encoder Port/pin A",
            "es-mx": "Puerto/pin A de Encoder"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options" : Object.fromEntries([2, 4, 5, 13, 14, 15, 16, 17,18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39]
            .map((ele)=>[String(ele), {
              "en-us": "GPIO"+ele,
              "es-mx": "GPIO"+ele
            }])),
          "Value": [
            ['14']
          ]
        },
        "pin_B": {
          "Name": {
            "en-us": "Encoder Port/pin B",
            "es-mx": "Puerto/pin B de Encoder"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options" : Object.fromEntries([2, 4, 5, 13, 14, 15, 16, 17,18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39]
            .map((ele)=>[String(ele), {
              "en-us": "GPIO"+ele,
              "es-mx": "GPIO"+ele
            }])),
          "Value": [
            ['15']
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