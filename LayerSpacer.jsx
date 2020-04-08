(function() {
    function spaceLayers(comp, layers, frames) {
        var dt = comp.frameDuration * frames;
        var t0 = layers[0].startTime;
        for (var i = 0; i < layers.length; i++) {
            layers[i].startTime = t0 + dt * i;
        }
    };

    function main() {
        var comp = app.project.activeItem;
        if (!comp || comp.typeName != "Composition") {
                alert("Please select some layers inside of a composition.", "LayerSpacer");
                return;
        }
        
        var layers = comp.selectedLayers;
        if (!layers || layers.length < 2) {
            alert("Please select 2 or more layers to put space between.");
            return;
        }

        var frames = parseInt(prompt("How many frames do you want to put between these layers?", "", "LayerSpacer"));

        if (frames === NaN || frames === undefined) {
            alert("Invalid input.  Please enter an integer next time.");
            return;
        }

        spaceLayers(comp, layers, frames);
    }

    main();
})();
