// get references to comps
controlLayer = thisComp.layer("Path Startpoint 1");
copyLayer = thisComp.layer("Rope 1 Path Guide");
copyPath = copyLayer.content("Shape 1").content("Path 1");

// some more relevant vars
controlPoint = fromComp(controlLayer.transform.position);
originalPath = copyPath.path;
controlRotation = degreesToRadians(controlLayer.transform.rotation - 180);
offsetPoint = thisLayer.transform.position - thisLayer.transform.anchorPoint;

// get original path data
originalPoints = originalPath.points();
originalInTangents = originalPath.inTangents();
originalOutTangents = originalPath.outTangents();

// get ready to construct new points
// we need to transform all the path points to account for any offset between comps
for (i = 0; i < originalPoints.length; ++i) {
    originalPoints[i] = fromComp(copyLayer.toComp(originalPoints[i]));
}

// we need to spoof a first outTangent to match the rotation of the null
firstTangentLength = length(originalInTangents[0]);
firstOutTangent = firstTangentLength * [Math.cos(controlRotation), Math.sin(controlRotation)];

newPoints = [controlPoint].concat(originalPoints);
newInTangents = [[0,0]].concat(originalInTangents);
newOutTangents = [firstOutTangent].concat(originalOutTangents);

createPath(newPoints, newInTangents, newOutTangents, false);
