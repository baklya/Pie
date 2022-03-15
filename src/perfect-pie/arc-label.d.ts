/// <reference types="react" />
import { Reference } from '@tradingview/ui-lib/core';
export interface ArcLabelProps {
    reference?: Reference<HTMLDivElement>;
    title: string;
    overlapped: boolean;
}
export declare function ArcLabel(props: ArcLabelProps): JSX.Element;
