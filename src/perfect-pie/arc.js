import React, { useState } from 'react';
import { ARC_HOVER_WIDTH, INNER_ARC_RADIUS, LABEL_PADDING, MIN_COORDINATE_VALUE, RADIUS, } from './constants';
import { formatPercent, getCoordinatePoint, numberToCoordinateString, } from './utils';
import * as s from './arc.pcss';
export function Arc(props) {
    var id = props.id, startAngle = props.startAngle, endAngle = props.endAngle, color = props.color, onClick = props.onClick, selectable = props.selectable;
    var _a = useState(false), selected = _a[0], setSelected = _a[1];
    var d = getFillPath(RADIUS, INNER_ARC_RADIUS, RADIUS, startAngle, endAngle);
    var value = Math.abs(endAngle - startAngle);
    var labelPoint = getMiddlePoint(RADIUS, RADIUS - LABEL_PADDING, startAngle, endAngle);
    return (React.createElement("g", { className: s.wrap, onClick: handleClick, fill: color },
        React.createElement("path", { d: d, "data-id": id }),
        React.createElement("path", { className: s.hoverContainer, d: d, fillOpacity: 0.25 }),
        selectable && selected && React.createElement("path", { className: s.selected, d: getArcPathD(RADIUS, RADIUS + ARC_HOVER_WIDTH, startAngle, endAngle), stroke: color, strokeWidth: 2, fill: "none" }),
        React.createElement("text", { className: s.label, x: labelPoint.x, y: labelPoint.y, dominantBaseline: "middle" }, formatPercent(value, 2 * Math.PI))));
    function handleClick() {
        onClick(id);
        if (!selectable) {
            return;
        }
        setSelected(!selected);
    }
}
function getMiddlePoint(start, radius, startAngle, endAngle) {
    var middle = (startAngle + endAngle) / 2;
    return getCoordinatePoint(start, radius, middle);
}
function getArcPathD(start, radius, startAngle, endAngle) {
    return "M" + getArcCurve(start, radius, startAngle, endAngle);
}
function getFillPath(start, lowRadius, highRadius, startAngle, endAngle) {
    var firstArcCurve = getArcCurve(start, lowRadius, startAngle, endAngle);
    var secondArcCurve = getArcCurve(start, highRadius, endAngle, startAngle, false);
    return "M" + firstArcCurve + "L" + secondArcCurve + "z";
}
function getArcCurve(start, radius, startAngle, endAngle, clockwise) {
    if (clockwise === void 0) { clockwise = true; }
    var startPoint = getCoordinatePoint(start, radius, startAngle);
    var endPoint = getCoordinatePoint(start, radius, endAngle);
    if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) {
        (clockwise ? startPoint : endPoint).x = numberToCoordinateString(start + MIN_COORDINATE_VALUE);
    }
    var sizeFlag = Math.abs(startAngle - endAngle) > Math.PI ? 1 : 0;
    var clockwiseFlag = clockwise ? 1 : 0;
    return startPoint.x + "," + startPoint.y + "A" + radius + "," + radius + " 0," + sizeFlag + "," + clockwiseFlag + " " + endPoint.x + "," + endPoint.y;
}
