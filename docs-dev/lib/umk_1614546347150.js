class umk_1614546347150 extends umk_model {
  Icon() {
    return {
      //html: blockUtils.makeIcon(this.id)+'<button onClick="popup.open(event,\'chart\')" class="pointer"><i class="far fa-window-restore fa-fw"></i></button><button onClick="popup.open(event,\'chart\')" class="pointer"><i class="fas fa-external-link-alt fa-fw"></i></button>',
      html: '<div class="sink-btns"><button onClick="popup.open(event,\'3d-line\',false,\'' + this.cid + '\')" style="padding:0;"><i class="far fa-window-restore fa-fw"></i></button><button onClick="popup.open(event,\'3d-line\',true,\'' + this.cid + '\')" class="pointer" style="padding:0;"><i class="fas fa-external-link-alt fa-fw"></i></button></div>',
      //html: '<iframe style="width:100%; height: 100%" src="datetime.html"></iframe>',
      inLabels: ["x", "y", "z", "c"], //["$\\theta_1$","$\\theta_2$","$\\theta_3$","$\\theta_4$","$\\theta_5$","$\\theta_6$"],
      outLabels: null,
      splStyle: null
    };
  }
  Details() {
    return GSKGenFuncs.makeSVG("<path stroke-width=\'1\' d=\'M50,10L50,50,90,70,50,90,10,70,50,50M10,70L10,30,50,10,90,30,90,70M20,75L60,55,60,15M30,80L70,60,70,20M40,85L80,65,80,25,M10,40L50,20,90,40M10,50L50,30,90,50M10,60L50,40,90,60M20,25L20,65,60,85M30,20L30,60,70,80M40,15L40,55,80,75 \'\/><path d=\'M50,50Q95,75,50,70T50,30T70,50\'\/><g stroke-width=\'1\' font-size=\'1em\'><text x=\'70\' y=\'90\'>x<\/text><text x=\'18\' y=\'88\'>y<\/text><text x=\'0.5\' y=\'52\'>z<\/text><\/g>", "#00000000", "var(--col-text-0)", "#00000000", "monospace");
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
        "width": {
          "Name": {
            "en-us": "Line thickness",
            "es-mx": "Grosor de la línea"
          },
          "Dimension": "Scalar",
          "Type": "Real",
          "Value": [
            [5]
          ]
        },
        "colorscale": {
          "Name": {
            "en-us": "Type of color scale",
            "es-mx": "Tipo de escala de colores"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            Greys: {
              "en-us": "Greys",
              "es-mx": "Grises"
            },
            YlGnBu: {
              "en-us": "Yellow, Green and Blue",
              "es-mx": "Amarilla, verde y azul"
            },
            Greens: {
              "en-us": "Greens",
              "es-mx": "Verdes"
            },
            YlOrRd: {
              "en-us": "Yellow, Orange and Red",
              "es-mx": "Amarilla, naranja y roja"
            },
            Bluered: {
              "en-us": "Blue and Red",
              "es-mx": "Azul y roja"
            },
            RdBu: {
              "en-us": "Red to Blue",
              "es-mx": "Roja a azul"
            },
            Reds: {
              "en-us": "Reds",
              "es-mx": "Rojas"
            },
            Blues: {
              "en-us": "Blues",
              "es-mx": "Azules"
            },
            Picnic: {
              "en-us": "Picnic",
              "es-mx": "Picnic"
            },
            Rainbow: {
              "en-us": "Rainbow",
              "es-mx": "Arcoíris"
            },
            Portland: {
              "en-us": "Portland",
              "es-mx": "Portland"
            },
            Jet: {
              "en-us": "Jet",
              "es-mx": "Jet"
            },
            Hot: {
              "en-us": "Hot",
              "es-mx": "Caliente"
            },
            Blackbody: {
              "en-us": "Blackbody",
              "es-mx": "Cuerpo negro"
            },
            Earth: {
              "en-us": "Earth",
              "es-mx": "Tierra"
            },
            Electric: {
              "en-us": "Electric",
              "es-mx": "Eléctrica"
            },
            Viridis: {
              "en-us": "Viridis",
              "es-mx": "Viridis"
            },
            Cividis: {
              "en-us": "Cividis",
              "es-mx": "Cividis"
            }
          },
          "Value": [
            ["Jet"]
          ]
        },
        "reversescale": {
          "Name": {
            "en-us": "Invert the color scaling",
            "es-mx": "Invertir la escala de color"
          },
          "Dimension": "Scalar",
          "Type": "Checkbox",
          "Value": [
            [false]
          ]
        },
        "mode": {
          "Name": {
            "en-us": "Type of chart",
            "es-mx": "Tipo de gráfico"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            "lines": {
              "en-us": "Line",
              "es-mx": "Línea"
            },
            "markers": {
              "en-us": "Markers",
              "es-mx": "Marcadores"
            },
            "lines+markers": {
              "en-us": "Line and markers",
              "es-mx": "Línea y marcadores"
            }
          },
          "Value": [
            ["lines"]
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
            [10000]
          ]
        }
      },
      isPopup: true, //shows that it generates a popup window 
      isOut: true, //shows that this is a output
      TerminalsIn: {
        min: 4,
        max: 4,
        value: 4,
        editable: false
      }
    }, obj));
  }
}