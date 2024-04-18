import { DSImageData } from "./DSImageData";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface TextureRemovedBinaryImageUnit extends IntermediateResultUnit {
    imageData: DSImageData;
}
