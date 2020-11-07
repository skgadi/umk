class umk_1586738484106 extends umk_model {
  Icon() {
    return {
      html: '<div class="sink-btns"><button onClick="popup.open(event,\'scope\',false,\''+this.cid+'\')" style="padding:0;"><i class="far fa-window-restore fa-fw"></i></button><button onClick="popup.open(event,\'scope\',true,\''+this.cid+'\')" class="pointer" style="padding:0;"><i class="fas fa-external-link-alt fa-fw"></i></button></div>',
      inLabels: null,
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
        "aCharts": {
          "Name": {
            "en-us": "Animate the charts",
            "es-mx": "Animar los gráficos"
          },
          "Dimension": "Scalar",
          "Type": "Checkbox",
          "Value": [
            [true]
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
      TerminalsIn: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      },
      isPopup: true, //shows that it generates a popup window 
      isOut: true //shows that this is a output
    }, obj));
  }
}