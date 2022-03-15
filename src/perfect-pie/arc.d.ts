/// <reference types="react" />
export interface ArcProps {
    id: number;
    startAngle: number;
    endAngle: number;
    color?: string;
    onClick: (id: number) => void;
    selectable?: boolean;
}
export declare function Arc(props: ArcProps): JSX.Element;
