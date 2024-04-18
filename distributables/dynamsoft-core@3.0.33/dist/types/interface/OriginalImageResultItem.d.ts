import { CapturedResultItem } from "./CapturedResultItem";
import { DSImageData } from "./DSImageData";
export interface OriginalImageResultItem extends CapturedResultItem {
    readonly imageData: DSImageData;
}
