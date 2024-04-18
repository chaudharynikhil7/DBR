import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface EnhancedGrayscaleImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
