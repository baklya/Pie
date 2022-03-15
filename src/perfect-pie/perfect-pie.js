import React, { useMemo, useRef, useState } from 'react';
import * as classNames from 'classnames';
import { ensureNotNull } from '@tradingview/core/assertions';
import { ARC_WIDTH, DIAMETER, START_ANGLE, } from './constants';
import { getColorByIndex } from 'platform/details/details-chart/series-colors';
import { hoverMouseEventFilter } from 'ui-kit/hooks/use-hover';
import { Arc } from './arc';
import { ArcTooltip } from './arc-tooltip';
import { ArcLabels } from './arc-labels';
import { formatPercent } from './utils';
import * as s from './pie-chart.pcss';
var centerTextSize = DIAMETER - ARC_WIDTH + "%";
var centerTextSizeStyle = { height: centerTextSize, width: centerTextSize };
export function PerfectPie(props) {
    var title = props.title, data = props.data, selectable = props.selectable;
    var _a = useState(new Set()), selected = _a[0], setSelected = _a[1];
    var svgRef = useRef(null);
    var arcTooltipRef = useRef(null);
    data.sort(function (a, b) {
        return b.count - a.count;
    });
    var labels = useMemo(function () { return data.map(function (d) { return d.name; }); }, [data]);
    var values = useMemo(function () { return data.map(function (d) { return d.count; }); }, [data]);
    var sum = useMemo(function () { return values.reduce(function (a, b) { return a + b; }, 0); }, [values]);
    var arcs = useMemo(function () {
        var res = [];
        var currentAngle = START_ANGLE;
        for (var i = 0; i < values.length; i++) {
            var nextAngle = currentAngle + 2 * Math.PI * values[i] / sum;
            res.push([currentAngle, nextAngle]);
            currentAngle = nextAngle;
        }
        return res;
    }, [values]);
    var labelsData = useMemo(function () {
        var res = [];
        var currentAngle = START_ANGLE;
        for (var i = 0; i < values.length; i++) {
            var nextAngle = currentAngle + 2 * Math.PI * values[i] / sum;
            res.push({
                title: labels[i],
                angle: (currentAngle + nextAngle) / 2,
            });
            currentAngle = nextAngle;
        }
        return res;
    }, [values]);
    var count = labels.length;
    var isValid = useMemo(function () { return values.every(function (v) { return v >= 0; }) && sum > 0; }, [values]);
    var arcElements = useMemo(function () { return arcs.map(function (arc, index) { return (React.createElement(Arc, { key: index, id: index, startAngle: arc[0], endAngle: arc[1], color: getColorByIndex(index), onClick: handleArcClick, selectable: selectable })); }); }, [arcs]);
    var arcLabelElements = useMemo(function () { return React.createElement(ArcLabels, { data: labelsData }); }, [labelsData]);
    if (!isValid) {
        return (React.createElement("div", { className: classNames(s.pieContainer, s.invalid) },
            React.createElement("div", { className: s.centerText, style: centerTextSizeStyle },
                React.createElement("div", null, "INVALID DATA"))));
    }
    return (React.createElement("div", { className: s.pieContainer },
        React.createElement("div", { className: s.centerText, style: centerTextSizeStyle },
            React.createElement("div", null, count),
            React.createElement("div", null, title)),
        React.createElement("svg", { ref: svgRef, xmlns: "http://www.w3.org/2000/svg", className: s.chart, width: DIAMETER, height: DIAMETER, viewBox: "0 0 " + DIAMETER + " " + DIAMETER, strokeWidth: "0", onMouseMove: handlePieMousePosition, onMouseOut: handlePieMouseOut }, arcElements),
        arcLabelElements,
        React.createElement(ArcTooltip, { ref: arcTooltipRef })));
    function handleArcClick(id) {
        if (!selectable) {
            return;
        }
        var newSelected = new Set(selected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        }
        else {
            newSelected.add(id);
        }
        setSelected(newSelected);
    }
    function isLeftTooltip(hoverX) {
        var _a = ensureNotNull(svgRef.current).getBoundingClientRect(), x = _a.x, width = _a.width;
        return hoverX < x + width / 2;
    }
    function handlePieMousePosition(e) {
        var arcTooltip = ensureNotNull(arcTooltipRef.current);
        var dataId = e.target.getAttribute('data-id');
        if (dataId !== null) {
            var x = e.clientX, y = e.clientY;
            var hoveredId = parseInt(dataId);
            arcTooltip.updateData({
                x: x,
                y: y,
                isLeft: isLeftTooltip(x),
                text: labels[hoveredId],
                count: values[hoveredId],
                percents: formatPercent(values[hoveredId], sum, true),
                color: getColorByIndex(hoveredId),
            });
        }
        else {
            arcTooltip.updateData(null);
        }
    }
    function handlePieMouseOut(e) {
        if (hoverMouseEventFilter(e)) {
            ensureNotNull(arcTooltipRef.current).updateData(null);
        }
    }
}
