class umk_1774706876440 extends umk_model {
  Icon() {
    return {
      html:
        "<center style='font-size: 12px;'><i class='fab fa-usb'></i><br/>" +
        this.Parameters.port.Value[0][0] +
        "<br/> DO: " +
        this.Parameters.pin.Value[0][0] +
        "</center>",
      inLabels: null,
      outLabels: null,
      splStyle: "",
    };
  }
  Evaluate() {
    //console.log(this.inputs[0]);
    this.portDetails.sendValue = this.inputs[0].get([0, 0]) ? true : false;
  }
  End() {
    if (this.Parameters.isCustomValueForEnd.Value[0][0]) {
      const customValue = this.Parameters.customValueForEnd.Value[0][0];
      this.portDetails.sendValue = customValue ? true : false;
    }
  }
  Details() {
    return (
      "<center><i class='fab fa-usb'></i><br/> " +
      this.Parameters.port.Value[0][0] +
      "<br/> DO: " +
      this.Parameters.pin.Value[0][0] +
      "</center>" +
      `
      <div>
      This block sends a digital output signal to the specified pin of the selected port. The output will be 1 (true) if the input signal is non-zero and 0 (false) if the input signal is zero. You can also specify a custom value to be sent when the simulation ends.
      </div>
      `
    );
  }
  constructor(obj) {
    super(
      Object.assign(
        {
          Parameters: {
            port: {
              Name: {
                "en-us": "Port name",
                "es-mx": "Nombre del puerto",
              },
              Dimension: "Scalar",
              Type: "Text",
              Value: [["Port 1"]],
            },

            pin: {
              Name: {
                "en-us": "Digital Port/pin",
                "es-mx": "Puerto/pin Digital",
              },
              Dimension: "Scalar",
              Type: "Options",
              Options: Object.fromEntries(
                [
                  2, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26,
                  27, 32, 33,
                ].map((ele) => [
                  String(ele),
                  {
                    "en-us": "GPIO" + ele,
                    "es-mx": "GPIO" + ele,
                  },
                ]),
              ),
              Value: [["4"]],
            },

            ic: {
              Name: {
                "en-us": "Set $(y_0) = \\texttt{true}$",
                "es-mx": "Establecer $(y_0) = \\texttt{true}$",
              },
              Dimension: "Scalar",
              Type: "Checkbox",
              Value: [[false]],
            },

            isCustomValueForEnd: {
              Name: {
                "en-us": "Use Custom end condition",
                "es-mx": "Usar Valor personalizado para condición de fin",
              },
              Dimension: "Scalar",
              Type: "Checkbox",
              Value: [[true]],
            },

            customValueForEnd: {
              Name: {
                "en-us": "Set final condition value to $(\\texttt{true})$",
                "es-mx":
                  "Establecer el valor de la condición final a $(\\texttt{true})$",
              },
              Dimension: "Scalar",
              Type: "Checkbox",
              Value: [[false]],
            },
          },
          isSerial: true, //shows that this block is associated with serial communication (COM port)
          TerminalsIn: {
            min: 1,
            max: 1,
            value: 1,
            editable: false,
          },
        },
        obj,
      ),
    );
  }
}
