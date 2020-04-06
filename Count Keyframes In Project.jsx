// To run this script after downloading it, go to File > Scripts > Run Script File, and then find and select it.
// Made by jperl
// Dedicated to cache_bunny who makes awesome videos

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
    const numKeysInProject = 0;
    for (var i = 1; i <= app.project.items.length; i++) {
        var item = app.project.items[i];
        if (item.typeName != "Composition") {
            continue;
        }
        for (var j = 1; j <= item.layers.length; j++) {
            var layer = item.layers[j];
            for (var k = 1; k <= layer.numProperties; k++) {
                var property = layer.property(k);
                numKeysInProject += keyframesInProperty(property);
            }
        }
     }
     alert("Wow. Your project has " + numKeysInProject + " keyframes! Amazing!");
}

main();
