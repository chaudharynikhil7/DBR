import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface TextureRemovedGrayscaleImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
