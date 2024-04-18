import { OriginalImageResultItem } from "dynamsoft-core";
export interface CapturedResultFilter {
    onOriginalImageResultReceived?: (result: OriginalImageResultItem) => void;
    [key: string]: any;
}
