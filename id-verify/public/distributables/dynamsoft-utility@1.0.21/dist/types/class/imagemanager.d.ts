import { DSImageData } from "dynamsoft-core";
export default class ImageManager {
    saveToFile(image: DSImageData, name: string, download?: boolean): Promise<File>;
    toCanvas(image: DSImageData): Promise<HTMLCanvasElement>;
}
