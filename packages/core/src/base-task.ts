export default abstract class BaseTask {
  args: any;

  constructor(cliArguments: any) {
    this.args = cliArguments;
  }
}
