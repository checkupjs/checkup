import ESLintParser from '../eslint-parser';
import { Hook } from '@oclif/config';

const hook: Hook<'register-parsers'> = async function({ registerParser }: any) {
  process.stdout.write('in here registering parsers');
  registerParser('eslint', new ESLintParser());
};

export default hook;
