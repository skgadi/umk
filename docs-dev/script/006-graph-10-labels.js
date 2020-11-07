((graph) => {



  graph.hideGraphText = false;
  //Handling labels
  graph.getLabel = function (cell) {
    if (!!cell.value) {
      if (!!cell.style && cell.style.search("umk_model") >= 0) {
        if (this.hideGraphText) {
          //console.log("hi");
          return "";
        } else {
          try {
            if ((typeof cell.value === "string") ||
              ((typeof cell.value === "Object") && (cell.value.constructor.name.search(/umk_\d{13}/g) >= 0))) {
              if (typeof cell.value !== "Object") {
                cell.value = JSON.parse2(cell.value);
              }
              eval("var tempModel = new " + cell.value.id + "(cell.value);");
              cell.value = tempModel;
            }
            /*//Set input and output terminals
            setTermianls(this, cell, "umk_input");
            setTermianls(this, cell, "umk_output");*/
            //console.log(cell.value.Icon());
            this.setCaption(cell, cell.value.Name);
            if (!!cell.style && cell.style.search("umk_display") >= 0) {
              return cell.value.show || "$[\\cdot]$";
            }
            cell.value.cid=cell.id;
            return (
              "<div class='rotate-" + cell.value.rotateHTML + "'>" +
              cell.value.Icon().html +
              "</div>"
            );
          } catch (e) {
            console.log(e);
            return "ERROR";
          }
        }
      } else {
        if (!!cell.style && cell.style.search("umk_EO") >= 0 && !this.showExeOrder) {
          return "";
        } else {
          return cell.value; //"$\\text{"+cell.value+"}$";
        }
      }
    } else return null;
  };
  graph.getEditingValue = function (cell, evt) {
    if (!!cell.value) {
      if (typeof cell.value === "object") return cell.value.Name || "";
      else return cell.value;
    } else return null;
  };
  graph.labelChanged = function (cell, newValue, trigger) {
    if (!!cell.value) {
      if (typeof cell.value === "object") {
        let value = mxUtils.clone(cell.value);
        value.Name = newValue;
        newValue = value;
      }
    }
    mxGraph.prototype.labelChanged.apply(this, arguments);
  };
  graph.showCaptions = true;
  graph.showExeOrder = true;
  graph.setCaption = function (Cell, value) {
    let children = Cell.children;
    if (!!children) {
      for (let i = 0; i < children.length; i++) {
        if (!!children[i].style && children[i].style.search("umk_caption") >= 0) {
          if (this.showCaptions) {
            children[i].setValue(value);
          } else {
            children[i].setValue("");
          }
          //this.refresh(children[i]);
        }
      }
    }
  }




})(mainSystem.graph)