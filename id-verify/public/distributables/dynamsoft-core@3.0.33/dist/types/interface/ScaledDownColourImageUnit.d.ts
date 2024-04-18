import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface ScaledDownColourImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
