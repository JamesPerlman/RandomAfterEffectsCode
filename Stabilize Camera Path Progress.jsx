(function main() {
    var STR_PLEASE_SELECT = 'Please select the layer you want to stabilize and the camera created by the 3D Camera Tracker.';

    app.beginUndoGroup("Stabilize Camera Path Progress");
    var comp = app.project.activeItem;
    
    if (comp === undefined) {
        alert(STR_PLEASE_SELECT);
        return;
    }

    var layers = comp.selectedLayers;

    if (layers.length !== 2) {
        alert(STR_PLEASE_SELECT);
        return;
    }

    var cameraLayer, footageLayer;

    for (var i = 0; i < layers.length; ++i) {
        var layer = layers[i];
        if (layer instanceof CameraLayer) {
            cameraLayer = layer;
        } else if (layer.canSetTimeRemapEnabled) {
            footageLayer = layer;
        }
    }

    if (!cameraLayer || !footageLayer) {
        alert(STR_PLEASE_SELECT);
        return;
    };

    var progressSlider = footageLayer.Effects.addProperty("ADBE Slider Control");
    progressSlider.name = "Progress";

    footageLayer.timeRemapEnabled = true;
    var timeRemap = footageLayer.property("ADBE Time Remapping");
    timeRemap.expression =
    "cam = thisComp.layer(\"" + cameraLayer.name + "\");\n" +
    "const totalFrames = timeToFrames(thisComp.duration);\n" +
    "const progSlider = Math.max(Math.min(effect(\"" + progressSlider.name + "\")(\"Slider\"), 100), 0);\n" +
    "\n" +
    "const progByFrame = (function(camera, frames) {\n" +
    "    const camPosAtFrame = (f) => camera.transform.position.valueAtTime(framesToTime(f));\n" +
    "    const dist = [0];\n" +
    "    let totalDist = 0;\n" +
    "    let prevPos = camPosAtFrame(0);\n" +
    "\n" +
    "    for (var i = 1; i < frames; ++i) {\n" +
    "        const p = camPosAtFrame(i);\n" +
    "        totalDist += length(p - prevPos);\n" +
    "        dist.push(totalDist);\n" +
    "        prevPos = p;\n" +
    "    };\n" +
    "\n" +
    "     return dist.map((d) => (100 * d / totalDist));\n" +
    "})(cam, totalFrames);\n" +
    "\n" +
    "const frame = progByFrame.findIndex((p) => p >= progSlider);\n" +
    "\n" +
    "framesToTime(frame);\n";
})();
