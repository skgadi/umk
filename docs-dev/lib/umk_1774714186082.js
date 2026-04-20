class umk_1774714186082 extends umk_model {
  Icon() {
    return {
      html:
        "<center style='font-size: 12px;'><i class='fab fa-usb'></i><br/>" +
        this.Parameters.port.Value[0][0] +
        "<br/> AI: " +
        this.Parameters.pin.Value[0][0] +
        "</center>",
      inLabels: null,
      outLabels: null,
      splStyle: "",
    };
  }
  Evaluate() {
    this.outputs[0] = math.matrix(
      this.portDetails.recValue ? [[this.portDetails.recValue]] : [[0]],
    );
  }
  Details() {
    return (
      "<center><i class='fab fa-usb'></i><br/> " +
      this.Parameters.port.Value[0][0] +
      "<br/> AI: " +
      this.Parameters.pin.Value[0][0] +
      "</center>" +
      `
    <div>
    This block reads the value from the specified analog input pin of the selected port.
    The output $$y(t) = \\frac{V_{in}(t) \\cdot 4095}{3.3}$$ is a scaled version of the input voltage $V_{in}(t)$, where 4095 is the maximum value for a 12-bit ADC and 3.3V is the reference voltage. Therefore, if the input voltage is 0V, the output will be 0, and if the input voltage is 3.3V or higher, the output will be 4095. For input voltages between 0V and 3.3V, the output will be a corresponding value between 0 and 4095.

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
                "en-us": "Analog Port/pin",
                "es-mx": "Puerto/pin Analógico",
              },
              Dimension: "Scalar",
              Type: "Options",
              Options: Object.fromEntries(
                [2, 4, 13, 14, 15, 25, 26, 27, 32, 33, 34, 35, 36, 39].map(
                  (ele) => [
                    String(ele),
                    {
                      "en-us": "GPIO" + ele,
                      "es-mx": "GPIO" + ele,
                    },
                  ],
                ),
              ),
              Value: [["25"]],
            },
          },
          isSerial: true, //shows that this block is associated with serial communication (COM port)
          TerminalsOut: {
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
