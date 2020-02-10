import { checkCollinear, getDistance, moveTo } from "./helpers";

export default {
  reverseCoords(array) {
    return array.some(item => Array.isArray(item))
      ? array.map(function reverse(item) {
          return Array.isArray(item) && Array.isArray(item[0])
            ? item.map(reverse)
            : item.reverse();
        })
      : array.slice().reverse();
  },
  toLatLng(arr) {
    return this.reverseCoords(arr);
  },

  roundPathCorners(rings, radius) {
    function moveTowardsFractional(movingPoint, targetPoint, fraction) {
      return {
        x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
        y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction
      };
    }

    function pointForCommand(cmd) {
      return {
        x: parseFloat(cmd[cmd.length - 2]),
        y: parseFloat(cmd[cmd.length - 1])
      };
    }

    var resultCommands = [];

    if (+radius) {
      radius = Math.abs(radius);
    } else {
      radius = 0.15;
    }

    for (let i = 0, len = rings.length; i < len; i++) {
      var commands = rings[i];

      resultCommands.push(["M", commands[0].x, commands[0].y]);

      for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
        var prevCmd = resultCommands[resultCommands.length - 1];
        var curCmd = commands[cmdIndex];
        var nextCmd = commands[cmdIndex + 1];

        // Nasty logic to decide if this path is a candidite.
        if (nextCmd && prevCmd) {
          // Calc the points we're dealing with
          var prevPoint = pointForCommand(prevCmd); // convert to Object
          var curPoint = curCmd;
          var nextPoint = nextCmd;

          // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
          var curveStart, curveEnd;

          curveStart = moveTowardsFractional(
            curPoint,
            prevCmd.origPoint || prevPoint,
            radius
          );
          curveEnd = moveTowardsFractional(
            curPoint,
            nextCmd.origPoint || nextPoint,
            radius
          );

          // Adjust the current command and add it
          curCmd = Object.values(curveStart);

          curCmd.origPoint = curPoint;
          curCmd.unshift("L");
          resultCommands.push(curCmd);

          // if radius is different than zero calculate curve
          if (radius) {
            // The curve control points are halfway between the start/end of the curve and
            // the original point
            var startControl = moveTowardsFractional(curveStart, curPoint, 0.5);
            var endControl = moveTowardsFractional(curPoint, curveEnd, 0.5);
            // Create the curve
            var curveCmd = [
              "C",
              startControl.x,
              startControl.y,
              endControl.x,
              endControl.y,
              curveEnd.x,
              curveEnd.y
            ];
            // Save the original point for fractional calculations
            curveCmd.origPoint = curPoint;
            resultCommands.push(curveCmd);
          }
        } else {
          // Pass through commands that don't qualify
          var el = Object.values(curCmd);
          el.unshift("L");
          resultCommands.push(el);
        }
      }
    }
    // console.log(resultCommands);

    return (
      resultCommands.reduce(function(str, c) {
        return str + c.join(" ") + " ";
      }, "") || "M0 0"
    );
  },

  genPath(points, radius) {
    const start = points.shift();
    const end = points[points.length - 1];

    return (
      `M${start.x} ${start.y}` +
      points
        .map((point, index) => {
          const next = points[index + 1];
          const prev = points[index - 1] || start;
          const isCollinear = next && checkCollinear(next, point, prev);

          if (!next || isCollinear) {
            return `L${point.x} ${point.y}`;
          }

          const threshold = Math.min(
            getDistance(prev, point),
            getDistance(next, point)
          );
          const isTooCloseForRadius = threshold / 2 < radius;
          const radiusForPoint = isTooCloseForRadius ? threshold / 2 : radius;

          const before = moveTo(prev, point, radiusForPoint);
          const after = moveTo(next, point, radiusForPoint);

          return `L${before.x} ${before.y}S${point.x} ${point.y} ${after.x} ${after.y}`;
        })
        .join("")
    );
  },
  createPath(parts, radius = 18) {
    const result = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const points = this.genPath(parts[i], radius);
      result.push(points);
    }
    return result.join(" ");
  }
};
