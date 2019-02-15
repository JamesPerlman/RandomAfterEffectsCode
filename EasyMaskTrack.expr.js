/**
 * This expression pins a mask to a control null with position data
 *
 * Use case: Say you have a single point track.  You want a mask to follow that point,
 * but you don't want to go through the hassle of tracking the mask or animating it.
 * 
 * Create your mask, align it with the footage, then place this expression on the
 * Mask Path that you want to follow the tracked point.
 * 
 * Replace copyMask with another mask you want to copy from.
 * Replace controlLayer with the tracked null you want to follow.
 * Replace initialControlPosition with the [x,y] of your null at the start of the track.
 */
 
// Get references to objects
copyMask = mask("Point 1 Cap Subtract Source");
controlLayer = thisComp.layer("Path Startpoint 1");
initialControlPosition = [1183.0, 199.0];

// Some more relevant vars
originalPath = copyMask.maskPath;
controlPoint = controlLayer.transform.position;
controlRotation = degreesToRadians(controlLayer.transform.rotation);
initialControlPosition = initialControlPosition;

// Transform points by offsetting them
originalPoints = originalPath.points();
numPoints = originalPoints.length;
newPoints = new Array(numPoints);

for (i = 0; i < numPoints; ++i) {
    currentControlPosition = controlLayer.transform.position;
    offset = fromComp(currentControlPosition) - initialControlPosition;
    newPoints[i] = originalPoints[i] + offset;
}

createPath(newPoints, originalPath.inTangents(), originalPath.outTangents(), originalPath.isClosed());
