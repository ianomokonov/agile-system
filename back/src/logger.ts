/* eslint-disable no-console */
import chalk from 'chalk';

export default {
  error: (...msg: any) => console.error(chalk.red(...msg)),
  success: (...msg: any) => console.log(chalk.green(...msg)),
  info: (...msg: any) => console.log(chalk.blue(...msg)),
  note: (...msg: any) => console.log(chalk.gray(...msg)),
};
