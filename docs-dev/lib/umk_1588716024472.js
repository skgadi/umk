class umk_1588716024472 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("\\int"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Init() {
    this.genCompParams();
    this.CompParams.isFr = [0];
    //this.ExecParams.isInFr = 0; //0-> not sure
    //this.CompParams.mem.push(math.zeros(this.Parameters.ic.Value._data.length, this.Parameters.ic.Value._data[0].length));
  }
  beforeEC(t, k, simSettings) {
    //this.outputs[0] = this.CompParams.out[0];
    this.CompParams.addInput = true;
    this.getInputIfRequired();
  }
  getInputIfRequired() {
    if (this.CompParams.addInput){
      if (!!this.inputs[0]) {
        this.CompParams.mem.unshift(this.inputs[0]);
        this.CompParams.addInput = false;
        //console.log(JSON.stringify(this.CompParams.mem));
      }
    }
  }
  genCompParams() {
    this.CompParams.out = []; //Output of int
    this.CompParams.pt = [0]; // previous time
    this.CompParams.mem = []; //Memory for integration
    this.CompParams.addInput = true;
  }
  Evaluate(t, k, simSettings) {
    this.getInputIfRequired();
    let pData = {
      mem: this.CompParams.mem,
      it: ((this.Parameters.it.Value[0][0] === "default") ? simSettings.it : this.Parameters.it.Value[0][0]),
      iv: this.Parameters.ic.Value,
      t: t,
      //inp: this.inputs[0], // Inputs are handled here in this page
      out: this.CompParams.out,
      pt: this.CompParams.pt,
      isFr: this.CompParams.isFr
    };
    blockUtils.integrate(pData);
    this.outputs[0] = pData.out[0];
        /* if (!this.ExecParams.isInFr) {
       this.CompParams.mem.push(this.inputs[0]);
     }*/
    //console.log(JSON.stringify(this.CompParams.mem));
    /*if (!!this.inputs[0]) {
      this.CompParams.mem.push(this.inputs[0]);
    }*/
  }
  afterEC(t, k, simSettings) {
    this.getInputIfRequired();
  }
  Details() {
    return TeX.prepDisp("y(t)=\\int_{0}^{t}u(t)\\mathrm{d}t+y(0)");
  }
  constructor(obj) {
    let tempIntTypes = {
      "default": {
        "en-us": "Default",
        "es-mx": "Defecto"
      }
    };
    Object.keys(intTypes).forEach(function (key) {
      tempIntTypes[key] = intTypes[key].desc;
    });
    super(Object.assign({
      fInEO: true,
      Parameters: {
        "ic": {
          "Name": {
            "en-us": "Initial conditions $(y_0)$",
            "es-mx": "Condiciones iniciales $(y_0)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0]
          ]
        },
        "it": {
          "Name": {
            "en-us": "Integration type",
            "es-mx": "Tipo de integración"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": tempIntTypes,
          "Value": [
            ["default"]
          ]
        }
      },
      TerminalsIn: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      },
      TerminalsOut: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      }
    }, obj));
  }
}