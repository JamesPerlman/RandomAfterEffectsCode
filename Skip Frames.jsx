// Install this in your ScriptsUI folder and relaunch After Effects
// Made by jperl, April 6 2020
// For cyriak
(function (thisObj) {
    function skipFramesForActiveComp(frames) {
        var comp = app.project.activeItem;
        if (comp.typeName == "Composition") {
            comp.time += frames * comp.frameDuration;
        } else {
            alert("Please select your composition's timeline and make sure nothing is actively selected in your project navigator.");
        }
    }
    function createWindow(thisObj) {
        var w = (thisObj instanceof Panel)? thisObj : new Window("palette", "Skip Frames", [0,0,180,60]);
        var g = w.add("group", [0,0,180,60]);
        g.alignment = "center";
        g.alignChildren = "center";
        var prevButton = g.add("button", [10, 10, 50, 50], "◄");
        var labelText  = g.add("statictext", [60, 10, 120, 20], "# frames:");
        var framesText = g.add("edittext", [60, 30, 120, 50], "10");
        var nextButton = g.add("button", [130, 10, 170, 50], "►");
        
        prevButton.onClick = function() {
            var frames = -parseInt(framesText.text);
            skipFramesForActiveComp(frames);
        }

        nextButton.onClick = function() {
            var frames = parseInt(framesText.text);
            skipFramesForActiveComp(frames);
        }

        framesText.onChange = function() {
            this.text = this.text.replace(/[^\d]/g, "");
        }

        return w;
    }

    var window = createWindow(thisObj);
    if (window.toString() == "[object Panel]") {
        window;
    } else {
        window.show();
    }

})(this);
