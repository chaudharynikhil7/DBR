import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface ColourImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
