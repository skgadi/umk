class umk_model {
  constructor(obj={}) {
    //Block id
    this.id = this.constructor.name;
    // the parameters which user can change
    this.Parameters = {};
    // During simulation inputs and outputs are stored here
    this.inputs = [];
    this.outputs = [];
    //Not yet implimented
    this.Colors = {};
    // Terminals details
    this.TerminalsIn = {
      min: 0,
      max: 0,
      value: 0,
      editable: false
    };
    this.fInEO = false, //Is first in the execution order --- FirstInExecutionOrder
    this.isPopup = false, // shows that this block generates a popup window
    this.isOut = false; //shows that this is a output
    this.showInpOnHtml = false; //update screen while simulating 
    this.Icon_Temp_Html = null; //This is used internal to the Icon function
    this.temp_exec = {}; //This is temporary item used by execute command of simulation
    this.TerminalsOut = {
      min: 0,
      max: 0,
      value: 0,
      editable: false
    };
    /* pull all values from the input object */
    for (let prop in obj) {
      if (typeof obj[prop] !== 'function') {
        this[prop] = JSON.parse2(JSON.stringify2(obj[prop]));
      }
    }
    /* in case of output .... make only one input Outputs cannot have more than one input*/
    if(this.isOut) {
      this.TerminalsIn = {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      };
      this.TerminalsOut = {
        min: 0,
        max: 0,
        value: 0,
        editable: false
      }; 
    }
  }
  //This is applied when the model (cell) is created
  Const() {}
  //This is applied when the model (cell) is destroyed
  Dest() {}
  //This is applied when simulation is initiated
  Init() {}
  //This is applied when simulation is ended
  End() {}
  //Not yet implemented
  RunTimeExec() {}
  //This is execuated during Simulation, t is simulation time
  Evaluate(t) {}
  //Shows this information as a funcionality when the block is selected.
  Details() {
    return "";
  }
  //This sets the icon details.
  Icon () {
    return {
      html: 'Not configured',
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  //Checks for invalid parameters
  invalidParams() {
    return false;
  };
}