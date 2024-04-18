import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface GrayscaleImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
