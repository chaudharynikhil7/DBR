import { Contour } from "./Contour";
import { IntermediateResultUnit } from "./IntermediateResultUnit";
export interface ContoursUnit extends IntermediateResultUnit {
    contours: Array<Contour>;
}
