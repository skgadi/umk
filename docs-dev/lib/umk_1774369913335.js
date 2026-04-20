class umk_1774369913335 extends umk_model {
  Icon() {
    return {
      html:
        "<center style='font-size: 12px;'><i class='fab fa-usb'></i><br/>" +
        this.Parameters.port.Value[0][0] +
        "<br/> DI: " +
        this.Parameters.pin.Value[0][0] +
        "</center>",
      inLabels: null,
      outLabels: null,
      splStyle: "",
    };
  }
  Evaluate() {
    this.outputs[0] = math.matrix(this.portDetails.recValue ? [[1]] : [[0]]);
  }
  Details() {
    return (
      "<center><i class='fab fa-usb'></i><br/> " +
      this.Parameters.port.Value[0][0] +
      "<br/> DI: " +
      this.Parameters.pin.Value[0][0] +
      "</center>" +
      `
    <div>
    This block reads the value from the specified digital input pin of the selected port. The output will be 1 if the input signal is HIGH (true) and 0 if it is LOW (false).
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
                  2, 4, 5, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27,
                  32, 33, 34, 35, 36, 39,
                ].map((ele) => [
                  String(ele),
                  {
                    "en-us": "GPIO" + ele,
                    "es-mx": "GPIO" + ele,
                  },
                ]),
              ),
              Value: [["2"]],
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
