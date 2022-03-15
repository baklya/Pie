import React from 'react';
import * as classNames from 'classnames';
import * as s from './arc-label.pcss';
export function ArcLabel(props) {
    var reference = props.reference, title = props.title, overlapped = props.overlapped;
    return (React.createElement("div", { className: classNames(s.container, overlapped && s.overlapped) },
        React.createElement("div", { ref: reference }, title)));
}
