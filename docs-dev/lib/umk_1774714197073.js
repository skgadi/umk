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
    const sendValue = this.inputs[0].get([0,0]);
    this.portDetails.sendValue = sendValue ? sendValue : 0;
  }
  invalidParams() {
    // if Frequency is greater than 40MHz or less than or equal to 0, return error
    if (this.Parameters.freq.Value[0][0] <= 0 || this.Parameters.freq.Value[0][0] > 40000000) {
      return "Frequency must be between 1 and 40,000,000 Hz.";
    }
    // There is a limit for resolution of PWM signal that can be generated based on the frequency. 
    // The formula is ResolutionBits = log2(80000000 / Frequency). If the resolution is less than 1 bit, return error.
    const resolutionBits = Math.floor(Math.log2(80000000 / this.Parameters.freq.Value[0][0]));
    if (resolutionBits < 1) {
      return "Frequency is too high for the available PWM resolution. Please decrease the frequency or resolution.";
    }
      // if Resolution is greater than 16 bits or less than or equal to 0, return error
    if (this.Parameters.res.Value[0][0] <= 0 || this.Parameters.res.Value[0][0] > 16) {
      return "Resolution must be between 1 and 16 bits.";
    }
  }
  Details() {
    return "<center><i class='fab fa-usb'></i><br/> "
    + this.Parameters.port.Value[0][0]
    + "<br/> PWM: " + this.Parameters.pin.Value[0][0]
    + "<br/> Frequency: " + this.Parameters.freq.Value[0][0]
    + "<br/> Resolution: " + this.Parameters.res.Value[0][0]
    + "</center>";
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
          "Options" : Object.fromEntries([2, 4, 5, 12, 13, 14, 15, 16, 17,18, 19, 21, 22, 23, 25, 26, 27, 32, 33]
            .map((ele)=>[String(ele), {
              "en-us": "GPIO"+ele,
              "es-mx": "GPIO"+ele
            }])),
          "Value": [
            ['13']
          ]
        },

        "ic": {
          "Name": {
            "en-us": "Initial conditions $(y_0)$",
            "es-mx": "Condiciones iniciales $(y_0)$"
          },
          "Dimension": "Scalar",
          "Type": "Integer",
          "Value": [
            [0]
          ]
        },

        "freq": {
          "Name": {
            "en-us": "PWM frequency",
            "es-mx": "Frecuencia PWM"
          },
          "Dimension": "Scalar",
          "Type": "Integer",
          "Value": [
            [1000]
          ]
        },

        "res": {
          "Name": {
            "en-us": "PWM resolution",
            "es-mx": "Resolución PWM"
          },
          "Dimension": "Scalar",
          "Type": "Integer",
          "Value": [
            [16]
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