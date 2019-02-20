/* 3D Vector Rotation & Matrices Helper
 * By James E Perlman, 2019
 * This includes some primitive types and functions for operating on 3D Vectors and Matrices
 */

function MakeVector3D(arr) {
    return Vector3D(arr[0], arr[1], arr[2]);
}

function MakeVector3DFromDegrees(arr) {
    return Vector3D(degreesToRadians(arr[0]), degreesToRadians(arr[1]), degreesToRadians(arr[2]));
}

var Vector3D = function(x, y, z) {
    return {
        x: x,
        y: y,
        z: z,
        
        adding: function(v) {
            return Vector3D(x + v.x, y + v.y, z + v.z);
        },

        subtracting: function(v) {
            return Vector3D(x - v.x, y - v.y, z - v.z);
        },

        scaledBy: function(s) {
            return Vector3D(s * x, s * y, s * z);
        },

        rotatedAboutX: function(theta) {
            return Vector3D(
                x * Math.cos(theta) - y * Math.sin(theta),
                x * Math.sin(theta) + y * Math.cos(theta),
                z
            );
        },

        rotatedAboutY: function(theta) {
            return Vector3D(
                x * Math.cos(theta) + z * Math.sin(theta),
                y,
                -x * Math.sin(theta), z * Math.cos(theta)
            );
        },
        
        rotatedAboutZ: function(theta) {
            return Vector3D(
                x,
                y * Math.cos(theta) - z * Math.sin(theta),
                y * Math.sin(theta) + z * Math.cos(theta)
            );
        },

        toArray: function() {
            return [x, y, z];
        },

        toArray2D: function() {
            return [x, y];
        }
    }
}

var Point3D = Vector3D;
var MakePoint3D = MakeVector3D;

var Ray3D = function(start, toward) {
    var p0 = start;
    var p1 = toward;

    return {
        p0: p0,
        p1: p1,
        evaluate: function(t) {
            return Point3D(
                (p1.x - p0.x) * t + p0.x,
                (p1.y - p0.y) * t + p0.y,
                (p1.z - p0.z) * t + p0.z
            );
        }
    }
}

var Plane = function(anchorPoint, orientationVector) {
    return {
        n: orientationVector,
        p: anchorPoint
    };
}

function Matrix(columns) {

    var mmul = function(matrix, n, m, p) {
        var a = columns;
        var b = matrix.columns;

        var c = [];
        for (var i = 0; i < n; i++) {
            c[i] = [];
            for (var j = 0; j < p; j++) {
                c[i][j] = 0;
                for (var k = 0; k < m; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        
        return Matrix(c);
    };

    return {
        columns: columns,

        multipliedByMatrix: function(matrix) {
            return mmul(matrix, 3, 3, 3);
        },

        multipliedByVector: function(vector) {
            var v = vector.toArray();
            var mat = mmul(Matrix([[v[0]], [v[1]], [v[2]]]), 3, 3, 1);
            var m = mat.columns;
            return MakeVector3D([m[0][0], m[1][0], m[2][0]]);
        }
    }
};

function MakeXRotationMatrix(theta) {
    return Matrix(
        [
            [1, 0, 0],
            [0, Math.cos(theta), Math.sin(theta)],
            [0, -Math.sin(theta), Math.cos(theta)],
        ]
    )
}

function MakeYRotationMatrix(theta) {
    return Matrix(
        [
            [Math.cos(theta), 0, -Math.sin(theta)],
            [0, 1, 0],
            [Math.sin(theta), 0, Math.cos(theta)]
        ]
    )
}

function MakeZRotationMatrix(theta) {
    return Matrix(
        [
            [Math.cos(theta), Math.sin(theta), 0],
            [-Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 1]
        ]
    )
}

function MakeRotationMatrix(x, y, z) {
    var rx = MakeXRotationMatrix(x);
    var ry = MakeYRotationMatrix(y);
    var rz = MakeZRotationMatrix(z);

    return rz.multipliedByMatrix(ry).multipliedByMatrix(rx);
}

function MakeRotationMatrixFromOrientation(o) {
    return MakeRotationMatrix(o[0], o[1], o[2]);
}

function MakeRotationMatrixFromVector(v) {
    return MakeRotationMatrix(v.x, v.y, v.z);
}

// returns a Point3D representing the intersection point between a Plane and a Line
function getIntersectionPoint(plane, line) {
    var n = plane.n;
    var o = plane.p;

    var p0 = line.p0;
    var p1 = line.p1;

    var tn = n.x * (o.x - p0.x) + n.y * (o.y - p0.y) + n.z * (o.z - p0.z);
    var td = n.x * (p1.x - p0.x) + n.y * (p1.y - p0.y) + n.z * (p1.z - p0.z);
    var t = tn / td;

    return line.evaluate(t);
}

function getParentedPosition(layer) {
    if (layer.hasParent) {
        return layer.parent.toWorld(layer.transform.position);
    } else {
        return layer.transform.position;
    }
}

function getParentedOrientation(layer) {
    var l = layer;
    while (l.hasParent) {
        l = l.parent;
    }
    return l.orientation;
}
