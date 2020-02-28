import ESLintParser from '../eslint-parser';
import { Hook } from '@oclif/config';

const hook: Hook<'register-parsers'> = async function({ registerParser }: any) {
  registerParser('eslint', new ESLintParser());
};

export default hook;
