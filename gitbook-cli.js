/* eslint-disable no-console */
const gitbook = require('gitbook');
const program = require('commander');
const color = require('bash-color');
const parsedArgv = require('optimist').argv;
const _ = require('lodash');

function runPromise(p) {
  return p
  .then(() => {
      process.exit(0);
  }, err => {
      console.log('');
      console.log(color.red(err.toString()));
      if (program.debug || process.env.DEBUG) console.log(err.stack || '');
      process.exit(1);
  });
}

// Helper function for print help
// indented output by spaces
function indentOutput(n, name, description) {
  console.log(
      _.repeat('    ', n || 0)
      + name
      + _.repeat(' ', 32 - (n || 0) * 4 - name.length)
      + description
  );
}

// Print help for a list of commands
// It prints the command and its description, then all the options
function help(commands) {
  _.each(commands, command => {
      indentOutput(1, command.name, command.description);
      _.each(command.options || [], option => {
          let after = [];

          if (option.defaults !== undefined) after.push(`Default is ${option.defaults}`);
          if (option.values) after.push(`Values are ${option.values.join(", ")}`);

          if (after.length > 0) after = `(${after.join("; ")})`;
          else after = "";

          let optname = '--';
          if (typeof option.defaults === 'boolean') optname += '[no-]';
          optname += option.name;
          indentOutput(2, optname, `${option.description  } ${  after}`);
      });
      console.log('');
  });
}

function exec(commands, command, args, kwargs) {
  const cmd = _.find(commands, _cmd => {
      return _.first(_cmd.name.split(" ")) === command;
  });

  // Command not found
  if (!cmd) throw new Error(`Command ${command} doesn't exist, run "gitbook help" to list commands.`);

  // Apply defaults
  _.each(cmd.options || [], option => {
      // eslint-disable-next-line no-param-reassign
      kwargs[option.name] = (kwargs[option.name] === undefined)? option.defaults : kwargs[option.name];
      if (option.values && !_.includes(option.values, kwargs[option.name])) {
          throw new Error(`Invalid value for option "${option.name}"`);
      }
  });

  return cmd.exec(args, kwargs);
}

program
    .command('help')
    .description('List commands for GitBook')
    .action(() => {
        runPromise(
            Promise.resolve(gitbook)
            .get('commands')
            .then(help)
        );
    });

program
    .command('*')
    .description('run a command with a specific gitbook version')
    .action(commandName => {
        const args = parsedArgv._.slice(1);
        const kwargs = _.omit(parsedArgv, '$0', '_');

        runPromise(
          Promise.resolve(exec(gitbook.commands, commandName, args, kwargs))
        );
    });

if(_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
  program.help();
}
