import React, { useLayoutEffect, useState } from 'react';
import * as classNames from 'classnames';
import { ensureNotNull } from '@tradingview/core/assertions';
import { CENTER_LABELS_ANGLE, LABEL_PADDING, RADIUS, } from './constants';
import { ArcLabel } from './arc-label';
import { checkOverlap, getCoordinatePoint } from './utils';
import * as s from './arc-labels.pcss';
export function ArcLabels(props) {
    var data = props.data;
    var _a = useState(new Set()), overlapped = _a[0], setOverlapped = _a[1];
    var refs = [];
    useLayoutEffect(function () {
        var newOverlapped = new Set();
        for (var i = 0; i < refs.length && refs.length > 1; i++) {
            var nextIndex = (i + 1) % refs.length;
            var next = ensureNotNull(refs[nextIndex].current);
            var overlap = checkOverlap(ensureNotNull(refs[i].current), next);
            if (overlap) {
                newOverlapped.add(i);
                newOverlapped.add(nextIndex);
            }
        }
        setOverlapped(newOverlapped);
    }, [data]);
    return (React.createElement(React.Fragment, null, data.map(function (arc, index) {
        var title = arc.title, angle = arc.angle;
        var ref = React.createRef();
        refs.push(ref);
        return (React.createElement("div", { key: index, className: getLabelClass(angle), style: getLabelPosStyle(angle, RADIUS + LABEL_PADDING) },
            React.createElement(ArcLabel, { reference: ref, title: title, overlapped: overlapped.has(index) })));
    })));
}
function getLabelClass(angle) {
    var cos = Math.cos(angle);
    var minCos = Math.cos(CENTER_LABELS_ANGLE);
    return classNames(s.labelWrap, Math.abs(cos) >= minCos && (cos > 0 ? s.right : s.left));
}
function getLabelPosStyle(angle, labelRadius) {
    var point = getCoordinatePoint(RADIUS, labelRadius, angle);
    return {
        top: point.y + "%",
        left: point.x + "%",
    };
}
