import { TaskMetaData } from '../types';
import { PdfComponentData } from './pdf-component-data';

export default class CardData extends PdfComponentData {
  filePath = '/path/'; //TODO: @ckessler - use this to register the partial, instead of hardcoding the path in pdf.ts

  constructor(meta: TaskMetaData, result: number) {
    super(meta, result);
  }
}
