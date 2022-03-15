/// <reference types="react" />
export interface ArcLabelData {
    title: string;
    angle: number;
}
export interface ArcLabelProps {
    data: ArcLabelData[];
}
export declare function ArcLabels(props: ArcLabelProps): JSX.Element;
