class umk_1594989068293 extends umk_model {
  Icon() {
    return {
      //html: blockUtils.makeIcon(this.id)+'<button onClick="popup.open(event,\'chart\')" class="pointer"><i class="far fa-window-restore fa-fw"></i></button><button onClick="popup.open(event,\'chart\')" class="pointer"><i class="fas fa-external-link-alt fa-fw"></i></button>',
      html: '<div class="sink-btns"><button onClick="popup.open(event,\'scope-xy\',false)" style="padding:0;"><i class="far fa-window-restore fa-fw"></i></button><button onClick="popup.open(event,\'scope-xy\')" class="pointer" style="padding:0;"><i class="fas fa-external-link-alt fa-fw"></i></button></div>',
      //html: '<iframe style="width:100%; height: 100%" src="datetime.html"></iframe>',
      inLabels: ['x','y'],
      outLabels: null,
      splStyle: null
    };
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "showIm": {
          "Name": {
            "en-us": "Show imaginary values",
            "es-mx": "Mostrar valores imaginarios"
          },
          "Dimension": "Scalar",
          "Type": "Checkbox",
          "Value": [
            [false]
          ]
        },
        "xLogScale": {
          "Name": {
            "en-us": "Logarithmic scale for horizontal axis",
            "es-mx": "Escala logarítmica para eje horizontal"
          },
          "Dimension": "Scalar",
          "Type": "Checkbox",
          "Value": [
            [false]
          ]
        },
        "yLogScale": {
          "Name": {
            "en-us": "Logarithmic scale for vertical axis",
            "es-mx": "Escala logarítmica para eje vertical"
          },
          "Dimension": "Scalar",
          "Type": "Checkbox",
          "Value": [
            [false]
          ]
        },
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
        min: 2,
        max: 2,
        value: 2,
        editable: false
      }
    }, obj));
  }
}