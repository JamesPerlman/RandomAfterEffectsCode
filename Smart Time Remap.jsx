// Usage: Select layers to add timeRemap to, but add a keyframe one frame before the end

(function () {

    app.beginUndoGroup("Time Remap Layer");

    var comp = app.project.activeItem;
    
    if (!comp || !comp.selectedLayers || comp.selectedLayers.length == 0) {
        alert("Please select  at least one layer to timeRemap");
    }

    var layers = comp.selectedLayers;
    
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        
        if (layer.timeRemapEnabled) {
            layer.timeRemapEnabled = false;
        }
        layer.timeRemapEnabled = true;

        var timeRemapProp = layer.property("ADBE Time Remapping");
        
        var oneFrame = comp.frameDuration;

        var times = [0, layer.source.duration - oneFrame];

        var values = [0, layer.source.duration - oneFrame];

        timeRemapProp.setValuesAtTimes(times, values);
        timeRemapProp.removeKey(3);

        app.endUndoGroup();
    }
})();
