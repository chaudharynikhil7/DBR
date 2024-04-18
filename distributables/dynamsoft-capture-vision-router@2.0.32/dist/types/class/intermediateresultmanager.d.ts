import IntermediateResultReceiver from "./intermediateresultreceiver";
export default class IntermediateResultManager {
    private intermediateResultReceiverSet;
    addResultReceiver(receiver: IntermediateResultReceiver): void;
    removeResultReceiver(receiver: IntermediateResultReceiver): void;
}
