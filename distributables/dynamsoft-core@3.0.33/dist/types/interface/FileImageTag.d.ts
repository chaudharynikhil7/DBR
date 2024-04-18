import { ImageTag } from "./ImageTag";
export interface FileImageTag extends ImageTag {
    filePath: string;
    pageNumber: number;
    totalPages: number;
}
