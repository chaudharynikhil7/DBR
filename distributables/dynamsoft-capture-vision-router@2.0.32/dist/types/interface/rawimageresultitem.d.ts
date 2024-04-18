import { CapturedResultItem, DSImageData } from "dynamsoft-core";
export interface RawImageResultItem extends CapturedResultItem {
    readonly imageData: DSImageData;
}
