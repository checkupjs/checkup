import { ITaskResult, IConsoleWriter } from '../types';

export default class ProjectInfoTaskResult implements ITaskResult {
  type!: string;
  name!: string;
  version!: string;

  toConsole(writer: IConsoleWriter) {
    writer.heading('Project Information');
    writer.column({
      Name: this.name,
      Type: this.type,
      Version: this.version,
    });
    writer.line();
  }

  toJson() {
    return { name: this.name, type: this.type, version: this.version };
  }
}
