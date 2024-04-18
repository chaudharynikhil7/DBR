import { IntermediateResultUnit } from "./IntermediateResultUnit";
import { PredetectedRegionElement } from "./PredetectedRegionElement";
export interface PredetectedRegionsUnit extends IntermediateResultUnit {
    predetectedRegions: Array<PredetectedRegionElement>;
}
