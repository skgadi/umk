uyamak.lFManagerVue = new Vue({
  el: "#lFManager",
  data: {
    display: false,
    sFName: null,
    fInput: null,
    oFileInfo: {
      name: ""
    },
    reader: null,
    sOptions: { // Save file options
      m: true,
      v: true,
      s: true,
      g: true
    },
    oOptions: { //Open file options
      m: true,
      v: true,
      s: true,
      g: false
    },
    oAvail: { //Available options to open/import
      m: false,
      v: false,
      s: false,
      g: false
    },
    dDAtn: null,
    tempKBSus: null
  },
  mounted: function () {
    this.fInput = document.getElementById("file-input");
    this.fInput.onchange = (e) => {
      uyamak.lFManagerVue.$set(uyamak.lFManagerVue.$data, "oFileInfo", e.target.files[0]);
      uyamak.lFManagerVue.$set(uyamak.lFManagerVue.$data.fInput, "value", "");
    }
    this.reader = new FileReader();
    this.reader.onload = function (x) {
      try {
        uyamak.lFManagerVue.obtnAvail(x.target.result);
      } catch (e) {
        new Noty({
          text: GUIText[settings.lang].errCrpt,
          timeout: 5000,
          theme: "nest",
          type: 'error'
        }).show();
      }
    };
  },
  watch: {
    "display": function () {
      kbshort.suspend(this.display, function (evt) {
        if (evt.keyCode === 27) {
          uyamak.lFManagerVue.showGUI(false);
        }
      });
    },
    oFileInfo: {
      deep: true,
      handler: function () {
        this.oAvail = {
          m: null,
          v: null,
          s: null,
          g: null
        };
        if (this.oFileInfo.size > 1e7) {
          new Noty({
            text: GUIText[settings.lang].errFSize,
            timeout: 5000,
            theme: "nest",
            type: 'error'
          }).show();
          return false;
        }
        this.reader.readAsText(this.oFileInfo);
      }
    }
  },
  computed: {
    enSave: function () {
      if ((this.sOptions.m || this.sOptions.v || this.sOptions.s || this.sOptions.g) && !!this.sFName && GSKGenFuncs.isValidFileName(this.sFName.trim())) {
        return true;
      } else {
        return false;
      }
    },
    enOpen: function () {
      if ((this.oOptions.m && !!this.oAvail.m) || (this.oOptions.v && !!this.oAvail.v) || (this.oOptions.s && !!this.oAvail.s) || (this.oOptions.g && !!this.oAvail.g)) {
        //console.log('hey');
        return true;
      } else {
        return false;
      }
    },
    enIprt: function () {
      if ((this.oOptions.m && !!this.oAvail.m) || (this.oOptions.v && !!this.oAvail.v)) {
        return true;
      } else {
        return false;
      }
    },
    oFDesc: function () {
      if (!this.oFileInfo.name) {
        return '&nbsp;';
      } else {
        return this.oFileInfo.name + "; " + math.unit(this.oFileInfo.size + "b").format(4); //"$"+math.parse(this.oFileInfo.size + "b").toTex(4)+"$"
      }
    }
  },
  methods: {
    oprnOpen: function (isImport = false) {
      try {
        if (this.oOptions.m && !!this.oAvail.m) {
          //console.log(isImport);
          if (isImport) {
            uyamakCbManager.prepareAltAndCopy(this.oAvail.m, false);
            uyamakCbManager.bringModelToMain();
          } else {
            mainSystem.graph.getModel().clear();
            uyamakCbManager.inmportToGraph(this.oAvail.m, mainSystem.graph, false);
          }
        }
        if (this.oOptions.v && !!this.oAvail.v) {
          if (!isImport) {
            varManagerVue.variables = [];
          }
          let orginalVarLength = varManagerVue.variables.length;
          for (let i = 0; i < this.oAvail.v.length; i++) {
            let foundAt = -1;
            for (let j = 0; j < orginalVarLength; j++) {
              if (this.oAvail.v[i].name === varManagerVue.variables[j].name) {
                foundAt = j;
                break;
              }
            }
            if (foundAt < 0) {
              varManagerVue.variables.push(this.oAvail.v[i]);
            } else {
              varManagerVue.variables[foundAt] = this.oAvail.v[i];
            }
          }
          varManagerVue.clearAndparseAll();
        }
        if (this.oOptions.s && !!this.oAvail.s) {
          let keys = Object.keys(this.oAvail.s);
          for (let i = 0; i < keys.length; i++) {
            simVue.simSettings[keys[i]] = this.oAvail.s[keys[i]];
          }
        }
        if (this.oOptions.g && !!this.oAvail.g) {
          let keys = Object.keys(this.oAvail.g);
          for (let i = 0; i < keys.length; i++) {
            settings[keys[i]] = this.oAvail.g[keys[i]];
          }
        }
      } catch (e) {
        console.log(e);
      }
      this.showGUI(false);
    },
    sToFile: function () { //save to file
      let out = {};
      if (this.sOptions.m) {
        out.m = uyamak.cmprs.xmlText();
      }
      if (this.sOptions.v) {
        out.v = varManagerVue.variables;
      }
      if (this.sOptions.s) {
        out.s = simVue.simSettings;
      }
      if (this.sOptions.g) {
        out.g = settings;
      }
      if (!!Object.keys(out).length && GSKGenFuncs.isValidFileName(this.sFName.trim())) {
        GSKGenFuncs.download(this.sFName.trim() + ".umk", uyamak.cmprs.compressJSON(out), "application/uyamak;charset=utf-8");
      }
    },
    isValidFileName: function () {
      const rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
      const rg2 = /^\./; // cannot start with dot (.)
      const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
      return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
    },
    obtnAvail: function (codedText) {
      let obtainedJSON = uyamak.cmprs.decompressJSON(codedText);
      //console.log(obtainedJSON);
      this.oAvail.m = obtainedJSON.m;
      this.oAvail.v = obtainedJSON.v;
      this.oAvail.s = obtainedJSON.s;
      this.oAvail.g = obtainedJSON.g;
    },
    selectFile: function () {
      this.fInput.click();
    },
    dragOperation: function (evt) {
      this.dDAtn = evt.type;
      //console.log(this.dDAtn);
      if ((this.dDAtn === 'dragenter') || (this.dDAtn === 'dragover')) {
        document.getElementById("drop-area").style.display = "block";
        //suspend all keys except esc to cancel update
        kbshort.suspend(true, function (evt) {
          if (evt.keyCode === 27) {
            document.getElementById("drop-area").style.display = "none";
            kbshort.suspend(false);
          }
        });
      } else {
        document.getElementById("drop-area").style.display = "none";
      }
      GSKGenFuncs.preventDefaults(evt);
      //console.log(evt.dataTransfer.files[0]);
      if (this.dDAtn === "drop") {
        this.oFileInfo = evt.dataTransfer.files[0];
        this.showGUI(true);
      }
    },
    showGUI: function (show = true) {
      this.display = show;
      if (!this.sFName) {
        this.sFName = GUIText[settings.lang].myUmkModel;
      }
      /*//Selects input when focused.
      setTimeout(function () {
        document.getElementById("fMFName").select();
      }, 10);
      */
    },
  }
});
// save and load the uymak models
const uyamakFileManager = {
  fileName: null,
  xmlText: function (graph = mainSystem.graph) {
    let encoder = new mxCodec();
    return mxUtils.getXml(encoder.encode(graph.getModel()));
  },
  newModel: function () {
    if (confirm(GUIText[settings.lang].confirmLoss)) {
      mainSystem.graph.getModel().clear();
    }
  },
  download: function (filename, text) {
    let element = document.createElement('a');
    let blob = new Blob([text], {
      type: "application/uyamak;charset=utf-8"
    });
    let url = window.URL.createObjectURL(blob);

    element.style.display = 'none';
    element.href = url;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    window.URL.revokeObjectURL(url);
  },
  saveLocal: function (isVars = false) {
    this.fileName = prompt(GUIText[settings.lang].enterFileName, GUIText[settings.lang].myUmkModel);
    if (!!this.fileName) {
      let saveItem = {
        v: varManagerVue.variables
      }; // v for variables
      if (!isVars) {
        saveItem.s = simVue.simSettings; // s for simulation settings
        saveItem.m = this.xmlText(); // m for model
        /*let deflated16bit = this.deflated16bit(this.xmlText());
        let escapeZeroArray = this.escZero(deflated16bit);
        this.download(this.fileName + ".umk", this.ab2str(escapeZeroArray));*/
      }
      this.download(this.fileName + ".umk", this.compressJSON(saveItem));
    }
  },
  importFlag: false,
  openLocal: function (isImport = false) {
    this.importFlag = isImport;
    if (isImport || confirm(GUIText[settings.lang].confirmLoss)) {
      this.fileInp.click();
    }
  },
  fileInp: null,
  encoder: new mxCodec(),
  compressJSON: function (JSONIn) {
    let deflated16Bit = this.deflated16bit(JSON.stringify2(JSONIn));
    deflated16Bit = this.escZero(deflated16Bit);
    return this.ab2str(deflated16Bit);
  },
  decompressJSON: function (codedText) {
    let deflated16Bit = new Uint16Array(this.str2ab(codedText));
    deflated16Bit = this.escZero(deflated16Bit, false);
    let inflated8Bit = pako.inflate(deflated16Bit);
    let JSONText = this.ab2str(inflated8Bit);
    return JSON.parse2(JSONText);
  },
  compressModel: function (graph) {
    //let encoder = new mxCodec();
    let model = graph.getModel();
    let xmlCellArray = this.encoder.encode(model);
    let xmlString = mxUtils.getXml(xmlCellArray);
    //console.log(xmlString);
    let deflated16Bit = this.deflated16bit(xmlString);
    deflated16Bit = this.escZero(deflated16Bit);
    return this.ab2str(deflated16Bit);
  },
  decompressModel: function (codedText) {
    let deflated16Bit = new Uint16Array(this.str2ab(codedText));
    deflated16Bit = this.escZero(deflated16Bit, false);
    let inflated8Bit = pako.inflate(deflated16Bit);
    let xmlText = this.ab2str(inflated8Bit);
    let xml = mxUtils.parseXml(xmlText);
    return this.encoder.decode(xml.documentElement);
  },
  deflated16bit: function (text) {
    let deflated8Bit = pako.deflate(text);
    return new Uint16Array(deflated8Bit);
  },
  escZero: function (in16BitArray, enc = true) {
    return in16BitArray.map((ele) => {
      return ele + (enc ? 0x0C05 : -0x0C05);
    });
  },
  ab2str: function (buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  str2ab: function (str) {
    let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    let bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
};
(() => {
  uyamakFileManager.fileInp = document.createElement('input');
  uyamakFileManager.fileInp.type = 'file';
  uyamakFileManager.fileInp.onchange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function (x) {
      try {
        if (uyamakFileManager.importFlag) {
          uyamakCbManager.prepareAltAndCopy(x.target.result);
          uyamakCbManager.bringModelToMain();
        } else {
          uyamakCbManager.inmportToGraph(x.target.result, mainSystem.graph);
        }
      } catch (e) {
        new Noty({
          text: GUIText[settings.lang].errorGen,
          timeout: 5000,
          theme: "nest",
          type: 'error'
        }).show();
      }
    };
    reader.readAsText(file);
    //console.log(file);
    uyamakFileManager.fileInp.value = "";
  }
})();



/*


function compress(text) {
    var byteArray = new TextEncoder().encode(text);
    var cs = new CompressionStream('deflate'); // 'deflate' or 'gzip'
    var writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer();
}

function decompress(byteArray) {
    var cs = new DecompressionStream('deflate');
    var writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
        return new TextDecoder().decode(arrayBuffer);
    });
}

/*
var test = "http://www.ScriptCompress.com - Simple Packer/Minify/Compress JavaScript Minify, Fixify & Prettify 75 JS Obfuscators In 1 App 25 JS Compressors (Gzip, Bzip, LZMA, etc) PHP, HTML & JS Packers In 1 App PHP Source Code Packers Text Packer HTML Packer or v2 or v3 or LZW Twitter Compress or More Words DNA & Base64 Packer (freq tool) or v2 JS JavaScript Code Golfer Encode Between Quotes Decode Almost Anything Password Protect Scripts HTML Minifier v2 or Encoder or Escaper CSS Minifier or Compressor v2 SVG Image Shrinker HTML To: SVG or SVGZ (Gzipped) HTML To: PNG or v2 2015 JS Packer v2 v3 Embedded File Generator Extreme Packer or version 2 Our Blog DemoScene JS Packer Basic JS Packer or New Version Asciify JavaScript Escape JavaScript Characters UnPacker Packed JS JavaScript Minify/Uglify Text Splitter/Chunker Twitter, Use More Characters Base64 Drag 'n Drop Redirect URL DataURI Get Words Repeated LZMA Archiver ZIP Read/Extract/Make BEAUTIFIER & CODE FIXER WHAK-A-SCRIPT JAVASCRIPT MANGLER 30 STRING ENCODERS CONVERTERS, ENCRYPTION & ENCODERS 43 Byte 1px GIF Generator Steganography PNG Generator WEB APPS VIA DATAURL OLD VERSION OF WHAK PAKr Fun Text Encrypt Our Google";

console.time('compress');
compress(test).then(function (x) {
  console.timeEnd('compress');
  console.log('compressed length', x.byteLength);
  console.time('decompress');
  decompress(x).then(function (y) {
    console.timeEnd('decompress');
    console.log('decompressed length', y.length);
    console.assert(test === y);
  });
});*/