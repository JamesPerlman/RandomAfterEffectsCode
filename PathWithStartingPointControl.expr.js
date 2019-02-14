/**
 * This expression copies a path from another source and replaces the first point
 * with a custom control point.  It also accounts for curvature from the control point.
 * 
 * Use case: Say you have a shape, and a point tracked on some footage.  You want the
 * starting point of the shape's path to move along with the tracked point, but you don't
 * want the entire shape to track with the footage.
 * 
 * copyLayer is a shape layer with a path that you can edit later.
 * controlLayer in this case is a null with tracking data applied.
 * 
 * This expression is applied to a Mask Path or Shape Path that will synthesize
 * the correct path with the new starting locked on to controlPoint's position.
 */

// custom vars
controlPointOffset = -25;

// get references to comps
controlLayer = thisComp.layer("Path Startpoint 3");
copyLayer = thisComp.layer("Rope 3 Path Guide");
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
controlDirectionVector = [Math.cos(controlRotation), Math.sin(controlRotation)];

// we need to transform all the path points to account for any offset between comps
for (i = 0; i < originalPoints.length; ++i) {
    originalPoints[i] = fromComp(copyLayer.toComp(originalPoints[i]));
}

// we need to spoof a first outTangent to match the rotation of the null
firstTangentLength = length(originalInTangents[0]);
firstOutTangent = firstTangentLength * controlDirectionVector

// We also need to offset the first control point
newControlPoint = controlPoint + controlPointOffset * controlDirectionVector;

// Construct the new curve
newPoints = [newControlPoint].concat(originalPoints);
newInTangents = [[0,0]].concat(originalInTangents);
newOutTangents = [firstOutTangent].concat(originalOutTangents);

createPath(newPoints, newInTangents, newOutTangents, false);
