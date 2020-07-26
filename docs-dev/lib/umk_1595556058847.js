class umk_1595556058847 extends umk_model {
  Icon() {
    return {
      //html: blockUtils.makeIcon(this.id)+'<button onClick="popup.open(event,\'chart\')" class="pointer"><i class="far fa-window-restore fa-fw"></i></button><button onClick="popup.open(event,\'chart\')" class="pointer"><i class="fas fa-external-link-alt fa-fw"></i></button>',
      html: '<div class="sink-btns"><button onClick="popup.open(event,\'robot-6dof\',false)" style="padding:0;"><i class="far fa-window-restore fa-fw"></i></button><button onClick="popup.open(event,\'robot-6dof\')" class="pointer" style="padding:0;"><i class="fas fa-external-link-alt fa-fw"></i></button></div>',
      //html: '<iframe style="width:100%; height: 100%" src="datetime.html"></iframe>',
      inLabels: ["1","2","3","4","5","6"],//["$\\theta_1$","$\\theta_2$","$\\theta_3$","$\\theta_4$","$\\theta_5$","$\\theta_6$"],
      outLabels: null,
      splStyle: null
    };
  }
  Details() {
    return "$$\\begin{matrix}\\theta_1 & \\in & [-180,180]\\\\ \\theta_2 & \\in & [-63,110]\\\\ \\theta_3 & \\in & [-235,55]\\\\ \\theta_4 & \\in & [-200,200]\\\\ \\theta_5 & \\in & [-115,115]\\\\ \\theta_6 & \\in & [-400,400]\\end{matrix}$$"
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "limitData": {
          "Name": {
            "en-us": "Limit data points",
            "es-mx": "Limitar puntos de datos"
          },
          "Dimension": "Scalar",
          "Type": "Real",
          "Value": [
            [1000]
          ]
        }
      },
      isPopup: true, //shows that it generates a popup window 
      isOut: true, //shows that this is a output
      TerminalsIn: {
        min: 6,
        max: 6,
        value: 6,
        editable: false
      }
    }, obj));
  }
}