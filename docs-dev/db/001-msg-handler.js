onmessage = function (oEvent) {
  //console.log(oEvent);
  //console.log(self.performance);
  //console.log(oEvent);
  //postMessage("Hello");
  if (typeof oEvent.data === "object") {
    let keys = Object.keys(oEvent.data);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case "use":
          exec.setDB(oEvent.data.use);
          break;
        case "put":
          exec.putData(oEvent.data.put);
          break;
        case "results":
          console.log(oEvent.data.results);
          exec.addResults(oEvent.data.results);
          break;
      }
    }
  }
}