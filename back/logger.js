const chalk = require("chalk");

module.exports = {
  error: (...msg) => console.error(chalk.red(...msg)),
  success: (...msg) => console.log(chalk.green(...msg)),
  info: (...msg) => console.log(chalk.blue(...msg)),
  note: (...msg) => console.log(chalk.gray(...msg)),
};
