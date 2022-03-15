/// <reference types="react" />
export interface SectorData {
    name: string;
    count: number;
}
export interface PieProps {
    data: SectorData[];
    title?: string;
    selectable?: boolean;
}
export declare function PieChart(props: PieProps): JSX.Element;
