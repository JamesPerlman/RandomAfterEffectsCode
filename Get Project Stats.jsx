// To run this script after downloading it, go to File > Scripts > Run Script File, and then find and select it.
// Made by jperl

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function keyframesInProperty(property) {
	if (property.propertyType == PropertyType.PROPERTY) {
		return property.numKeys;
	} else {
        var keyframeCount = 0;
        for (var i = 1; i <= property.numProperties; i++) {
            keyframeCount += keyframesInProperty(property.property(i));
        }
        return keyframeCount;
    }
}

function main() {
    const numKeys = 0;
    const numComps = 0;
    const numLayers = 0;
    for (var i = 1; i <= app.project.items.length; i++) {
        var item = app.project.items[i];
        if (item.typeName != "Composition") {
            continue;
        }
        numComps += 1;
        numLayers += item.layers.length;
        for (var j = 1; j <= item.layers.length; j++) {
            var layer = item.layers[j];
            for (var k = 1; k <= layer.numProperties; k++) {
                var property = layer.property(k);
                numKeys += keyframesInProperty(property);
            }
        }
     }
     alert("Your project has:\n" + numberWithCommas(numComps) + " compositions\n" + numberWithCommas(numLayers) + " layers\n" + numberWithCommas(numKeys) + " keyframes\nAmazing!");
}

main();
