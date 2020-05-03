mainSystem.graph.model.addListener(mxEvent.CHANGE, function (sender, evt) {
  if (settings.showExeOrder) {
    simVue.displayExecutionOrder();
  }
});