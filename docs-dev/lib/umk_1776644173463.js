class umk_1776644173463 extends umk_model {
  Icon() {
    return {
      html: this.localGetIconText(),
      inLabels: null,
      outLabels: null,
      splStyle: "",
    };
  }

  localGetIconText() {
    if (this.Parameters.triggerToStopOrContinue.Value[0][0] === "stop") {
      return "<div style='font-size: 2em;'>🛑</div>";
    }
    return "<div style='font-size: 2em;'>▶️</div>";
  }

  Evaluate(t, k) {
    const input = math.matrix(this.inputs[0]).get([0, 0]);
    const triggered = this.localIsTriggered(input);
    if (this.Parameters.triggerToStopOrContinue.Value[0][0] === "stop") {
      if (triggered) {
        throw new Error(
          `Simulation stopped because input ${input} satisfies the trigger condition at time ${this.localGetNumberToString(t)} and iteration ${k}.`,
        );
      }
    } else {
      if (!triggered) {
        throw new Error(
          `Simulation stopped because input ${input} does not satisfy the trigger condition at time ${this.localGetNumberToString(t)} and iteration ${k}.`,
        );
      }
    }
  }
  localGetNumberToString(num) {
    return math.round(num, 5).toString();
  }
  localIsTriggered(input) {
    const triggerMin = this.Parameters.triggerMinValue.Value.get([0, 0]);
    const triggerMax = this.Parameters.triggerMaxValue.Value.get([0, 0]);
    return input >= triggerMin && input <= triggerMax;
  }

  Details() {
    let out;
    try {
      if (!this.invalidParams()) {
        out = `${this.Parameters.triggerMinValue.Value[0][0]} \\leq u(t) \\leq ${this.Parameters.triggerMaxValue.Value[0][0]}`;
      }
      out = `
      <div>
      The simulation will ${this.Parameters.triggerToStopOrContinue.Value[0][0]} when the input signal $u(t)$ satisfies the condition:
      <br/>
      <br/>
      ${TeX.removeAvoidedItems(TeX.prepDisp(out))}
      </div>
      `;
    } catch (e) {
      console.log(e);
    }
    return out;
  }
  invalidParams() {
    return (
      this.Parameters.triggerMinValue.Value[0][0] >
      this.Parameters.triggerMaxValue.Value[0][0]
    );
  }
  constructor(obj) {
    super(
      Object.assign(
        {
          Parameters: {
            triggerToStopOrContinue: {
              Name: {
                "en-us": "Trigger action",
                "es-mx": "Acción del disparador",
              },
              Dimension: "Scalar",
              Type: "Options",
              Options: {
                stop: {
                  "en-us": "Stop",
                  "es-mx": "Detener",
                },
                continue: {
                  "en-us": "Continue",
                  "es-mx": "Continuar",
                },
              },
              Value: [["stop"]],
            },
            triggerMinValue: {
              Name: {
                "en-us": "Trigger minimum value",
                "es-mx": "Valor mínimo del disparador",
              },
              Dimension: "Scalar",
              Type: "Complex",
              Value: [[-Infinity]],
            },
            triggerMaxValue: {
              Name: {
                "en-us": "Trigger maximum value",
                "es-mx": "Valor máximo del disparador",
              },
              Dimension: "Scalar",
              Type: "Complex",
              Value: [[0]],
            },
          },
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
