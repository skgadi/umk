
mainSystem.graph.model.addListener(mxEvent.CHANGE, function(sender, evt)
{
    simVue.displayExecutionOrder();
});