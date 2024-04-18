import { EnumImageSourceState } from "../enum/enumimagesourcestate";
export interface ImageSourceStateListener {
    onImageSourceStateReceived?: (status: EnumImageSourceState) => void;
}
