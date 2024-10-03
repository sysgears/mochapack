'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) =>
  function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, 'default', { value: mod, enumerable: true }) : target,
    mod,
  )
);
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  'node_modules/commander/lib/error.js'(exports2) {
    var CommanderError2 = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message) {
        super(1, 'commander.invalidArgument', message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
  },
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  'node_modules/commander/lib/argument.js'(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || '';
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case '<':
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case '[':
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.length > 3 && this._name.slice(-3) === '...') {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(`Allowed choices are ${this.argChoices.join(', ')}.`);
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? '...' : '');
      return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']';
    }
    exports2.Argument = Argument2;
    exports2.humanReadableArgName = humanReadableArgName;
  },
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  'node_modules/commander/lib/help.js'(exports2) {
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort = helpOption.short && cmd._findOption(helpOption.short);
          const removeLong = helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(cmd.createOption(helpOption.long, helpOption.description));
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(cmd.createOption(helpOption.short, helpOption.description));
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions) return [];
        const globalOptions = [];
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          const visibleOptions = ancestorCmd.options.filter((option) => !option.hidden);
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || '';
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(' ');
        return (
          cmd._name +
          (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
          (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
          (args ? ' ' + args : '')
        );
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(max, helper.subcommandTerm(command).length);
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(max, helper.argumentTerm(argument).length);
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + '|' + cmd._aliases[0];
        }
        let ancestorCmdNames = '';
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          ancestorCmdNames = ancestorCmd.name() + ' ' + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + ' ' + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`,
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault =
            option.required || option.optional || (option.isBoolean() && typeof option.defaultValue === 'boolean');
          if (showDefault) {
            extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          return `${option.description} (${extraInfo.join(', ')})`;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`,
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
        }
        if (extraInfo.length > 0) {
          const extraDescripton = `(${extraInfo.join(', ')})`;
          if (argument.description) {
            return `${argument.description} ${extraDescripton}`;
          }
          return extraDescripton;
        }
        return argument.description;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth || 80;
        const itemIndentWidth = 2;
        const itemSeparatorWidth = 2;
        function formatItem(term, description) {
          if (description) {
            const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
            return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
          }
          return term;
        }
        function formatList(textArray) {
          return textArray.join('\n').replace(/^/gm, ' '.repeat(itemIndentWidth));
        }
        let output = [`Usage: ${helper.commandUsage(cmd)}`, ''];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([helper.wrap(commandDescription, helpWidth, 0), '']);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
        });
        if (argumentList.length > 0) {
          output = output.concat(['Arguments:', formatList(argumentList), '']);
        }
        const optionList = helper.visibleOptions(cmd).map((option) => {
          return formatItem(helper.optionTerm(option), helper.optionDescription(option));
        });
        if (optionList.length > 0) {
          output = output.concat(['Options:', formatList(optionList), '']);
        }
        if (this.showGlobalOptions) {
          const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
            return formatItem(helper.optionTerm(option), helper.optionDescription(option));
          });
          if (globalOptionList.length > 0) {
            output = output.concat(['Global Options:', formatList(globalOptionList), '']);
          }
        }
        const commandList = helper.visibleCommands(cmd).map((cmd2) => {
          return formatItem(helper.subcommandTerm(cmd2), helper.subcommandDescription(cmd2));
        });
        if (commandList.length > 0) {
          output = output.concat(['Commands:', formatList(commandList), '']);
        }
        return output.join('\n');
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper),
        );
      }
      /**
       * Wrap the given string to width characters per line, with lines after the first indented.
       * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
       *
       * @param {string} str
       * @param {number} width
       * @param {number} indent
       * @param {number} [minColumnWidth=40]
       * @return {string}
       *
       */
      wrap(str, width, indent, minColumnWidth = 40) {
        const indents = ' \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF';
        const manualIndent = new RegExp(`[\\n][${indents}]+`);
        if (str.match(manualIndent)) return str;
        const columnWidth = width - indent;
        if (columnWidth < minColumnWidth) return str;
        const leadingStr = str.slice(0, indent);
        const columnText = str.slice(indent).replace('\r\n', '\n');
        const indentString = ' '.repeat(indent);
        const zeroWidthSpace = '\u200B';
        const breaks = `\\s${zeroWidthSpace}`;
        const regex = new RegExp(
          `
|.{1,${columnWidth - 1}}([${breaks}]|$)|[^${breaks}]+?([${breaks}]|$)`,
          'g',
        );
        const lines = columnText.match(regex) || [];
        return (
          leadingStr +
          lines
            .map((line, i) => {
              if (line === '\n') return '';
              return (i > 0 ? indentString : '') + line.trimEnd();
            })
            .join('\n')
        );
      }
    };
    exports2.Help = Help2;
  },
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  'node_modules/commander/lib/option.js'(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || '';
        this.required = flags.includes('<');
        this.optional = flags.includes('[');
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith('--no-');
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === 'string') {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(`Allowed choices are ${this.argChoices.join(', ')}.`);
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, '');
        }
        return this.short.replace(/^-/, '');
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as a object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        return camelcase(this.name().replace(/^no-/, ''));
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey)) return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split('-').reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const flagParts = flags.split(/[ |,]+/);
      if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
      longFlag = flagParts.shift();
      if (!shortFlag && /^-[^-]$/.test(longFlag)) {
        shortFlag = longFlag;
        longFlag = void 0;
      }
      return { shortFlag, longFlag };
    }
    exports2.Option = Option2;
    exports2.DualOptions = DualOptions;
  },
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  'node_modules/commander/lib/suggestSimilar.js'(exports2) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance) return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost,
            // substitution
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0) return '';
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith('--');
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(', ')}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return '';
    }
    exports2.suggestSimilar = suggestSimilar;
  },
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  'node_modules/commander/lib/command.js'(exports2) {
    var EventEmitter = require('node:events').EventEmitter;
    var childProcess = require('node:child_process');
    var path9 = require('node:path');
    var fs8 = require('node:fs');
    var process2 = require('node:process');
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class _Command extends EventEmitter {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = true;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || '';
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = '';
        this._summary = '';
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._outputConfiguration = {
          writeOut: (str) => process2.stdout.write(str),
          writeErr: (str) => process2.stderr.write(str),
          getOutHelpWidth: () => (process2.stdout.isTTY ? process2.stdout.columns : void 0),
          getErrHelpWidth: () => (process2.stderr.isTTY ? process2.stderr.columns : void 0),
          outputError: (str, write2) => write2(str),
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === 'object' && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args) cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc) return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0) return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // functions to change where being written, stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // matching functions to specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // functions based on what is being written out
       *     outputError(str, write) // used for displaying errors, and not used for displaying help
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0) return this._outputConfiguration;
        Object.assign(this._outputConfiguration, configuration);
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== 'string') displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden) cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [fn] - custom argument processing function
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, fn, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof fn === 'function') {
          argument.default(defaultValue).argParser(fn);
        } else {
          argument.default(fn);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names
          .trim()
          .split(/ +/)
          .forEach((detail) => {
            this.argument(detail);
          });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument && previousArgument.variadic) {
          throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === 'boolean') {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          return this;
        }
        enableOrNameAndArgs = enableOrNameAndArgs ?? 'help [command]';
        const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? 'display help for command';
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs) helpCommand.arguments(helpArgs);
        if (helpDescription) helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== 'object') {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand =
          this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand('help'));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ['preSubcommand', 'preAction', 'postAction'];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== 'commander.executeSubCommandAsync') {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message));
        }
        process2.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === 'commander.invalidArgument') {
            const message = `${invalidArgumentMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption =
          (option.short && this._findOption(option.short)) || (option.long && this._findOption(option.long));
        if (matchingOption) {
          const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find((name) => this._findCommand(name));
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join('|');
          const newCmd = knownBy(command).join('|');
          throw new Error(`cannot add command '${newCmd}' as already have command '${existingCmd}'`);
        }
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, '--');
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(name, option.defaultValue === void 0 ? true : option.defaultValue, 'default');
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, 'default');
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(option, val, oldValue, invalidValueMessage);
          } else if (val !== null && option.variadic) {
            val = option._concatValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = '';
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on('option:' + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, 'cli');
        });
        if (option.envVar) {
          this.on('optionEnv:' + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, 'env');
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === 'object' && flags instanceof Option2) {
          throw new Error('To add an Option object use addOption() instead of option() or requiredOption()');
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === 'function') {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('-p, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx({ mandatory: true }, flags, description, parseArg, defaultValue);
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`,
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error('call .storeOptionsAsProperties() before adding options');
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error('call .storeOptionsAsProperties() before setting option values');
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key) !== void 0) {
            source = cmd.getOptionValueSource(key);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error('first parameter to parse must be array or undefined');
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process2.versions?.electron) {
            parseOptions.from = 'electron';
          }
          const execArgv = process2.execArgv ?? [];
          if (
            execArgv.includes('-e') ||
            execArgv.includes('--eval') ||
            execArgv.includes('-p') ||
            execArgv.includes('--print')
          ) {
            parseOptions.from = 'eval';
          }
        }
        if (argv === void 0) {
          argv = process2.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case 'node':
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case 'electron':
            if (process2.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case 'user':
            userArgs = argv.slice(0);
            break;
          case 'eval':
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
        }
        if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
        this._name = this._name || 'program';
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
        function findFile(baseDir, baseName) {
          const localBin = path9.resolve(baseDir, baseName);
          if (fs8.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path9.extname(baseName))) return void 0;
          const foundExt = sourceExt.find((ext) => fs8.existsSync(`${localBin}${ext}`));
          if (foundExt) return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || '';
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs8.realpathSync(this._scriptPath);
          } catch (err) {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path9.resolve(path9.dirname(resolvedScriptPath), executableDir);
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path9.basename(this._scriptPath, path9.extname(this._scriptPath));
            if (legacyName !== this._name) {
              localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path9.extname(executableFile));
        let proc;
        if (process2.platform !== 'win32') {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process2.execArgv).concat(args);
            proc = childProcess.spawn(process2.argv[0], args, { stdio: 'inherit' });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: 'inherit' });
          }
        } else {
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process2.execArgv).concat(args);
          proc = childProcess.spawn(process2.execPath, args, { stdio: 'inherit' });
        }
        if (!proc.killed) {
          const signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
          signals.forEach((signal) => {
            process2.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on('close', (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process2.exit(code);
          } else {
            exitCallback(new CommanderError2(code, 'commander.executeSubCommandAsync', '(close)'));
          }
        });
        proc.on('error', (err) => {
          if (err.code === 'ENOENT') {
            const executableDirMessage = executableDir
              ? `searched for local subcommand relative to directory '${executableDir}'`
              : 'no directory for search for local subcommand, use .executableDir() to supply a custom directory';
            const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
            throw new Error(executableMissing);
          } else if (err.code === 'EACCES') {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process2.exit(1);
          } else {
            const wrappedError = new CommanderError2(1, 'commander.executeSubCommandAsync', '(error)');
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) this.help({ error: true });
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(promiseChain, subCommand, 'preSubcommand');
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? '--help'],
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (
          this.registeredArguments.length > 0 &&
          this.registeredArguments[this.registeredArguments.length - 1].variadic
        ) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(argument, value, previous, invalidValueMessage);
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise && promise.then && typeof promise.then === 'function') {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors()
          .reverse()
          .filter((cmd) => cmd._lifeCycleHooks[event] !== void 0)
          .forEach((hookedCommand) => {
            hookedCommand._lifeCycleHooks[event].forEach((callback) => {
              hooks.push({ hookedCommand, callback });
            });
          });
        if (event === 'postAction') {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, 'preAction');
          promiseChain = this._chainOrCall(promiseChain, () => this._actionHandler(this.processedArgs));
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, 'postAction');
          return promiseChain;
        }
        if (this.parent && this.parent.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand('*')) {
            return this._dispatchSubcommand('*', operands, unknown);
          }
          if (this.listenerCount('command:*')) {
            this.emit('command:*', operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name) return void 0;
        return this.commands.find((cmd) => cmd._name === name || cmd._aliases.includes(name));
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== 'default';
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter((option) => option.conflictsWith.length > 0);
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find((defined) =>
            option.conflictsWith.includes(defined.attributeName()),
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} argv
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(argv) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv.slice();
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === '-';
        }
        let activeVariadicOption = null;
        while (args.length) {
          const arg = args.shift();
          if (arg === '--') {
            if (dest === unknown) dest.push(arg);
            dest.push(...args);
            break;
          }
          if (activeVariadicOption && !maybeOption(arg)) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args.shift();
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (args.length > 0 && !maybeOption(args[0])) {
                  value = args.shift();
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || (option.optional && this._combineFlagAndOptionalValue)) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                args.unshift(`-${arg.slice(2)}`);
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf('=');
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (maybeOption(arg)) {
            dest = unknown;
          }
          if (
            (this._enablePositionalOptions || this._passThroughOptions) &&
            operands.length === 0 &&
            unknown.length === 0
          ) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg);
              if (args.length > 0) operands.push(...args);
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg);
            if (args.length > 0) dest.push(...args);
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] = key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {},
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message, errorOptions) {
        this._outputConfiguration.outputError(
          `${message}
`,
          this._outputConfiguration.writeErr,
        );
        if (typeof this._showHelpAfterError === 'string') {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr('\n');
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || 'commander.error';
        this._exit(exitCode, code, message);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process2.env) {
            const optionKey = option.attributeName();
            if (
              this.getOptionValue(optionKey) === void 0 ||
              ['default', 'config', 'env'].includes(this.getOptionValueSource(optionKey))
            ) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process2.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return (
            this.getOptionValue(optionKey) !== void 0 &&
            !['default', 'implied'].includes(this.getOptionValueSource(optionKey))
          );
        };
        this.options
          .filter(
            (option) =>
              option.implied !== void 0 &&
              hasCustomOptionValue(option.attributeName()) &&
              dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option),
          )
          .forEach((option) => {
            Object.keys(option.implied)
              .filter((impliedKey) => !hasCustomOptionValue(impliedKey))
              .forEach((impliedKey) => {
                this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], 'implied');
              });
          });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: 'commander.missingArgument' });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: 'commander.optionMissingArgument' });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: 'commander.missingMandatoryOptionValue' });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find((target) => target.negate && optionKey === target.attributeName());
          const positiveOption = this.options.find((target) => !target.negate && optionKey === target.attributeName());
          if (
            negativeOption &&
            ((negativeOption.presetArg === void 0 && optionValue === false) ||
              (negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg))
          ) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === 'env') {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: 'commander.conflictingOption' });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption) return;
        let suggestion = '';
        if (flag.startsWith('--') && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command
              .createHelp()
              .visibleOptions(command)
              .filter((option) => option.long)
              .map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: 'commander.unknownOption' });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments) return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? '' : 's';
        const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: 'commander.excessArguments' });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = '';
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp()
            .visibleCommands(this)
            .forEach((command) => {
              candidateNames.push(command.name());
              if (command.alias()) candidateNames.push(command.alias());
            });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: 'commander.unknownCommand' });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags = flags || '-V, --version';
        description = description || 'output the version number';
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on('option:' + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, 'commander.version', str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0) return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0) return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0) return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name) throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join('|');
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`,
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases) {
        if (aliases === void 0) return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage) return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return []
            .concat(
              this.options.length || this._helpOption !== null ? '[options]' : [],
              this.commands.length ? '[command]' : [],
              this.registeredArguments.length ? args : [],
            )
            .join(' ');
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0) return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path9.basename(filename, path9.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path10) {
        if (path10 === void 0) return this._executableDir;
        this._executableDir = path10;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        if (helper.helpWidth === void 0) {
          helper.helpWidth =
            contextOptions && contextOptions.error
              ? this._outputConfiguration.getErrHelpWidth()
              : this._outputConfiguration.getOutHelpWidth();
        }
        return helper.formatHelp(this, helper);
      }
      /**
       * @private
       */
      _getHelpContext(contextOptions) {
        contextOptions = contextOptions || {};
        const context = { error: !!contextOptions.error };
        let write2;
        if (context.error) {
          write2 = (arg) => this._outputConfiguration.writeErr(arg);
        } else {
          write2 = (arg) => this._outputConfiguration.writeOut(arg);
        }
        context.write = contextOptions.write || write2;
        context.command = this;
        return context;
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === 'function') {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const context = this._getHelpContext(contextOptions);
        this._getCommandAndAncestors()
          .reverse()
          .forEach((command) => command.emit('beforeAllHelp', context));
        this.emit('beforeHelp', context);
        let helpInformation = this.helpInformation(context);
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== 'string' && !Buffer.isBuffer(helpInformation)) {
            throw new Error('outputHelp callback must return a string or a Buffer');
          }
        }
        context.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit('afterHelp', context);
        this._getCommandAndAncestors().forEach((command) => command.emit('afterAllHelp', context));
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === 'boolean') {
          if (flags) {
            this._helpOption = this._helpOption ?? void 0;
          } else {
            this._helpOption = null;
          }
          return this;
        }
        flags = flags ?? '-h, --help';
        description = description ?? 'display help for command';
        this._helpOption = this.createOption(flags, description);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = process2.exitCode || 0;
        if (exitCode === 0 && contextOptions && typeof contextOptions !== 'function' && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, 'commander.help', '(outputHelp)');
      }
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text) {
        const allowedValues = ['beforeAll', 'before', 'after', 'afterAll'];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text === 'function') {
            helpStr = text({ error: context.error, command: context.command });
          } else {
            helpStr = text;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, 'commander.helpDisplayed', '(outputHelp)');
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith('--inspect')) {
          return arg;
        }
        let debugOption;
        let debugHost = '127.0.0.1';
        let debugPort = '9229';
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== '0') {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    exports2.Command = Command2;
  },
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  'node_modules/commander/index.js'(exports2) {
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports2.program = new Command2();
    exports2.createCommand = (name) => new Command2(name);
    exports2.createOption = (flags, description) => new Option2(flags, description);
    exports2.createArgument = (name, description) => new Argument2(name, description);
    exports2.Command = Command2;
    exports2.Option = Option2;
    exports2.Argument = Argument2;
    exports2.Help = Help2;
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
    exports2.InvalidOptionArgumentError = InvalidArgumentError2;
  },
});

// node_modules/detect-indent/index.js
var require_detect_indent = __commonJS({
  'node_modules/detect-indent/index.js'(exports2, module2) {
    'use strict';
    var INDENT_REGEX = /^(?:( )+|\t+)/;
    var INDENT_TYPE_SPACE = 'space';
    var INDENT_TYPE_TAB = 'tab';
    function makeIndentsMap(string, ignoreSingleSpaces) {
      const indents = /* @__PURE__ */ new Map();
      let previousSize = 0;
      let previousIndentType;
      let key;
      for (const line of string.split(/\n/g)) {
        if (!line) {
          continue;
        }
        let indent;
        let indentType;
        let weight;
        let entry;
        const matches = line.match(INDENT_REGEX);
        if (matches === null) {
          previousSize = 0;
          previousIndentType = '';
        } else {
          indent = matches[0].length;
          if (matches[1]) {
            indentType = INDENT_TYPE_SPACE;
          } else {
            indentType = INDENT_TYPE_TAB;
          }
          if (ignoreSingleSpaces && indentType === INDENT_TYPE_SPACE && indent === 1) {
            continue;
          }
          if (indentType !== previousIndentType) {
            previousSize = 0;
          }
          previousIndentType = indentType;
          weight = 0;
          const indentDifference = indent - previousSize;
          previousSize = indent;
          if (indentDifference === 0) {
            weight++;
          } else {
            const absoluteIndentDifference = indentDifference > 0 ? indentDifference : -indentDifference;
            key = encodeIndentsKey(indentType, absoluteIndentDifference);
          }
          entry = indents.get(key);
          if (entry === void 0) {
            entry = [1, 0];
          } else {
            entry = [++entry[0], entry[1] + weight];
          }
          indents.set(key, entry);
        }
      }
      return indents;
    }
    function encodeIndentsKey(indentType, indentAmount) {
      const typeCharacter = indentType === INDENT_TYPE_SPACE ? 's' : 't';
      return typeCharacter + String(indentAmount);
    }
    function decodeIndentsKey(indentsKey) {
      const keyHasTypeSpace = indentsKey[0] === 's';
      const type = keyHasTypeSpace ? INDENT_TYPE_SPACE : INDENT_TYPE_TAB;
      const amount = Number(indentsKey.slice(1));
      return { type, amount };
    }
    function getMostUsedKey(indents) {
      let result;
      let maxUsed = 0;
      let maxWeight = 0;
      for (const [key, [usedCount, weight]] of indents) {
        if (usedCount > maxUsed || (usedCount === maxUsed && weight > maxWeight)) {
          maxUsed = usedCount;
          maxWeight = weight;
          result = key;
        }
      }
      return result;
    }
    function makeIndentString(type, amount) {
      const indentCharacter = type === INDENT_TYPE_SPACE ? ' ' : '	';
      return indentCharacter.repeat(amount);
    }
    module2.exports = (string) => {
      if (typeof string !== 'string') {
        throw new TypeError('Expected a string');
      }
      let indents = makeIndentsMap(string, true);
      if (indents.size === 0) {
        indents = makeIndentsMap(string, false);
      }
      const keyOfMostUsedIndent = getMostUsedKey(indents);
      let type;
      let amount = 0;
      let indent = '';
      if (keyOfMostUsedIndent !== void 0) {
        ({ type, amount } = decodeIndentsKey(keyOfMostUsedIndent));
        indent = makeIndentString(type, amount);
      }
      return {
        amount,
        type,
        indent,
      };
    };
  },
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  'node_modules/semver/internal/constants.js'(exports2, module2) {
    var SEMVER_SPEC_VERSION = '2.0.0';
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER /* istanbul ignore next */ || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2,
    };
  },
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  'node_modules/semver/internal/debug.js'(exports2, module2) {
    var debug =
      typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)
        ? (...args) => console.error('SEMVER', ...args)
        : () => {};
    module2.exports = debug;
  },
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  'node_modules/semver/internal/re.js'(exports2, module2) {
    var { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = (exports2.re = []);
    var safeRe = (exports2.safeRe = []);
    var src = (exports2.src = []);
    var t = (exports2.t = {});
    var R = 0;
    var LETTERDASHNUMBER = '[a-zA-Z0-9-]';
    var safeRegexReplacements = [
      ['\\s', 1],
      ['\\d', MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? 'g' : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? 'g' : void 0);
    };
    createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
    createToken('NUMERICIDENTIFIERLOOSE', '\\d+');
    createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken(
      'MAINVERSION',
      `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`,
    );
    createToken(
      'MAINVERSIONLOOSE',
      `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`,
    );
    createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken(
      'PRERELEASELOOSE',
      `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`,
    );
    createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);
    createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken('FULL', `^${src[t.FULLPLAIN]}$`);
    createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
    createToken('GTLT', '((?:<|>)?=?)');
    createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken(
      'XRANGEPLAIN',
      `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`,
    );
    createToken(
      'XRANGEPLAINLOOSE',
      `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`,
    );
    createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken(
      'COERCEPLAIN',
      `${'(^|[^\\d])(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`,
    );
    createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken('COERCEFULL', src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken('COERCERTL', src[t.COERCE], true);
    createToken('COERCERTLFULL', src[t.COERCEFULL], true);
    createToken('LONETILDE', '(?:~>?)');
    createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = '$1~';
    createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken('LONECARET', '(?:\\^)');
    createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = '$1^';
    createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = '$1$2$3';
    createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken('STAR', '(<|>)?=?\\s*\\*');
    createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
    createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$');
  },
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  'node_modules/semver/internal/parse-options.js'(exports2, module2) {
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== 'object') {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  },
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  'node_modules/semver/internal/identifiers.js'(exports2, module2) {
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers,
    };
  },
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  'node_modules/semver/classes/semver.js'(exports2, module2) {
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== 'string') {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError('Invalid major version');
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError('Invalid minor version');
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError('Invalid patch version');
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split('.').map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split('.') : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === 'string' && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        return (
          compareIdentifiers(this.major, other.major) ||
          compareIdentifiers(this.minor, other.minor) ||
          compareIdentifiers(this.patch, other.patch)
        );
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug('prerelease compare', i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug('build compare', i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        switch (release) {
          case 'premajor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc('pre', identifier, identifierBase);
            break;
          case 'preminor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc('pre', identifier, identifierBase);
            break;
          case 'prepatch':
            this.prerelease.length = 0;
            this.inc('patch', identifier, identifierBase);
            this.inc('pre', identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case 'prerelease':
            if (this.prerelease.length === 0) {
              this.inc('patch', identifier, identifierBase);
            }
            this.inc('pre', identifier, identifierBase);
            break;
          case 'major':
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case 'minor':
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case 'patch':
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case 'pre': {
            const base = Number(identifierBase) ? 1 : 0;
            if (!identifier && identifierBase === false) {
              throw new Error('invalid increment argument: identifier is empty');
            }
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === 'number') {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join('.') && identifierBase === false) {
                  throw new Error('invalid increment argument: identifier already exists');
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join('.')}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  },
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  'node_modules/semver/functions/parse.js'(exports2, module2) {
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse;
  },
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  'node_modules/semver/functions/valid.js'(exports2, module2) {
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module2.exports = valid;
  },
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  'node_modules/semver/functions/clean.js'(exports2, module2) {
    var parse = require_parse();
    var clean = (version, options) => {
      const s = parse(version.trim().replace(/^[=v]+/, ''), options);
      return s ? s.version : null;
    };
    module2.exports = clean;
  },
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  'node_modules/semver/functions/inc.js'(exports2, module2) {
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === 'string') {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(version instanceof SemVer ? version.version : version, options).inc(
          release,
          identifier,
          identifierBase,
        ).version;
      } catch (er) {
        return null;
      }
    };
    module2.exports = inc;
  },
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  'node_modules/semver/functions/diff.js'(exports2, module2) {
    var parse = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse(version1, null, true);
      const v2 = parse(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return 'major';
        }
        if (highVersion.patch) {
          return 'patch';
        }
        if (highVersion.minor) {
          return 'minor';
        }
        return 'major';
      }
      const prefix = highHasPre ? 'pre' : '';
      if (v1.major !== v2.major) {
        return prefix + 'major';
      }
      if (v1.minor !== v2.minor) {
        return prefix + 'minor';
      }
      if (v1.patch !== v2.patch) {
        return prefix + 'patch';
      }
      return 'prerelease';
    };
    module2.exports = diff;
  },
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  'node_modules/semver/functions/major.js'(exports2, module2) {
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module2.exports = major;
  },
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  'node_modules/semver/functions/minor.js'(exports2, module2) {
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module2.exports = minor;
  },
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  'node_modules/semver/functions/patch.js'(exports2, module2) {
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module2.exports = patch;
  },
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  'node_modules/semver/functions/prerelease.js'(exports2, module2) {
    var parse = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module2.exports = prerelease;
  },
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  'node_modules/semver/functions/compare.js'(exports2, module2) {
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  },
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  'node_modules/semver/functions/rcompare.js'(exports2, module2) {
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module2.exports = rcompare;
  },
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  'node_modules/semver/functions/compare-loose.js'(exports2, module2) {
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module2.exports = compareLoose;
  },
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  'node_modules/semver/functions/compare-build.js'(exports2, module2) {
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module2.exports = compareBuild;
  },
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  'node_modules/semver/functions/sort.js'(exports2, module2) {
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module2.exports = sort;
  },
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  'node_modules/semver/functions/rsort.js'(exports2, module2) {
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module2.exports = rsort;
  },
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  'node_modules/semver/functions/gt.js'(exports2, module2) {
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module2.exports = gt;
  },
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  'node_modules/semver/functions/lt.js'(exports2, module2) {
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module2.exports = lt;
  },
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  'node_modules/semver/functions/eq.js'(exports2, module2) {
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module2.exports = eq;
  },
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  'node_modules/semver/functions/neq.js'(exports2, module2) {
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module2.exports = neq;
  },
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  'node_modules/semver/functions/gte.js'(exports2, module2) {
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  },
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  'node_modules/semver/functions/lte.js'(exports2, module2) {
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module2.exports = lte;
  },
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  'node_modules/semver/functions/cmp.js'(exports2, module2) {
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case '===':
          if (typeof a === 'object') {
            a = a.version;
          }
          if (typeof b === 'object') {
            b = b.version;
          }
          return a === b;
        case '!==':
          if (typeof a === 'object') {
            a = a.version;
          }
          if (typeof b === 'object') {
            b = b.version;
          }
          return a !== b;
        case '':
        case '=':
        case '==':
          return eq(a, b, loose);
        case '!=':
          return neq(a, b, loose);
        case '>':
          return gt(a, b, loose);
        case '>=':
          return gte(a, b, loose);
        case '<':
          return lt(a, b, loose);
        case '<=':
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  },
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  'node_modules/semver/functions/coerce.js'(exports2, module2) {
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === 'number') {
        version = String(version);
      }
      if (typeof version !== 'string') {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || '0';
      const patch = match[4] || '0';
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : '';
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : '';
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce;
  },
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  'node_modules/semver/internal/lrucache.js'(exports2, module2) {
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module2.exports = LRUCache;
  },
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  'node_modules/semver/classes/range.js'(exports2, module2) {
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, ' ');
        this.set = this.raw
          .split('||')
          .map((r) => this.parseRange(r.trim()))
          .filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = '';
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += '||';
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += ' ';
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts =
          (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ':' + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug('hyphen replace', range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug('comparator trim', range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug('tilde trim', range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug('caret trim', range);
        let rangeList = range
          .split(' ')
          .map((comp) => parseComparator(comp, this.options))
          .join(' ')
          .split(/\s+/)
          .map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug('loose invalid filter', comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug('range list', rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has('')) {
          rangeMap.delete('');
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError('a Range is required');
        }
        return this.set.some((thisComparators) => {
          return (
            isSatisfiable(thisComparators, options) &&
            range.set.some((rangeComparators) => {
              return (
                isSatisfiable(rangeComparators, options) &&
                thisComparators.every((thisComparator) => {
                  return rangeComparators.every((rangeComparator) => {
                    return thisComparator.intersects(rangeComparator, options);
                  });
                })
              );
            })
          );
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === 'string') {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === '<0.0.0-0';
    var isAny = (c) => c.value === '';
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      debug('comp', comp, options);
      comp = replaceCarets(comp, options);
      debug('caret', comp);
      comp = replaceTildes(comp, options);
      debug('tildes', comp);
      comp = replaceXRanges(comp, options);
      debug('xrange', comp);
      comp = replaceStars(comp, options);
      debug('stars', comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === 'x' || id === '*';
    var replaceTildes = (comp, options) => {
      return comp
        .trim()
        .split(/\s+/)
        .map((c) => replaceTilde(c, options))
        .join(' ');
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug('tilde', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = '';
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug('replaceTilde pr', pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug('tilde return', ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp
        .trim()
        .split(/\s+/)
        .map((c) => replaceCaret(c, options))
        .join(' ');
    };
    var replaceCaret = (comp, options) => {
      debug('caret', comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? '-0' : '';
      return comp.replace(r, (_, M, m, p, pr) => {
        debug('caret', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = '';
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === '0') {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug('replaceCaret pr', pr);
          if (M === '0') {
            if (m === '0') {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug('no pr');
          if (M === '0') {
            if (m === '0') {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug('caret return', ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug('replaceXRanges', comp, options);
      return comp
        .split(/\s+/)
        .map((c) => replaceXRange(c, options))
        .join(' ');
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug('xRange', comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
          gtlt = '';
        }
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
          if (gtlt === '>' || gtlt === '<') {
            ret = '<0.0.0-0';
          } else {
            ret = '*';
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === '>') {
            gtlt = '>=';
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === '<=') {
            gtlt = '<';
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === '<') {
            pr = '-0';
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug('xRange return', ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug('replaceStars', comp, options);
      return comp.trim().replace(re[t.STAR], '');
    };
    var replaceGTE0 = (comp, options) => {
      debug('replaceGTE0', comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '');
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = '';
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? '-0' : ''}`;
      }
      if (isX(tM)) {
        to = '';
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  },
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  'node_modules/semver/classes/comparator.js'(exports2, module2) {
    var ANY = Symbol('SemVer ANY');
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(' ');
        debug('comparator', comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = '';
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug('comp', this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : '';
        if (this.operator === '=') {
          this.operator = '';
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug('Comparator.test', version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === 'string') {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError('a Comparator is required');
        }
        if (this.operator === '') {
          if (this.value === '') {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
          if (comp.value === '') {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
          return false;
        }
        if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
          return true;
        }
        if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes('=') && comp.operator.includes('=')) {
          return true;
        }
        if (
          cmp(this.semver, '<', comp.semver, options) &&
          this.operator.startsWith('>') &&
          comp.operator.startsWith('<')
        ) {
          return true;
        }
        if (
          cmp(this.semver, '>', comp.semver, options) &&
          this.operator.startsWith('<') &&
          comp.operator.startsWith('>')
        ) {
          return true;
        }
        return false;
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  },
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  'node_modules/semver/functions/satisfies.js'(exports2, module2) {
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies;
  },
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  'node_modules/semver/ranges/to-comparators.js'(exports2, module2) {
    var Range = require_range();
    var toComparators = (range, options) =>
      new Range(range, options).set.map((comp) =>
        comp
          .map((c) => c.value)
          .join(' ')
          .trim()
          .split(' '),
      );
    module2.exports = toComparators;
  },
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  'node_modules/semver/ranges/max-satisfying.js'(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module2.exports = maxSatisfying;
  },
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  'node_modules/semver/ranges/min-satisfying.js'(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module2.exports = minSatisfying;
  },
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  'node_modules/semver/ranges/min-version.js'(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer('0.0.0');
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer('0.0.0-0');
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case '>':
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case '':
            case '>=':
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case '<':
            case '<=':
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module2.exports = minVersion;
  },
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  'node_modules/semver/ranges/valid.js'(exports2, module2) {
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || '*';
      } catch (er) {
        return null;
      }
    };
    module2.exports = validRange;
  },
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  'node_modules/semver/ranges/outside.js'(exports2, module2) {
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case '>':
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = '>';
          ecomp = '>=';
          break;
        case '<':
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = '<';
          ecomp = '<=';
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator('>=0.0.0');
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module2.exports = outside;
  },
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  'node_modules/semver/ranges/gtr.js'(exports2, module2) {
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, '>', options);
    module2.exports = gtr;
  },
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  'node_modules/semver/ranges/ltr.js'(exports2, module2) {
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, '<', options);
    module2.exports = ltr;
  },
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  'node_modules/semver/ranges/intersects.js'(exports2, module2) {
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module2.exports = intersects;
  },
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  'node_modules/semver/ranges/simplify.js'(exports2, module2) {
    var satisfies = require_satisfies();
    var compare = require_compare();
    module2.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push('*');
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(' || ');
      const original = typeof range.raw === 'string' ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  },
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  'node_modules/semver/ranges/subset.js'(exports2, module2) {
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')];
    var minimumVersion = [new Comparator('>=0.0.0')];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === '>' || c.operator === '>=') {
          gt = higherGT(gt, c, options);
        } else if (c.operator === '<' || c.operator === '<=') {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (
        needDomLTPre &&
        needDomLTPre.prerelease.length === 1 &&
        lt.operator === '<' &&
        needDomLTPre.prerelease[0] === 0
      ) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
        hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
        if (gt) {
          if (needDomGTPre) {
            if (
              c.semver.prerelease &&
              c.semver.prerelease.length &&
              c.semver.major === needDomGTPre.major &&
              c.semver.minor === needDomGTPre.minor &&
              c.semver.patch === needDomGTPre.patch
            ) {
              needDomGTPre = false;
            }
          }
          if (c.operator === '>' || c.operator === '>=') {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (
              c.semver.prerelease &&
              c.semver.prerelease.length &&
              c.semver.major === needDomLTPre.major &&
              c.semver.minor === needDomLTPre.minor &&
              c.semver.patch === needDomLTPre.patch
            ) {
              needDomLTPre = false;
            }
          }
          if (c.operator === '<' || c.operator === '<=') {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === '>' && a.operator === '>=' ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === '<' && a.operator === '<=' ? b : a;
    };
    module2.exports = subset;
  },
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  'node_modules/semver/index.js'(exports2, module2) {
    var internalRe = require_re();
    var constants2 = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module2.exports = {
      parse,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants2.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers,
    };
  },
});

// node_modules/micromatch/node_modules/braces/lib/utils.js
var require_utils = __commonJS({
  'node_modules/micromatch/node_modules/braces/lib/utils.js'(exports2) {
    'use strict';
    exports2.isInteger = (num) => {
      if (typeof num === 'number') {
        return Number.isInteger(num);
      }
      if (typeof num === 'string' && num.trim() !== '') {
        return Number.isInteger(Number(num));
      }
      return false;
    };
    exports2.find = (node, type) => node.nodes.find((node2) => node2.type === type);
    exports2.exceedsLimit = (min, max, step = 1, limit) => {
      if (limit === false) return false;
      if (!exports2.isInteger(min) || !exports2.isInteger(max)) return false;
      return (Number(max) - Number(min)) / Number(step) >= limit;
    };
    exports2.escapeNode = (block, n = 0, type) => {
      const node = block.nodes[n];
      if (!node) return;
      if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
        if (node.escaped !== true) {
          node.value = '\\' + node.value;
          node.escaped = true;
        }
      }
    };
    exports2.encloseBrace = (node) => {
      if (node.type !== 'brace') return false;
      if ((node.commas >> (0 + node.ranges)) >> 0 === 0) {
        node.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isInvalidBrace = (block) => {
      if (block.type !== 'brace') return false;
      if (block.invalid === true || block.dollar) return true;
      if ((block.commas >> (0 + block.ranges)) >> 0 === 0) {
        block.invalid = true;
        return true;
      }
      if (block.open !== true || block.close !== true) {
        block.invalid = true;
        return true;
      }
      return false;
    };
    exports2.isOpenOrClose = (node) => {
      if (node.type === 'open' || node.type === 'close') {
        return true;
      }
      return node.open === true || node.close === true;
    };
    exports2.reduce = (nodes) =>
      nodes.reduce((acc, node) => {
        if (node.type === 'text') acc.push(node.value);
        if (node.type === 'range') node.type = 'text';
        return acc;
      }, []);
    exports2.flatten = (...args) => {
      const result = [];
      const flat = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          const ele = arr[i];
          if (Array.isArray(ele)) {
            flat(ele);
            continue;
          }
          if (ele !== void 0) {
            result.push(ele);
          }
        }
        return result;
      };
      flat(args);
      return result;
    };
  },
});

// node_modules/micromatch/node_modules/braces/lib/stringify.js
var require_stringify = __commonJS({
  'node_modules/micromatch/node_modules/braces/lib/stringify.js'(exports2, module2) {
    'use strict';
    var utils = require_utils();
    module2.exports = (ast, options = {}) => {
      const stringify = (node, parent = {}) => {
        const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options.escapeInvalid === true;
        let output = '';
        if (node.value) {
          if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
            return '\\' + node.value;
          }
          return node.value;
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes) {
          for (const child2 of node.nodes) {
            output += stringify(child2);
          }
        }
        return output;
      };
      return stringify(ast);
    };
  },
});

// node_modules/micromatch/node_modules/is-number/index.js
var require_is_number = __commonJS({
  'node_modules/micromatch/node_modules/is-number/index.js'(exports2, module2) {
    'use strict';
    module2.exports = function (num) {
      if (typeof num === 'number') {
        return num - num === 0;
      }
      if (typeof num === 'string' && num.trim() !== '') {
        return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
      }
      return false;
    };
  },
});

// node_modules/micromatch/node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS({
  'node_modules/micromatch/node_modules/to-regex-range/index.js'(exports2, module2) {
    'use strict';
    var isNumber = require_is_number();
    var toRegexRange = (min, max, options) => {
      if (isNumber(min) === false) {
        throw new TypeError('toRegexRange: expected the first argument to be a number');
      }
      if (max === void 0 || min === max) {
        return String(min);
      }
      if (isNumber(max) === false) {
        throw new TypeError('toRegexRange: expected the second argument to be a number.');
      }
      let opts = { relaxZeros: true, ...options };
      if (typeof opts.strictZeros === 'boolean') {
        opts.relaxZeros = opts.strictZeros === false;
      }
      let relax = String(opts.relaxZeros);
      let shorthand = String(opts.shorthand);
      let capture = String(opts.capture);
      let wrap = String(opts.wrap);
      let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;
      if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
        return toRegexRange.cache[cacheKey].result;
      }
      let a = Math.min(min, max);
      let b = Math.max(min, max);
      if (Math.abs(a - b) === 1) {
        let result = min + '|' + max;
        if (opts.capture) {
          return `(${result})`;
        }
        if (opts.wrap === false) {
          return result;
        }
        return `(?:${result})`;
      }
      let isPadded = hasPadding(min) || hasPadding(max);
      let state = { min, max, a, b };
      let positives = [];
      let negatives = [];
      if (isPadded) {
        state.isPadded = isPadded;
        state.maxLen = String(state.max).length;
      }
      if (a < 0) {
        let newMin = b < 0 ? Math.abs(b) : 1;
        negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
        a = state.a = 0;
      }
      if (b >= 0) {
        positives = splitToPatterns(a, b, state, opts);
      }
      state.negatives = negatives;
      state.positives = positives;
      state.result = collatePatterns(negatives, positives, opts);
      if (opts.capture === true) {
        state.result = `(${state.result})`;
      } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
        state.result = `(?:${state.result})`;
      }
      toRegexRange.cache[cacheKey] = state;
      return state.result;
    };
    function collatePatterns(neg, pos, options) {
      let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
      let onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
      let intersected = filterPatterns(neg, pos, '-?', true, options) || [];
      let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
      return subpatterns.join('|');
    }
    function splitToRanges(min, max) {
      let nines = 1;
      let zeros = 1;
      let stop = countNines(min, nines);
      let stops = /* @__PURE__ */ new Set([max]);
      while (min <= stop && stop <= max) {
        stops.add(stop);
        nines += 1;
        stop = countNines(min, nines);
      }
      stop = countZeros(max + 1, zeros) - 1;
      while (min < stop && stop <= max) {
        stops.add(stop);
        zeros += 1;
        stop = countZeros(max + 1, zeros) - 1;
      }
      stops = [...stops];
      stops.sort(compare);
      return stops;
    }
    function rangeToPattern(start, stop, options) {
      if (start === stop) {
        return { pattern: start, count: [], digits: 0 };
      }
      let zipped = zip(start, stop);
      let digits = zipped.length;
      let pattern = '';
      let count = 0;
      for (let i = 0; i < digits; i++) {
        let [startDigit, stopDigit] = zipped[i];
        if (startDigit === stopDigit) {
          pattern += startDigit;
        } else if (startDigit !== '0' || stopDigit !== '9') {
          pattern += toCharacterClass(startDigit, stopDigit, options);
        } else {
          count++;
        }
      }
      if (count) {
        pattern += options.shorthand === true ? '\\d' : '[0-9]';
      }
      return { pattern, count: [count], digits };
    }
    function splitToPatterns(min, max, tok, options) {
      let ranges = splitToRanges(min, max);
      let tokens = [];
      let start = min;
      let prev;
      for (let i = 0; i < ranges.length; i++) {
        let max2 = ranges[i];
        let obj = rangeToPattern(String(start), String(max2), options);
        let zeros = '';
        if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
          if (prev.count.length > 1) {
            prev.count.pop();
          }
          prev.count.push(obj.count[0]);
          prev.string = prev.pattern + toQuantifier(prev.count);
          start = max2 + 1;
          continue;
        }
        if (tok.isPadded) {
          zeros = padZeros(max2, tok, options);
        }
        obj.string = zeros + obj.pattern + toQuantifier(obj.count);
        tokens.push(obj);
        start = max2 + 1;
        prev = obj;
      }
      return tokens;
    }
    function filterPatterns(arr, comparison, prefix, intersection, options) {
      let result = [];
      for (let ele of arr) {
        let { string } = ele;
        if (!intersection && !contains(comparison, 'string', string)) {
          result.push(prefix + string);
        }
        if (intersection && contains(comparison, 'string', string)) {
          result.push(prefix + string);
        }
      }
      return result;
    }
    function zip(a, b) {
      let arr = [];
      for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
      return arr;
    }
    function compare(a, b) {
      return a > b ? 1 : b > a ? -1 : 0;
    }
    function contains(arr, key, val) {
      return arr.some((ele) => ele[key] === val);
    }
    function countNines(min, len) {
      return Number(String(min).slice(0, -len) + '9'.repeat(len));
    }
    function countZeros(integer, zeros) {
      return integer - (integer % Math.pow(10, zeros));
    }
    function toQuantifier(digits) {
      let [start = 0, stop = ''] = digits;
      if (stop || start > 1) {
        return `{${start + (stop ? ',' + stop : '')}}`;
      }
      return '';
    }
    function toCharacterClass(a, b, options) {
      return `[${a}${b - a === 1 ? '' : '-'}${b}]`;
    }
    function hasPadding(str) {
      return /^-?(0+)\d/.test(str);
    }
    function padZeros(value, tok, options) {
      if (!tok.isPadded) {
        return value;
      }
      let diff = Math.abs(tok.maxLen - String(value).length);
      let relax = options.relaxZeros !== false;
      switch (diff) {
        case 0:
          return '';
        case 1:
          return relax ? '0?' : '0';
        case 2:
          return relax ? '0{0,2}' : '00';
        default: {
          return relax ? `0{0,${diff}}` : `0{${diff}}`;
        }
      }
    }
    toRegexRange.cache = {};
    toRegexRange.clearCache = () => (toRegexRange.cache = {});
    module2.exports = toRegexRange;
  },
});

// node_modules/micromatch/node_modules/fill-range/index.js
var require_fill_range = __commonJS({
  'node_modules/micromatch/node_modules/fill-range/index.js'(exports2, module2) {
    'use strict';
    var util = require('util');
    var toRegexRange = require_to_regex_range();
    var isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);
    var transform = (toNumber) => {
      return (value) => (toNumber === true ? Number(value) : String(value));
    };
    var isValidValue = (value) => {
      return typeof value === 'number' || (typeof value === 'string' && value !== '');
    };
    var isNumber = (num) => Number.isInteger(+num);
    var zeros = (input) => {
      let value = `${input}`;
      let index = -1;
      if (value[0] === '-') value = value.slice(1);
      if (value === '0') return false;
      while (value[++index] === '0');
      return index > 0;
    };
    var stringify = (start, end, options) => {
      if (typeof start === 'string' || typeof end === 'string') {
        return true;
      }
      return options.stringify === true;
    };
    var pad = (input, maxLength, toNumber) => {
      if (maxLength > 0) {
        let dash = input[0] === '-' ? '-' : '';
        if (dash) input = input.slice(1);
        input = dash + input.padStart(dash ? maxLength - 1 : maxLength, '0');
      }
      if (toNumber === false) {
        return String(input);
      }
      return input;
    };
    var toMaxLen = (input, maxLength) => {
      let negative = input[0] === '-' ? '-' : '';
      if (negative) {
        input = input.slice(1);
        maxLength--;
      }
      while (input.length < maxLength) input = '0' + input;
      return negative ? '-' + input : input;
    };
    var toSequence = (parts, options, maxLen) => {
      parts.negatives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      parts.positives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      let prefix = options.capture ? '' : '?:';
      let positives = '';
      let negatives = '';
      let result;
      if (parts.positives.length) {
        positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join('|');
      }
      if (parts.negatives.length) {
        negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join('|')})`;
      }
      if (positives && negatives) {
        result = `${positives}|${negatives}`;
      } else {
        result = positives || negatives;
      }
      if (options.wrap) {
        return `(${prefix}${result})`;
      }
      return result;
    };
    var toRange = (a, b, isNumbers, options) => {
      if (isNumbers) {
        return toRegexRange(a, b, { wrap: false, ...options });
      }
      let start = String.fromCharCode(a);
      if (a === b) return start;
      let stop = String.fromCharCode(b);
      return `[${start}-${stop}]`;
    };
    var toRegex = (start, end, options) => {
      if (Array.isArray(start)) {
        let wrap = options.wrap === true;
        let prefix = options.capture ? '' : '?:';
        return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
      }
      return toRegexRange(start, end, options);
    };
    var rangeError = (...args) => {
      return new RangeError('Invalid range arguments: ' + util.inspect(...args));
    };
    var invalidRange = (start, end, options) => {
      if (options.strictRanges === true) throw rangeError([start, end]);
      return [];
    };
    var invalidStep = (step, options) => {
      if (options.strictRanges === true) {
        throw new TypeError(`Expected step "${step}" to be a number`);
      }
      return [];
    };
    var fillNumbers = (start, end, step = 1, options = {}) => {
      let a = Number(start);
      let b = Number(end);
      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        if (options.strictRanges === true) throw rangeError([start, end]);
        return [];
      }
      if (a === 0) a = 0;
      if (b === 0) b = 0;
      let descending = a > b;
      let startString = String(start);
      let endString = String(end);
      let stepString = String(step);
      step = Math.max(Math.abs(step), 1);
      let padded = zeros(startString) || zeros(endString) || zeros(stepString);
      let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
      let toNumber = padded === false && stringify(start, end, options) === false;
      let format = options.transform || transform(toNumber);
      if (options.toRegex && step === 1) {
        return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
      }
      let parts = { negatives: [], positives: [] };
      let push = (num) => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        if (options.toRegex === true && step > 1) {
          push(a);
        } else {
          range.push(pad(format(a, index), maxLen, toNumber));
        }
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return step > 1 ? toSequence(parts, options, maxLen) : toRegex(range, null, { wrap: false, ...options });
      }
      return range;
    };
    var fillLetters = (start, end, step = 1, options = {}) => {
      if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
        return invalidRange(start, end, options);
      }
      let format = options.transform || ((val) => String.fromCharCode(val));
      let a = `${start}`.charCodeAt(0);
      let b = `${end}`.charCodeAt(0);
      let descending = a > b;
      let min = Math.min(a, b);
      let max = Math.max(a, b);
      if (options.toRegex && step === 1) {
        return toRange(min, max, false, options);
      }
      let range = [];
      let index = 0;
      while (descending ? a >= b : a <= b) {
        range.push(format(a, index));
        a = descending ? a - step : a + step;
        index++;
      }
      if (options.toRegex === true) {
        return toRegex(range, null, { wrap: false, options });
      }
      return range;
    };
    var fill = (start, end, step, options = {}) => {
      if (end == null && isValidValue(start)) {
        return [start];
      }
      if (!isValidValue(start) || !isValidValue(end)) {
        return invalidRange(start, end, options);
      }
      if (typeof step === 'function') {
        return fill(start, end, 1, { transform: step });
      }
      if (isObject(step)) {
        return fill(start, end, 0, step);
      }
      let opts = { ...options };
      if (opts.capture === true) opts.wrap = true;
      step = step || opts.step || 1;
      if (!isNumber(step)) {
        if (step != null && !isObject(step)) return invalidStep(step, opts);
        return fill(start, end, 1, step);
      }
      if (isNumber(start) && isNumber(end)) {
        return fillNumbers(start, end, step, opts);
      }
      return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
    };
    module2.exports = fill;
  },
});

// node_modules/micromatch/node_modules/braces/lib/compile.js
var require_compile = __commonJS({
  'node_modules/micromatch/node_modules/braces/lib/compile.js'(exports2, module2) {
    'use strict';
    var fill = require_fill_range();
    var utils = require_utils();
    var compile = (ast, options = {}) => {
      const walk = (node, parent = {}) => {
        const invalidBlock = utils.isInvalidBrace(parent);
        const invalidNode = node.invalid === true && options.escapeInvalid === true;
        const invalid = invalidBlock === true || invalidNode === true;
        const prefix = options.escapeInvalid === true ? '\\' : '';
        let output = '';
        if (node.isOpen === true) {
          return prefix + node.value;
        }
        if (node.isClose === true) {
          console.log('node.isClose', prefix, node.value);
          return prefix + node.value;
        }
        if (node.type === 'open') {
          return invalid ? prefix + node.value : '(';
        }
        if (node.type === 'close') {
          return invalid ? prefix + node.value : ')';
        }
        if (node.type === 'comma') {
          return node.prev.type === 'comma' ? '' : invalid ? node.value : '|';
        }
        if (node.value) {
          return node.value;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          const range = fill(...args, { ...options, wrap: false, toRegex: true, strictZeros: true });
          if (range.length !== 0) {
            return args.length > 1 && range.length > 1 ? `(${range})` : range;
          }
        }
        if (node.nodes) {
          for (const child2 of node.nodes) {
            output += walk(child2, node);
          }
        }
        return output;
      };
      return walk(ast);
    };
    module2.exports = compile;
  },
});

// node_modules/micromatch/node_modules/braces/lib/expand.js
var require_expand = __commonJS({
  'node_modules/micromatch/node_modules/braces/lib/expand.js'(exports2, module2) {
    'use strict';
    var fill = require_fill_range();
    var stringify = require_stringify();
    var utils = require_utils();
    var append = (queue = '', stash = '', enclose = false) => {
      const result = [];
      queue = [].concat(queue);
      stash = [].concat(stash);
      if (!stash.length) return queue;
      if (!queue.length) {
        return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
      }
      for (const item of queue) {
        if (Array.isArray(item)) {
          for (const value of item) {
            result.push(append(value, stash, enclose));
          }
        } else {
          for (let ele of stash) {
            if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
            result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
          }
        }
      }
      return utils.flatten(result);
    };
    var expand = (ast, options = {}) => {
      const rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
      const walk = (node, parent = {}) => {
        node.queue = [];
        let p = parent;
        let q = parent.queue;
        while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
          p = p.parent;
          q = p.queue;
        }
        if (node.invalid || node.dollar) {
          q.push(append(q.pop(), stringify(node, options)));
          return;
        }
        if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
          q.push(append(q.pop(), ['{}']));
          return;
        }
        if (node.nodes && node.ranges > 0) {
          const args = utils.reduce(node.nodes);
          if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
            throw new RangeError(
              'expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.',
            );
          }
          let range = fill(...args, options);
          if (range.length === 0) {
            range = stringify(node, options);
          }
          q.push(append(q.pop(), range));
          node.nodes = [];
          return;
        }
        const enclose = utils.encloseBrace(node);
        let queue = node.queue;
        let block = node;
        while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
          block = block.parent;
          queue = block.queue;
        }
        for (let i = 0; i < node.nodes.length; i++) {
          const child2 = node.nodes[i];
          if (child2.type === 'comma' && node.type === 'brace') {
            if (i === 1) queue.push('');
            queue.push('');
            continue;
          }
          if (child2.type === 'close') {
            q.push(append(q.pop(), queue, enclose));
            continue;
          }
          if (child2.value && child2.type !== 'open') {
            queue.push(append(queue.pop(), child2.value));
            continue;
          }
          if (child2.nodes) {
            walk(child2, node);
          }
        }
        return queue;
      };
      return utils.flatten(walk(ast));
    };
    module2.exports = expand;
  },
});

// node_modules/micromatch/node_modules/braces/lib/constants.js
var require_constants2 = __commonJS({
  'node_modules/micromatch/node_modules/braces/lib/constants.js'(exports2, module2) {
    'use strict';
    module2.exports = {
      MAX_LENGTH: 1e4,
      // Digits
      CHAR_0: '0',
      /* 0 */
      CHAR_9: '9',
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 'A',
      /* A */
      CHAR_LOWERCASE_A: 'a',
      /* a */
      CHAR_UPPERCASE_Z: 'Z',
      /* Z */
      CHAR_LOWERCASE_Z: 'z',
      /* z */
      CHAR_LEFT_PARENTHESES: '(',
      /* ( */
      CHAR_RIGHT_PARENTHESES: ')',
      /* ) */
      CHAR_ASTERISK: '*',
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: '&',
      /* & */
      CHAR_AT: '@',
      /* @ */
      CHAR_BACKSLASH: '\\',
      /* \ */
      CHAR_BACKTICK: '`',
      /* ` */
      CHAR_CARRIAGE_RETURN: '\r',
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: '^',
      /* ^ */
      CHAR_COLON: ':',
      /* : */
      CHAR_COMMA: ',',
      /* , */
      CHAR_DOLLAR: '$',
      /* . */
      CHAR_DOT: '.',
      /* . */
      CHAR_DOUBLE_QUOTE: '"',
      /* " */
      CHAR_EQUAL: '=',
      /* = */
      CHAR_EXCLAMATION_MARK: '!',
      /* ! */
      CHAR_FORM_FEED: '\f',
      /* \f */
      CHAR_FORWARD_SLASH: '/',
      /* / */
      CHAR_HASH: '#',
      /* # */
      CHAR_HYPHEN_MINUS: '-',
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: '<',
      /* < */
      CHAR_LEFT_CURLY_BRACE: '{',
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: '[',
      /* [ */
      CHAR_LINE_FEED: '\n',
      /* \n */
      CHAR_NO_BREAK_SPACE: '\xA0',
      /* \u00A0 */
      CHAR_PERCENT: '%',
      /* % */
      CHAR_PLUS: '+',
      /* + */
      CHAR_QUESTION_MARK: '?',
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: '>',
      /* > */
      CHAR_RIGHT_CURLY_BRACE: '}',
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: ']',
      /* ] */
      CHAR_SEMICOLON: ';',
      /* ; */
      CHAR_SINGLE_QUOTE: "'",
      /* ' */
      CHAR_SPACE: ' ',
      /*   */
      CHAR_TAB: '	',
      /* \t */
      CHAR_UNDERSCORE: '_',
      /* _ */
      CHAR_VERTICAL_LINE: '|',
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF',
      /* \uFEFF */
    };
  },
});

// node_modules/micromatch/node_modules/braces/lib/parse.js
var require_parse2 = __commonJS({
  'node_modules/micromatch/node_modules/braces/lib/parse.js'(exports2, module2) {
    'use strict';
    var stringify = require_stringify();
    var {
      MAX_LENGTH,
      CHAR_BACKSLASH,
      /* \ */
      CHAR_BACKTICK,
      /* ` */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_RIGHT_SQUARE_BRACKET,
      /* ] */
      CHAR_DOUBLE_QUOTE,
      /* " */
      CHAR_SINGLE_QUOTE,
      /* ' */
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE,
    } = require_constants2();
    var parse = (input, options = {}) => {
      if (typeof input !== 'string') {
        throw new TypeError('Expected a string');
      }
      const opts = options || {};
      const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      if (input.length > max) {
        throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
      }
      const ast = { type: 'root', input, nodes: [] };
      const stack = [ast];
      let block = ast;
      let prev = ast;
      let brackets = 0;
      const length = input.length;
      let index = 0;
      let depth = 0;
      let value;
      const advance = () => input[index++];
      const push = (node) => {
        if (node.type === 'text' && prev.type === 'dot') {
          prev.type = 'text';
        }
        if (prev && prev.type === 'text' && node.type === 'text') {
          prev.value += node.value;
          return;
        }
        block.nodes.push(node);
        node.parent = block;
        node.prev = prev;
        prev = node;
        return node;
      };
      push({ type: 'bos' });
      while (index < length) {
        block = stack[stack.length - 1];
        value = advance();
        if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
          continue;
        }
        if (value === CHAR_BACKSLASH) {
          push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
          continue;
        }
        if (value === CHAR_RIGHT_SQUARE_BRACKET) {
          push({ type: 'text', value: '\\' + value });
          continue;
        }
        if (value === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          let next;
          while (index < length && (next = advance())) {
            value += next;
            if (next === CHAR_LEFT_SQUARE_BRACKET) {
              brackets++;
              continue;
            }
            if (next === CHAR_BACKSLASH) {
              value += advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              brackets--;
              if (brackets === 0) {
                break;
              }
            }
          }
          push({ type: 'text', value });
          continue;
        }
        if (value === CHAR_LEFT_PARENTHESES) {
          block = push({ type: 'paren', nodes: [] });
          stack.push(block);
          push({ type: 'text', value });
          continue;
        }
        if (value === CHAR_RIGHT_PARENTHESES) {
          if (block.type !== 'paren') {
            push({ type: 'text', value });
            continue;
          }
          block = stack.pop();
          push({ type: 'text', value });
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
          const open = value;
          let next;
          if (options.keepQuotes !== true) {
            value = '';
          }
          while (index < length && (next = advance())) {
            if (next === CHAR_BACKSLASH) {
              value += next + advance();
              continue;
            }
            if (next === open) {
              if (options.keepQuotes === true) value += next;
              break;
            }
            value += next;
          }
          push({ type: 'text', value });
          continue;
        }
        if (value === CHAR_LEFT_CURLY_BRACE) {
          depth++;
          const dollar = (prev.value && prev.value.slice(-1) === '$') || block.dollar === true;
          const brace = {
            type: 'brace',
            open: true,
            close: false,
            dollar,
            depth,
            commas: 0,
            ranges: 0,
            nodes: [],
          };
          block = push(brace);
          stack.push(block);
          push({ type: 'open', value });
          continue;
        }
        if (value === CHAR_RIGHT_CURLY_BRACE) {
          if (block.type !== 'brace') {
            push({ type: 'text', value });
            continue;
          }
          const type = 'close';
          block = stack.pop();
          block.close = true;
          push({ type, value });
          depth--;
          block = stack[stack.length - 1];
          continue;
        }
        if (value === CHAR_COMMA && depth > 0) {
          if (block.ranges > 0) {
            block.ranges = 0;
            const open = block.nodes.shift();
            block.nodes = [open, { type: 'text', value: stringify(block) }];
          }
          push({ type: 'comma', value });
          block.commas++;
          continue;
        }
        if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
          const siblings = block.nodes;
          if (depth === 0 || siblings.length === 0) {
            push({ type: 'text', value });
            continue;
          }
          if (prev.type === 'dot') {
            block.range = [];
            prev.value += value;
            prev.type = 'range';
            if (block.nodes.length !== 3 && block.nodes.length !== 5) {
              block.invalid = true;
              block.ranges = 0;
              prev.type = 'text';
              continue;
            }
            block.ranges++;
            block.args = [];
            continue;
          }
          if (prev.type === 'range') {
            siblings.pop();
            const before = siblings[siblings.length - 1];
            before.value += prev.value + value;
            prev = before;
            block.ranges--;
            continue;
          }
          push({ type: 'dot', value });
          continue;
        }
        push({ type: 'text', value });
      }
      do {
        block = stack.pop();
        if (block.type !== 'root') {
          block.nodes.forEach((node) => {
            if (!node.nodes) {
              if (node.type === 'open') node.isOpen = true;
              if (node.type === 'close') node.isClose = true;
              if (!node.nodes) node.type = 'text';
              node.invalid = true;
            }
          });
          const parent = stack[stack.length - 1];
          const index2 = parent.nodes.indexOf(block);
          parent.nodes.splice(index2, 1, ...block.nodes);
        }
      } while (stack.length > 0);
      push({ type: 'eos' });
      return ast;
    };
    module2.exports = parse;
  },
});

// node_modules/micromatch/node_modules/braces/index.js
var require_braces = __commonJS({
  'node_modules/micromatch/node_modules/braces/index.js'(exports2, module2) {
    'use strict';
    var stringify = require_stringify();
    var compile = require_compile();
    var expand = require_expand();
    var parse = require_parse2();
    var braces = (input, options = {}) => {
      let output = [];
      if (Array.isArray(input)) {
        for (const pattern of input) {
          const result = braces.create(pattern, options);
          if (Array.isArray(result)) {
            output.push(...result);
          } else {
            output.push(result);
          }
        }
      } else {
        output = [].concat(braces.create(input, options));
      }
      if (options && options.expand === true && options.nodupes === true) {
        output = [...new Set(output)];
      }
      return output;
    };
    braces.parse = (input, options = {}) => parse(input, options);
    braces.stringify = (input, options = {}) => {
      if (typeof input === 'string') {
        return stringify(braces.parse(input, options), options);
      }
      return stringify(input, options);
    };
    braces.compile = (input, options = {}) => {
      if (typeof input === 'string') {
        input = braces.parse(input, options);
      }
      return compile(input, options);
    };
    braces.expand = (input, options = {}) => {
      if (typeof input === 'string') {
        input = braces.parse(input, options);
      }
      let result = expand(input, options);
      if (options.noempty === true) {
        result = result.filter(Boolean);
      }
      if (options.nodupes === true) {
        result = [...new Set(result)];
      }
      return result;
    };
    braces.create = (input, options = {}) => {
      if (input === '' || input.length < 3) {
        return [input];
      }
      return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
    };
    module2.exports = braces;
  },
});

// node_modules/picomatch/lib/constants.js
var require_constants3 = __commonJS({
  'node_modules/picomatch/lib/constants.js'(exports2, module2) {
    'use strict';
    var path9 = require('path');
    var WIN_SLASH = '\\\\/';
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DOT_LITERAL = '\\.';
    var PLUS_LITERAL = '\\+';
    var QMARK_LITERAL = '\\?';
    var SLASH_LITERAL = '\\/';
    var ONE_CHAR = '(?=.)';
    var QMARK = '[^/]';
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR,
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
    };
    var POSIX_REGEX_SOURCE = {
      alnum: 'a-zA-Z0-9',
      alpha: 'a-zA-Z',
      ascii: '\\x00-\\x7F',
      blank: ' \\t',
      cntrl: '\\x00-\\x1F\\x7F',
      digit: '0-9',
      graph: '\\x21-\\x7E',
      lower: 'a-z',
      print: '\\x20-\\x7E ',
      punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
      space: ' \\t\\r\\n\\v\\f',
      upper: 'A-Z',
      word: 'A-Za-z0-9_',
      xdigit: 'A-Fa-f0-9',
    };
    module2.exports = {
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        '***': '*',
        '**/**': '**',
        '**/**/**': '**',
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      SEP: path9.sep,
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
          '?': { type: 'qmark', open: '(?:', close: ')?' },
          '+': { type: 'plus', open: '(?:', close: ')+' },
          '*': { type: 'star', open: '(?:', close: ')*' },
          '@': { type: 'at', open: '(?:', close: ')' },
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      },
    };
  },
});

// node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS({
  'node_modules/picomatch/lib/utils.js'(exports2) {
    'use strict';
    var path9 = require('path');
    var win32 = process.platform === 'win32';
    var { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } =
      require_constants3();
    exports2.isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);
    exports2.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports2.isRegexChar = (str) => str.length === 1 && exports2.hasRegexChars(str);
    exports2.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
    exports2.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, '/');
    exports2.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === '\\' ? '' : match;
      });
    };
    exports2.supportsLookbehinds = () => {
      const segs = process.version.slice(1).split('.').map(Number);
      if ((segs.length === 3 && segs[0] >= 9) || (segs[0] === 8 && segs[1] >= 10)) {
        return true;
      }
      return false;
    };
    exports2.isWindows = (options) => {
      if (options && typeof options.windows === 'boolean') {
        return options.windows;
      }
      return win32 === true || path9.sep === '\\';
    };
    exports2.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === '\\') return exports2.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };
    exports2.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith('./')) {
        output = output.slice(2);
        state.prefix = './';
      }
      return output;
    };
    exports2.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? '' : '^';
      const append = options.contains ? '' : '$';
      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
  },
});

// node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  'node_modules/picomatch/lib/scan.js'(exports2, module2) {
    'use strict';
    var utils = require_utils2();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET,
      /* ] */
    } = require_constants3();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan = (input, options) => {
      const opts = options || {};
      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: '', depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: '', depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar =
            code === CHAR_PLUS ||
            code === CHAR_AT ||
            code === CHAR_ASTERISK ||
            code === CHAR_QUESTION_MARK ||
            code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = '';
      let glob = '';
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = '';
        glob = str;
      } else {
        base = str;
      }
      if (base && base !== '' && base !== '/' && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob,
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== '') {
            parts.push(value);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module2.exports = scan;
  },
});

// node_modules/picomatch/lib/parse.js
var require_parse3 = __commonJS({
  'node_modules/picomatch/lib/parse.js'(exports2, module2) {
    'use strict';
    var constants2 = require_constants3();
    var utils = require_utils2();
    var { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } =
      constants2;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === 'function') {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value = `[${args.join('-')}]`;
      try {
        new RegExp(value);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join('..');
      }
      return value;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var parse = (input, options) => {
      if (typeof input !== 'string') {
        throw new TypeError('Expected a string');
      }
      input = REPLACEMENTS[input] || input;
      const opts = { ...options };
      const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: 'bos', value: '', output: opts.prepend || '' };
      const tokens = [bos];
      const capture = opts.capture ? '' : '?:';
      const win32 = utils.isWindows(options);
      const PLATFORM_CHARS = constants2.globChars(win32);
      const EXTGLOB_CHARS = constants2.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR,
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? '' : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === 'boolean') {
        opts.noextglob = opts.noext;
      }
      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: '',
        output: '',
        prefix: '',
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens,
      };
      input = utils.removePrefix(input, state);
      len = input.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;
      const eos = () => state.index === len - 1;
      const peek = (state.peek = (n = 1) => input[state.index + n]);
      const advance = (state.advance = () => input[++state.index] || '');
      const remaining = () => input.slice(state.index + 1);
      const consume = (value2 = '', num = 0) => {
        state.consumed += value2;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === 'globstar') {
          const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
          const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));
          if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = 'star';
            prev.value = '*';
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== 'paren') {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === 'text' && tok.type === 'text') {
          prev.value += tok.value;
          prev.output = (prev.output || '') + tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value2) => {
        const token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: '' };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts.capture ? '(' : '') + token.open;
        increment('parens');
        push({ type, value: value2, output: state.output ? '' : ONE_CHAR });
        push({ type: 'paren', extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        let output = token.close + (opts.capture ? ')' : '');
        let rest;
        if (token.type === 'negate') {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === 'bos') {
            state.negatedExtglob = true;
          }
        }
        push({ type: 'paren', extglob: true, value, output });
        decrement('parens');
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === '\\') {
            backslashes = true;
            return m;
          }
          if (first === '?') {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : '');
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
            }
            return QMARK.repeat(chars.length);
          }
          if (first === '.') {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === '*') {
            if (esc) {
              return esc + first + (rest ? star : '');
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, '');
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? '\\\\' : m ? '\\' : '';
            });
          }
        }
        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value = advance();
        if (value === '\0') {
          continue;
        }
        if (value === '\\') {
          const next = peek();
          if (next === '/' && opts.bash !== true) {
            continue;
          }
          if (next === '.' || next === ';') {
            continue;
          }
          if (!next) {
            value += '\\';
            push({ type: 'text', value });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += '\\';
            }
          }
          if (opts.unescape === true) {
            value = advance();
          } else {
            value += advance();
          }
          if (state.brackets === 0) {
            push({ type: 'text', value });
            continue;
          }
        }
        if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
          if (opts.posix !== false && value === ':') {
            const inner = prev.value.slice(1);
            if (inner.includes('[')) {
              prev.posix = true;
              if (inner.includes(':')) {
                const idx = prev.value.lastIndexOf('[');
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
            value = `\\${value}`;
          }
          if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
            value = `\\${value}`;
          }
          if (opts.posix === true && value === '!' && prev.value === '[') {
            value = '^';
          }
          prev.value += value;
          append({ value });
          continue;
        }
        if (state.quotes === 1 && value !== '"') {
          value = utils.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }
        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: 'text', value });
          }
          continue;
        }
        if (value === '(') {
          increment('parens');
          push({ type: 'paren', value });
          continue;
        }
        if (value === ')') {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError('opening', '('));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
          decrement('parens');
          continue;
        }
        if (value === '[') {
          if (opts.nobracket === true || !remaining().includes(']')) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError('closing', ']'));
            }
            value = `\\${value}`;
          } else {
            increment('brackets');
          }
          push({ type: 'bracket', value });
          continue;
        }
        if (value === ']') {
          if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
            push({ type: 'text', value, output: `\\${value}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError('opening', '['));
            }
            push({ type: 'text', value, output: `\\${value}` });
            continue;
          }
          decrement('brackets');
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
            value = `/${value}`;
          }
          prev.value += value;
          append({ value });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value === '{' && opts.nobrace !== true) {
          increment('braces');
          const open = {
            type: 'brace',
            value,
            output: '(',
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length,
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value === '}') {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: 'text', value, output: value });
            continue;
          }
          let output = ')';
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === 'brace') {
                break;
              }
              if (arr[i].type !== 'dots') {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = '\\{';
            value = output = '\\}';
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: 'brace', value, output });
          decrement('braces');
          braces.pop();
          continue;
        }
        if (value === '|') {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: 'text', value });
          continue;
        }
        if (value === ',') {
          let output = value;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === 'braces') {
            brace.comma = true;
            output = '|';
          }
          push({ type: 'comma', value, output });
          continue;
        }
        if (value === '/') {
          if (prev.type === 'dot' && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = '';
            state.output = '';
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: 'slash', value, output: SLASH_LITERAL });
          continue;
        }
        if (value === '.') {
          if (state.braces > 0 && prev.type === 'dot') {
            if (prev.value === '.') prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = 'dots';
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
            push({ type: 'text', value, output: DOT_LITERAL });
            continue;
          }
          push({ type: 'dot', value, output: DOT_LITERAL });
          continue;
        }
        if (value === '?') {
          const isGroup = prev && prev.value === '(';
          if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
            extglobOpen('qmark', value);
            continue;
          }
          if (prev && prev.type === 'paren') {
            const next = peek();
            let output = value;
            if (next === '<' && !utils.supportsLookbehinds()) {
              throw new Error('Node.js v10 or higher is required for regex lookbehinds');
            }
            if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
              output = `\\${value}`;
            }
            push({ type: 'text', value, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
            push({ type: 'qmark', value, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: 'qmark', value, output: QMARK });
          continue;
        }
        if (value === '!') {
          if (opts.noextglob !== true && peek() === '(') {
            if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
              extglobOpen('negate', value);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value === '+') {
          if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
            extglobOpen('plus', value);
            continue;
          }
          if ((prev && prev.value === '(') || opts.regex === false) {
            push({ type: 'plus', value, output: PLUS_LITERAL });
            continue;
          }
          if (
            (prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) ||
            state.parens > 0
          ) {
            push({ type: 'plus', value });
            continue;
          }
          push({ type: 'plus', value: PLUS_LITERAL });
          continue;
        }
        if (value === '@') {
          if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
            push({ type: 'at', extglob: true, value, output: '' });
            continue;
          }
          push({ type: 'text', value });
          continue;
        }
        if (value !== '*') {
          if (value === '$' || value === '^') {
            value = `\\${value}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }
          push({ type: 'text', value });
          continue;
        }
        if (prev && (prev.type === 'globstar' || prev.star === true)) {
          prev.type = 'star';
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen('star', value);
          continue;
        }
        if (prev.type === 'star') {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === 'slash' || prior.type === 'bos';
          const afterStar = before && (before.type === 'star' || before.type === 'globstar');
          if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
            push({ type: 'star', value, output: '' });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
          const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
          if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
            push({ type: 'star', value, output: '' });
            continue;
          }
          while (rest.slice(0, 3) === '/**') {
            const after = input[state.index + 4];
            if (after && after !== '/') {
              break;
            }
            rest = rest.slice(3);
            consume('/**', 3);
          }
          if (prior.type === 'bos' && eos()) {
            prev.type = 'globstar';
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }
          if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = 'globstar';
            prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }
          if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
            const end = rest[1] !== void 0 ? '|$' : '';
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = 'globstar';
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: 'slash', value: '/', output: '' });
            continue;
          }
          if (prior.type === 'bos' && rest[0] === '/') {
            prev.type = 'globstar';
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: 'slash', value: '/', output: '' });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = 'globstar';
          prev.output = globstar(opts);
          prev.value += value;
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        const token = { type: 'star', value, output: star };
        if (opts.bash === true) {
          token.output = '.*?';
          if (prev.type === 'bos' || prev.type === 'slash') {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
          if (prev.type === 'dot') {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== '*') {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
        state.output = utils.escapeLast(state.output, '[');
        decrement('brackets');
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
        state.output = utils.escapeLast(state.output, '(');
        decrement('parens');
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
        state.output = utils.escapeLast(state.output, '{');
        decrement('braces');
      }
      if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
        push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = '';
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input = REPLACEMENTS[input] || input;
      const win32 = utils.isWindows(options);
      const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } =
        constants2.globChars(win32);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? '' : '?:';
      const state = { negated: false, prefix: '' };
      let star = opts.bash === true ? '.*?' : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case '*':
            return `${nodot}${ONE_CHAR}${star}`;
          case '.*':
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case '*.*':
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case '*/*':
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case '**':
            return nodot + globstar(opts);
          case '**/*':
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case '**/*.*':
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case '**/.*':
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module2.exports = parse;
  },
});

// node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  'node_modules/picomatch/lib/picomatch.js'(exports2, module2) {
    'use strict';
    var path9 = require('path');
    var scan = require_scan();
    var parse = require_parse3();
    var utils = require_utils2();
    var constants2 = require_constants3();
    var isObject = (val) => val && typeof val === 'object' && !Array.isArray(val);
    var picomatch = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input) => picomatch(input, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === '' || (typeof glob !== 'string' && !isState)) {
        throw new TypeError('Expected pattern to be a non-empty string');
      }
      const opts = options || {};
      const posix = utils.isWindows(options);
      const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };
        if (typeof opts.onResult === 'function') {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input)) {
          if (typeof opts.onIgnore === 'function') {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === 'function') {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== 'string') {
        throw new TypeError('Expected input to be a string');
      }
      if (input === '') {
        return { isMatch: false, output: '' };
      }
      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = match && format ? format(input) : input;
      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
      const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
      return regex.test(path9.basename(input));
    };
    picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    picomatch.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
      return parse(pattern, { ...options, fastpaths: false });
    };
    picomatch.scan = (input, options) => scan(input, options);
    picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? '' : '^';
      const append = opts.contains ? '' : '$';
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== 'string') {
        throw new TypeError('Expected a non-empty string');
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
        parsed.output = parse.fastpaths(input, options);
      }
      if (!parsed.output) {
        parsed = parse(input, options);
      }
      return picomatch.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch.constants = constants2;
    module2.exports = picomatch;
  },
});

// node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  'node_modules/picomatch/index.js'(exports2, module2) {
    'use strict';
    module2.exports = require_picomatch();
  },
});

// node_modules/micromatch/index.js
var require_micromatch = __commonJS({
  'node_modules/micromatch/index.js'(exports2, module2) {
    'use strict';
    var util = require('util');
    var braces = require_braces();
    var picomatch = require_picomatch2();
    var utils = require_utils2();
    var isEmptyString = (v) => v === '' || v === './';
    var hasBraces = (v) => {
      const index = v.indexOf('{');
      return index > -1 && v.indexOf('}', index) > -1;
    };
    var micromatch = (list, patterns, options) => {
      patterns = [].concat(patterns);
      list = [].concat(list);
      let omit = /* @__PURE__ */ new Set();
      let keep = /* @__PURE__ */ new Set();
      let items = /* @__PURE__ */ new Set();
      let negatives = 0;
      let onResult = (state) => {
        items.add(state.output);
        if (options && options.onResult) {
          options.onResult(state);
        }
      };
      for (let i = 0; i < patterns.length; i++) {
        let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
        let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
        if (negated) negatives++;
        for (let item of list) {
          let matched = isMatch(item, true);
          let match = negated ? !matched.isMatch : matched.isMatch;
          if (!match) continue;
          if (negated) {
            omit.add(matched.output);
          } else {
            omit.delete(matched.output);
            keep.add(matched.output);
          }
        }
      }
      let result = negatives === patterns.length ? [...items] : [...keep];
      let matches = result.filter((item) => !omit.has(item));
      if (options && matches.length === 0) {
        if (options.failglob === true) {
          throw new Error(`No matches found for "${patterns.join(', ')}"`);
        }
        if (options.nonull === true || options.nullglob === true) {
          return options.unescape ? patterns.map((p) => p.replace(/\\/g, '')) : patterns;
        }
      }
      return matches;
    };
    micromatch.match = micromatch;
    micromatch.matcher = (pattern, options) => picomatch(pattern, options);
    micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
    micromatch.any = micromatch.isMatch;
    micromatch.not = (list, patterns, options = {}) => {
      patterns = [].concat(patterns).map(String);
      let result = /* @__PURE__ */ new Set();
      let items = [];
      let onResult = (state) => {
        if (options.onResult) options.onResult(state);
        items.push(state.output);
      };
      let matches = new Set(micromatch(list, patterns, { ...options, onResult }));
      for (let item of items) {
        if (!matches.has(item)) {
          result.add(item);
        }
      }
      return [...result];
    };
    micromatch.contains = (str, pattern, options) => {
      if (typeof str !== 'string') {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      if (Array.isArray(pattern)) {
        return pattern.some((p) => micromatch.contains(str, p, options));
      }
      if (typeof pattern === 'string') {
        if (isEmptyString(str) || isEmptyString(pattern)) {
          return false;
        }
        if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
          return true;
        }
      }
      return micromatch.isMatch(str, pattern, { ...options, contains: true });
    };
    micromatch.matchKeys = (obj, patterns, options) => {
      if (!utils.isObject(obj)) {
        throw new TypeError('Expected the first argument to be an object');
      }
      let keys = micromatch(Object.keys(obj), patterns, options);
      let res = {};
      for (let key of keys) res[key] = obj[key];
      return res;
    };
    micromatch.some = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (items.some((item) => isMatch(item))) {
          return true;
        }
      }
      return false;
    };
    micromatch.every = (list, patterns, options) => {
      let items = [].concat(list);
      for (let pattern of [].concat(patterns)) {
        let isMatch = picomatch(String(pattern), options);
        if (!items.every((item) => isMatch(item))) {
          return false;
        }
      }
      return true;
    };
    micromatch.all = (str, patterns, options) => {
      if (typeof str !== 'string') {
        throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
      }
      return [].concat(patterns).every((p) => picomatch(p, options)(str));
    };
    micromatch.capture = (glob, input, options) => {
      let posix = utils.isWindows(options);
      let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
      let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
      if (match) {
        return match.slice(1).map((v) => (v === void 0 ? '' : v));
      }
    };
    micromatch.makeRe = (...args) => picomatch.makeRe(...args);
    micromatch.scan = (...args) => picomatch.scan(...args);
    micromatch.parse = (patterns, options) => {
      let res = [];
      for (let pattern of [].concat(patterns || [])) {
        for (let str of braces(String(pattern), options)) {
          res.push(picomatch.parse(str, options));
        }
      }
      return res;
    };
    micromatch.braces = (pattern, options) => {
      if (typeof pattern !== 'string') throw new TypeError('Expected a string');
      if ((options && options.nobrace === true) || !hasBraces(pattern)) {
        return [pattern];
      }
      return braces(pattern, options);
    };
    micromatch.braceExpand = (pattern, options) => {
      if (typeof pattern !== 'string') throw new TypeError('Expected a string');
      return micromatch.braces(pattern, { ...options, expand: true });
    };
    micromatch.hasBraces = hasBraces;
    module2.exports = micromatch;
  },
});

// node_modules/queue-tick/queue-microtask.js
var require_queue_microtask = __commonJS({
  'node_modules/queue-tick/queue-microtask.js'(exports2, module2) {
    module2.exports = typeof queueMicrotask === 'function' ? queueMicrotask : (fn) => Promise.resolve().then(fn);
  },
});

// node_modules/queue-tick/process-next-tick.js
var require_process_next_tick = __commonJS({
  'node_modules/queue-tick/process-next-tick.js'(exports2, module2) {
    module2.exports =
      typeof process !== 'undefined' && typeof process.nextTick === 'function'
        ? process.nextTick.bind(process)
        : require_queue_microtask();
  },
});

// node_modules/fast-fifo/fixed-size.js
var require_fixed_size = __commonJS({
  'node_modules/fast-fifo/fixed-size.js'(exports2, module2) {
    module2.exports = class FixedFIFO {
      constructor(hwm) {
        if (!(hwm > 0) || ((hwm - 1) & hwm) !== 0) throw new Error('Max size for a FixedFIFO should be a power of two');
        this.buffer = new Array(hwm);
        this.mask = hwm - 1;
        this.top = 0;
        this.btm = 0;
        this.next = null;
      }
      clear() {
        this.top = this.btm = 0;
        this.next = null;
        this.buffer.fill(void 0);
      }
      push(data) {
        if (this.buffer[this.top] !== void 0) return false;
        this.buffer[this.top] = data;
        this.top = (this.top + 1) & this.mask;
        return true;
      }
      shift() {
        const last = this.buffer[this.btm];
        if (last === void 0) return void 0;
        this.buffer[this.btm] = void 0;
        this.btm = (this.btm + 1) & this.mask;
        return last;
      }
      peek() {
        return this.buffer[this.btm];
      }
      isEmpty() {
        return this.buffer[this.btm] === void 0;
      }
    };
  },
});

// node_modules/fast-fifo/index.js
var require_fast_fifo = __commonJS({
  'node_modules/fast-fifo/index.js'(exports2, module2) {
    var FixedFIFO = require_fixed_size();
    module2.exports = class FastFIFO {
      constructor(hwm) {
        this.hwm = hwm || 16;
        this.head = new FixedFIFO(this.hwm);
        this.tail = this.head;
        this.length = 0;
      }
      clear() {
        this.head = this.tail;
        this.head.clear();
        this.length = 0;
      }
      push(val) {
        this.length++;
        if (!this.head.push(val)) {
          const prev = this.head;
          this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length);
          this.head.push(val);
        }
      }
      shift() {
        if (this.length !== 0) this.length--;
        const val = this.tail.shift();
        if (val === void 0 && this.tail.next) {
          const next = this.tail.next;
          this.tail.next = null;
          this.tail = next;
          return this.tail.shift();
        }
        return val;
      }
      peek() {
        const val = this.tail.peek();
        if (val === void 0 && this.tail.next) return this.tail.next.peek();
        return val;
      }
      isEmpty() {
        return this.length === 0;
      }
    };
  },
});

// node_modules/b4a/index.js
var require_b4a = __commonJS({
  'node_modules/b4a/index.js'(exports2, module2) {
    function isBuffer(value) {
      return Buffer.isBuffer(value) || value instanceof Uint8Array;
    }
    function isEncoding(encoding) {
      return Buffer.isEncoding(encoding);
    }
    function alloc(size, fill2, encoding) {
      return Buffer.alloc(size, fill2, encoding);
    }
    function allocUnsafe(size) {
      return Buffer.allocUnsafe(size);
    }
    function allocUnsafeSlow(size) {
      return Buffer.allocUnsafeSlow(size);
    }
    function byteLength(string, encoding) {
      return Buffer.byteLength(string, encoding);
    }
    function compare(a, b) {
      return Buffer.compare(a, b);
    }
    function concat(buffers, totalLength) {
      return Buffer.concat(buffers, totalLength);
    }
    function copy(source, target, targetStart, start, end) {
      return toBuffer(source).copy(target, targetStart, start, end);
    }
    function equals(a, b) {
      return toBuffer(a).equals(b);
    }
    function fill(buffer, value, offset, end, encoding) {
      return toBuffer(buffer).fill(value, offset, end, encoding);
    }
    function from(value, encodingOrOffset, length) {
      return Buffer.from(value, encodingOrOffset, length);
    }
    function includes(buffer, value, byteOffset, encoding) {
      return toBuffer(buffer).includes(value, byteOffset, encoding);
    }
    function indexOf(buffer, value, byfeOffset, encoding) {
      return toBuffer(buffer).indexOf(value, byfeOffset, encoding);
    }
    function lastIndexOf(buffer, value, byteOffset, encoding) {
      return toBuffer(buffer).lastIndexOf(value, byteOffset, encoding);
    }
    function swap16(buffer) {
      return toBuffer(buffer).swap16();
    }
    function swap32(buffer) {
      return toBuffer(buffer).swap32();
    }
    function swap64(buffer) {
      return toBuffer(buffer).swap64();
    }
    function toBuffer(buffer) {
      if (Buffer.isBuffer(buffer)) return buffer;
      return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    function toString(buffer, encoding, start, end) {
      return toBuffer(buffer).toString(encoding, start, end);
    }
    function write2(buffer, string, offset, length, encoding) {
      return toBuffer(buffer).write(string, offset, length, encoding);
    }
    function writeDoubleLE(buffer, value, offset) {
      return toBuffer(buffer).writeDoubleLE(value, offset);
    }
    function writeFloatLE(buffer, value, offset) {
      return toBuffer(buffer).writeFloatLE(value, offset);
    }
    function writeUInt32LE(buffer, value, offset) {
      return toBuffer(buffer).writeUInt32LE(value, offset);
    }
    function writeInt32LE(buffer, value, offset) {
      return toBuffer(buffer).writeInt32LE(value, offset);
    }
    function readDoubleLE(buffer, offset) {
      return toBuffer(buffer).readDoubleLE(offset);
    }
    function readFloatLE(buffer, offset) {
      return toBuffer(buffer).readFloatLE(offset);
    }
    function readUInt32LE(buffer, offset) {
      return toBuffer(buffer).readUInt32LE(offset);
    }
    function readInt32LE(buffer, offset) {
      return toBuffer(buffer).readInt32LE(offset);
    }
    function writeDoubleBE(buffer, value, offset) {
      return toBuffer(buffer).writeDoubleBE(value, offset);
    }
    function writeFloatBE(buffer, value, offset) {
      return toBuffer(buffer).writeFloatBE(value, offset);
    }
    function writeUInt32BE(buffer, value, offset) {
      return toBuffer(buffer).writeUInt32BE(value, offset);
    }
    function writeInt32BE(buffer, value, offset) {
      return toBuffer(buffer).writeInt32BE(value, offset);
    }
    function readDoubleBE(buffer, offset) {
      return toBuffer(buffer).readDoubleBE(offset);
    }
    function readFloatBE(buffer, offset) {
      return toBuffer(buffer).readFloatBE(offset);
    }
    function readUInt32BE(buffer, offset) {
      return toBuffer(buffer).readUInt32BE(offset);
    }
    function readInt32BE(buffer, offset) {
      return toBuffer(buffer).readInt32BE(offset);
    }
    module2.exports = {
      isBuffer,
      isEncoding,
      alloc,
      allocUnsafe,
      allocUnsafeSlow,
      byteLength,
      compare,
      concat,
      copy,
      equals,
      fill,
      from,
      includes,
      indexOf,
      lastIndexOf,
      swap16,
      swap32,
      swap64,
      toBuffer,
      toString,
      write: write2,
      writeDoubleLE,
      writeFloatLE,
      writeUInt32LE,
      writeInt32LE,
      readDoubleLE,
      readFloatLE,
      readUInt32LE,
      readInt32LE,
      writeDoubleBE,
      writeFloatBE,
      writeUInt32BE,
      writeInt32BE,
      readDoubleBE,
      readFloatBE,
      readUInt32BE,
      readInt32BE,
    };
  },
});

// node_modules/text-decoder/lib/pass-through-decoder.js
var require_pass_through_decoder = __commonJS({
  'node_modules/text-decoder/lib/pass-through-decoder.js'(exports2, module2) {
    var b4a = require_b4a();
    module2.exports = class PassThroughDecoder {
      constructor(encoding) {
        this.encoding = encoding;
      }
      get remaining() {
        return 0;
      }
      decode(tail) {
        return b4a.toString(tail, this.encoding);
      }
      flush() {
        return '';
      }
    };
  },
});

// node_modules/text-decoder/lib/utf8-decoder.js
var require_utf8_decoder = __commonJS({
  'node_modules/text-decoder/lib/utf8-decoder.js'(exports2, module2) {
    var b4a = require_b4a();
    module2.exports = class UTF8Decoder {
      constructor() {
        this.codePoint = 0;
        this.bytesSeen = 0;
        this.bytesNeeded = 0;
        this.lowerBoundary = 128;
        this.upperBoundary = 191;
      }
      get remaining() {
        return this.bytesSeen;
      }
      decode(data) {
        if (this.bytesNeeded === 0) {
          let isBoundary = true;
          for (let i = Math.max(0, data.byteLength - 4), n = data.byteLength; i < n && isBoundary; i++) {
            isBoundary = data[i] <= 127;
          }
          if (isBoundary) return b4a.toString(data, 'utf8');
        }
        let result = '';
        for (let i = 0, n = data.byteLength; i < n; i++) {
          const byte = data[i];
          if (this.bytesNeeded === 0) {
            if (byte <= 127) {
              result += String.fromCharCode(byte);
            } else {
              this.bytesSeen = 1;
              if (byte >= 194 && byte <= 223) {
                this.bytesNeeded = 2;
                this.codePoint = byte & 31;
              } else if (byte >= 224 && byte <= 239) {
                if (byte === 224) this.lowerBoundary = 160;
                else if (byte === 237) this.upperBoundary = 159;
                this.bytesNeeded = 3;
                this.codePoint = byte & 15;
              } else if (byte >= 240 && byte <= 244) {
                if (byte === 240) this.lowerBoundary = 144;
                if (byte === 244) this.upperBoundary = 143;
                this.bytesNeeded = 4;
                this.codePoint = byte & 7;
              } else {
                result += '\uFFFD';
              }
            }
            continue;
          }
          if (byte < this.lowerBoundary || byte > this.upperBoundary) {
            this.codePoint = 0;
            this.bytesNeeded = 0;
            this.bytesSeen = 0;
            this.lowerBoundary = 128;
            this.upperBoundary = 191;
            result += '\uFFFD';
            continue;
          }
          this.lowerBoundary = 128;
          this.upperBoundary = 191;
          this.codePoint = (this.codePoint << 6) | (byte & 63);
          this.bytesSeen++;
          if (this.bytesSeen !== this.bytesNeeded) continue;
          result += String.fromCodePoint(this.codePoint);
          this.codePoint = 0;
          this.bytesNeeded = 0;
          this.bytesSeen = 0;
        }
        return result;
      }
      flush() {
        const result = this.bytesNeeded > 0 ? '\uFFFD' : '';
        this.codePoint = 0;
        this.bytesNeeded = 0;
        this.bytesSeen = 0;
        this.lowerBoundary = 128;
        this.upperBoundary = 191;
        return result;
      }
    };
  },
});

// node_modules/text-decoder/index.js
var require_text_decoder = __commonJS({
  'node_modules/text-decoder/index.js'(exports2, module2) {
    var PassThroughDecoder = require_pass_through_decoder();
    var UTF8Decoder = require_utf8_decoder();
    module2.exports = class TextDecoder {
      constructor(encoding = 'utf8') {
        this.encoding = normalizeEncoding(encoding);
        switch (this.encoding) {
          case 'utf8':
            this.decoder = new UTF8Decoder();
            break;
          case 'utf16le':
          case 'base64':
            throw new Error('Unsupported encoding: ' + this.encoding);
          default:
            this.decoder = new PassThroughDecoder(this.encoding);
        }
      }
      get remaining() {
        return this.decoder.remaining;
      }
      push(data) {
        if (typeof data === 'string') return data;
        return this.decoder.decode(data);
      }
      // For Node.js compatibility
      write(data) {
        return this.push(data);
      }
      end(data) {
        let result = '';
        if (data) result = this.push(data);
        result += this.decoder.flush();
        return result;
      }
    };
    function normalizeEncoding(encoding) {
      encoding = encoding.toLowerCase();
      switch (encoding) {
        case 'utf8':
        case 'utf-8':
          return 'utf8';
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return 'utf16le';
        case 'latin1':
        case 'binary':
          return 'latin1';
        case 'base64':
        case 'ascii':
        case 'hex':
          return encoding;
        default:
          throw new Error('Unknown encoding: ' + encoding);
      }
    }
  },
});

// node_modules/streamx/index.js
var require_streamx = __commonJS({
  'node_modules/streamx/index.js'(exports2, module2) {
    var { EventEmitter } = require('events');
    var STREAM_DESTROYED = new Error('Stream was destroyed');
    var PREMATURE_CLOSE = new Error('Premature close');
    var queueTick = require_process_next_tick();
    var FIFO = require_fast_fifo();
    var TextDecoder = require_text_decoder();
    var MAX = (1 << 29) - 1;
    var OPENING = 1;
    var PREDESTROYING = 2;
    var DESTROYING = 4;
    var DESTROYED = 8;
    var NOT_OPENING = MAX ^ OPENING;
    var NOT_PREDESTROYING = MAX ^ PREDESTROYING;
    var READ_ACTIVE = 1 << 4;
    var READ_UPDATING = 2 << 4;
    var READ_PRIMARY = 4 << 4;
    var READ_QUEUED = 8 << 4;
    var READ_RESUMED = 16 << 4;
    var READ_PIPE_DRAINED = 32 << 4;
    var READ_ENDING = 64 << 4;
    var READ_EMIT_DATA = 128 << 4;
    var READ_EMIT_READABLE = 256 << 4;
    var READ_EMITTED_READABLE = 512 << 4;
    var READ_DONE = 1024 << 4;
    var READ_NEXT_TICK = 2048 << 4;
    var READ_NEEDS_PUSH = 4096 << 4;
    var READ_READ_AHEAD = 8192 << 4;
    var READ_FLOWING = READ_RESUMED | READ_PIPE_DRAINED;
    var READ_ACTIVE_AND_NEEDS_PUSH = READ_ACTIVE | READ_NEEDS_PUSH;
    var READ_PRIMARY_AND_ACTIVE = READ_PRIMARY | READ_ACTIVE;
    var READ_EMIT_READABLE_AND_QUEUED = READ_EMIT_READABLE | READ_QUEUED;
    var READ_RESUMED_READ_AHEAD = READ_RESUMED | READ_READ_AHEAD;
    var READ_NOT_ACTIVE = MAX ^ READ_ACTIVE;
    var READ_NON_PRIMARY = MAX ^ READ_PRIMARY;
    var READ_NON_PRIMARY_AND_PUSHED = MAX ^ (READ_PRIMARY | READ_NEEDS_PUSH);
    var READ_PUSHED = MAX ^ READ_NEEDS_PUSH;
    var READ_PAUSED = MAX ^ READ_RESUMED;
    var READ_NOT_QUEUED = MAX ^ (READ_QUEUED | READ_EMITTED_READABLE);
    var READ_NOT_ENDING = MAX ^ READ_ENDING;
    var READ_PIPE_NOT_DRAINED = MAX ^ READ_FLOWING;
    var READ_NOT_NEXT_TICK = MAX ^ READ_NEXT_TICK;
    var READ_NOT_UPDATING = MAX ^ READ_UPDATING;
    var READ_NO_READ_AHEAD = MAX ^ READ_READ_AHEAD;
    var READ_PAUSED_NO_READ_AHEAD = MAX ^ READ_RESUMED_READ_AHEAD;
    var WRITE_ACTIVE = 1 << 18;
    var WRITE_UPDATING = 2 << 18;
    var WRITE_PRIMARY = 4 << 18;
    var WRITE_QUEUED = 8 << 18;
    var WRITE_UNDRAINED = 16 << 18;
    var WRITE_DONE = 32 << 18;
    var WRITE_EMIT_DRAIN = 64 << 18;
    var WRITE_NEXT_TICK = 128 << 18;
    var WRITE_WRITING = 256 << 18;
    var WRITE_FINISHING = 512 << 18;
    var WRITE_CORKED = 1024 << 18;
    var WRITE_NOT_ACTIVE = MAX ^ (WRITE_ACTIVE | WRITE_WRITING);
    var WRITE_NON_PRIMARY = MAX ^ WRITE_PRIMARY;
    var WRITE_NOT_FINISHING = MAX ^ WRITE_FINISHING;
    var WRITE_DRAINED = MAX ^ WRITE_UNDRAINED;
    var WRITE_NOT_QUEUED = MAX ^ WRITE_QUEUED;
    var WRITE_NOT_NEXT_TICK = MAX ^ WRITE_NEXT_TICK;
    var WRITE_NOT_UPDATING = MAX ^ WRITE_UPDATING;
    var WRITE_NOT_CORKED = MAX ^ WRITE_CORKED;
    var ACTIVE = READ_ACTIVE | WRITE_ACTIVE;
    var NOT_ACTIVE = MAX ^ ACTIVE;
    var DONE = READ_DONE | WRITE_DONE;
    var DESTROY_STATUS = DESTROYING | DESTROYED | PREDESTROYING;
    var OPEN_STATUS = DESTROY_STATUS | OPENING;
    var AUTO_DESTROY = DESTROY_STATUS | DONE;
    var NON_PRIMARY = WRITE_NON_PRIMARY & READ_NON_PRIMARY;
    var ACTIVE_OR_TICKING = WRITE_NEXT_TICK | READ_NEXT_TICK;
    var TICKING = ACTIVE_OR_TICKING & NOT_ACTIVE;
    var IS_OPENING = OPEN_STATUS | TICKING;
    var READ_PRIMARY_STATUS = OPEN_STATUS | READ_ENDING | READ_DONE;
    var READ_STATUS = OPEN_STATUS | READ_DONE | READ_QUEUED;
    var READ_ENDING_STATUS = OPEN_STATUS | READ_ENDING | READ_QUEUED;
    var READ_READABLE_STATUS = OPEN_STATUS | READ_EMIT_READABLE | READ_QUEUED | READ_EMITTED_READABLE;
    var SHOULD_NOT_READ = OPEN_STATUS | READ_ACTIVE | READ_ENDING | READ_DONE | READ_NEEDS_PUSH | READ_READ_AHEAD;
    var READ_BACKPRESSURE_STATUS = DESTROY_STATUS | READ_ENDING | READ_DONE;
    var READ_UPDATE_SYNC_STATUS = READ_UPDATING | OPEN_STATUS | READ_NEXT_TICK | READ_PRIMARY;
    var WRITE_PRIMARY_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_DONE;
    var WRITE_QUEUED_AND_UNDRAINED = WRITE_QUEUED | WRITE_UNDRAINED;
    var WRITE_QUEUED_AND_ACTIVE = WRITE_QUEUED | WRITE_ACTIVE;
    var WRITE_DRAIN_STATUS = WRITE_QUEUED | WRITE_UNDRAINED | OPEN_STATUS | WRITE_ACTIVE;
    var WRITE_STATUS = OPEN_STATUS | WRITE_ACTIVE | WRITE_QUEUED | WRITE_CORKED;
    var WRITE_PRIMARY_AND_ACTIVE = WRITE_PRIMARY | WRITE_ACTIVE;
    var WRITE_ACTIVE_AND_WRITING = WRITE_ACTIVE | WRITE_WRITING;
    var WRITE_FINISHING_STATUS = OPEN_STATUS | WRITE_FINISHING | WRITE_QUEUED_AND_ACTIVE | WRITE_DONE;
    var WRITE_BACKPRESSURE_STATUS = WRITE_UNDRAINED | DESTROY_STATUS | WRITE_FINISHING | WRITE_DONE;
    var WRITE_UPDATE_SYNC_STATUS = WRITE_UPDATING | OPEN_STATUS | WRITE_NEXT_TICK | WRITE_PRIMARY;
    var asyncIterator = Symbol.asyncIterator || Symbol('asyncIterator');
    var WritableState = class {
      constructor(stream, { highWaterMark = 16384, map = null, mapWritable, byteLength, byteLengthWritable } = {}) {
        this.stream = stream;
        this.queue = new FIFO();
        this.highWaterMark = highWaterMark;
        this.buffered = 0;
        this.error = null;
        this.pipeline = null;
        this.drains = null;
        this.byteLength = byteLengthWritable || byteLength || defaultByteLength;
        this.map = mapWritable || map;
        this.afterWrite = afterWrite.bind(this);
        this.afterUpdateNextTick = updateWriteNT.bind(this);
      }
      get ended() {
        return (this.stream._duplexState & WRITE_DONE) !== 0;
      }
      push(data) {
        if (this.map !== null) data = this.map(data);
        this.buffered += this.byteLength(data);
        this.queue.push(data);
        if (this.buffered < this.highWaterMark) {
          this.stream._duplexState |= WRITE_QUEUED;
          return true;
        }
        this.stream._duplexState |= WRITE_QUEUED_AND_UNDRAINED;
        return false;
      }
      shift() {
        const data = this.queue.shift();
        this.buffered -= this.byteLength(data);
        if (this.buffered === 0) this.stream._duplexState &= WRITE_NOT_QUEUED;
        return data;
      }
      end(data) {
        if (typeof data === 'function') this.stream.once('finish', data);
        else if (data !== void 0 && data !== null) this.push(data);
        this.stream._duplexState = (this.stream._duplexState | WRITE_FINISHING) & WRITE_NON_PRIMARY;
      }
      autoBatch(data, cb) {
        const buffer = [];
        const stream = this.stream;
        buffer.push(data);
        while ((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED_AND_ACTIVE) {
          buffer.push(stream._writableState.shift());
        }
        if ((stream._duplexState & OPEN_STATUS) !== 0) return cb(null);
        stream._writev(buffer, cb);
      }
      update() {
        const stream = this.stream;
        stream._duplexState |= WRITE_UPDATING;
        do {
          while ((stream._duplexState & WRITE_STATUS) === WRITE_QUEUED) {
            const data = this.shift();
            stream._duplexState |= WRITE_ACTIVE_AND_WRITING;
            stream._write(data, this.afterWrite);
          }
          if ((stream._duplexState & WRITE_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary();
        } while (this.continueUpdate() === true);
        stream._duplexState &= WRITE_NOT_UPDATING;
      }
      updateNonPrimary() {
        const stream = this.stream;
        if ((stream._duplexState & WRITE_FINISHING_STATUS) === WRITE_FINISHING) {
          stream._duplexState = (stream._duplexState | WRITE_ACTIVE) & WRITE_NOT_FINISHING;
          stream._final(afterFinal.bind(this));
          return;
        }
        if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
          if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
            stream._duplexState |= ACTIVE;
            stream._destroy(afterDestroy.bind(this));
          }
          return;
        }
        if ((stream._duplexState & IS_OPENING) === OPENING) {
          stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING;
          stream._open(afterOpen.bind(this));
        }
      }
      continueUpdate() {
        if ((this.stream._duplexState & WRITE_NEXT_TICK) === 0) return false;
        this.stream._duplexState &= WRITE_NOT_NEXT_TICK;
        return true;
      }
      updateCallback() {
        if ((this.stream._duplexState & WRITE_UPDATE_SYNC_STATUS) === WRITE_PRIMARY) this.update();
        else this.updateNextTick();
      }
      updateNextTick() {
        if ((this.stream._duplexState & WRITE_NEXT_TICK) !== 0) return;
        this.stream._duplexState |= WRITE_NEXT_TICK;
        if ((this.stream._duplexState & WRITE_UPDATING) === 0) queueTick(this.afterUpdateNextTick);
      }
    };
    var ReadableState = class {
      constructor(stream, { highWaterMark = 16384, map = null, mapReadable, byteLength, byteLengthReadable } = {}) {
        this.stream = stream;
        this.queue = new FIFO();
        this.highWaterMark = highWaterMark === 0 ? 1 : highWaterMark;
        this.buffered = 0;
        this.readAhead = highWaterMark > 0;
        this.error = null;
        this.pipeline = null;
        this.byteLength = byteLengthReadable || byteLength || defaultByteLength;
        this.map = mapReadable || map;
        this.pipeTo = null;
        this.afterRead = afterRead.bind(this);
        this.afterUpdateNextTick = updateReadNT.bind(this);
      }
      get ended() {
        return (this.stream._duplexState & READ_DONE) !== 0;
      }
      pipe(pipeTo, cb) {
        if (this.pipeTo !== null) throw new Error('Can only pipe to one destination');
        if (typeof cb !== 'function') cb = null;
        this.stream._duplexState |= READ_PIPE_DRAINED;
        this.pipeTo = pipeTo;
        this.pipeline = new Pipeline(this.stream, pipeTo, cb);
        if (cb) this.stream.on('error', noop);
        if (isStreamx(pipeTo)) {
          pipeTo._writableState.pipeline = this.pipeline;
          if (cb) pipeTo.on('error', noop);
          pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline));
        } else {
          const onerror = this.pipeline.done.bind(this.pipeline, pipeTo);
          const onclose = this.pipeline.done.bind(this.pipeline, pipeTo, null);
          pipeTo.on('error', onerror);
          pipeTo.on('close', onclose);
          pipeTo.on('finish', this.pipeline.finished.bind(this.pipeline));
        }
        pipeTo.on('drain', afterDrain.bind(this));
        this.stream.emit('piping', pipeTo);
        pipeTo.emit('pipe', this.stream);
      }
      push(data) {
        const stream = this.stream;
        if (data === null) {
          this.highWaterMark = 0;
          stream._duplexState = (stream._duplexState | READ_ENDING) & READ_NON_PRIMARY_AND_PUSHED;
          return false;
        }
        if (this.map !== null) {
          data = this.map(data);
          if (data === null) {
            stream._duplexState &= READ_PUSHED;
            return this.buffered < this.highWaterMark;
          }
        }
        this.buffered += this.byteLength(data);
        this.queue.push(data);
        stream._duplexState = (stream._duplexState | READ_QUEUED) & READ_PUSHED;
        return this.buffered < this.highWaterMark;
      }
      shift() {
        const data = this.queue.shift();
        this.buffered -= this.byteLength(data);
        if (this.buffered === 0) this.stream._duplexState &= READ_NOT_QUEUED;
        return data;
      }
      unshift(data) {
        const pending = [this.map !== null ? this.map(data) : data];
        while (this.buffered > 0) pending.push(this.shift());
        for (let i = 0; i < pending.length - 1; i++) {
          const data2 = pending[i];
          this.buffered += this.byteLength(data2);
          this.queue.push(data2);
        }
        this.push(pending[pending.length - 1]);
      }
      read() {
        const stream = this.stream;
        if ((stream._duplexState & READ_STATUS) === READ_QUEUED) {
          const data = this.shift();
          if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED;
          if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data);
          return data;
        }
        if (this.readAhead === false) {
          stream._duplexState |= READ_READ_AHEAD;
          this.updateNextTick();
        }
        return null;
      }
      drain() {
        const stream = this.stream;
        while ((stream._duplexState & READ_STATUS) === READ_QUEUED && (stream._duplexState & READ_FLOWING) !== 0) {
          const data = this.shift();
          if (this.pipeTo !== null && this.pipeTo.write(data) === false) stream._duplexState &= READ_PIPE_NOT_DRAINED;
          if ((stream._duplexState & READ_EMIT_DATA) !== 0) stream.emit('data', data);
        }
      }
      update() {
        const stream = this.stream;
        stream._duplexState |= READ_UPDATING;
        do {
          this.drain();
          while (this.buffered < this.highWaterMark && (stream._duplexState & SHOULD_NOT_READ) === READ_READ_AHEAD) {
            stream._duplexState |= READ_ACTIVE_AND_NEEDS_PUSH;
            stream._read(this.afterRead);
            this.drain();
          }
          if ((stream._duplexState & READ_READABLE_STATUS) === READ_EMIT_READABLE_AND_QUEUED) {
            stream._duplexState |= READ_EMITTED_READABLE;
            stream.emit('readable');
          }
          if ((stream._duplexState & READ_PRIMARY_AND_ACTIVE) === 0) this.updateNonPrimary();
        } while (this.continueUpdate() === true);
        stream._duplexState &= READ_NOT_UPDATING;
      }
      updateNonPrimary() {
        const stream = this.stream;
        if ((stream._duplexState & READ_ENDING_STATUS) === READ_ENDING) {
          stream._duplexState = (stream._duplexState | READ_DONE) & READ_NOT_ENDING;
          stream.emit('end');
          if ((stream._duplexState & AUTO_DESTROY) === DONE) stream._duplexState |= DESTROYING;
          if (this.pipeTo !== null) this.pipeTo.end();
        }
        if ((stream._duplexState & DESTROY_STATUS) === DESTROYING) {
          if ((stream._duplexState & ACTIVE_OR_TICKING) === 0) {
            stream._duplexState |= ACTIVE;
            stream._destroy(afterDestroy.bind(this));
          }
          return;
        }
        if ((stream._duplexState & IS_OPENING) === OPENING) {
          stream._duplexState = (stream._duplexState | ACTIVE) & NOT_OPENING;
          stream._open(afterOpen.bind(this));
        }
      }
      continueUpdate() {
        if ((this.stream._duplexState & READ_NEXT_TICK) === 0) return false;
        this.stream._duplexState &= READ_NOT_NEXT_TICK;
        return true;
      }
      updateCallback() {
        if ((this.stream._duplexState & READ_UPDATE_SYNC_STATUS) === READ_PRIMARY) this.update();
        else this.updateNextTick();
      }
      updateNextTick() {
        if ((this.stream._duplexState & READ_NEXT_TICK) !== 0) return;
        this.stream._duplexState |= READ_NEXT_TICK;
        if ((this.stream._duplexState & READ_UPDATING) === 0) queueTick(this.afterUpdateNextTick);
      }
    };
    var TransformState = class {
      constructor(stream) {
        this.data = null;
        this.afterTransform = afterTransform.bind(stream);
        this.afterFinal = null;
      }
    };
    var Pipeline = class {
      constructor(src, dst, cb) {
        this.from = src;
        this.to = dst;
        this.afterPipe = cb;
        this.error = null;
        this.pipeToFinished = false;
      }
      finished() {
        this.pipeToFinished = true;
      }
      done(stream, err) {
        if (err) this.error = err;
        if (stream === this.to) {
          this.to = null;
          if (this.from !== null) {
            if ((this.from._duplexState & READ_DONE) === 0 || !this.pipeToFinished) {
              this.from.destroy(this.error || new Error('Writable stream closed prematurely'));
            }
            return;
          }
        }
        if (stream === this.from) {
          this.from = null;
          if (this.to !== null) {
            if ((stream._duplexState & READ_DONE) === 0) {
              this.to.destroy(this.error || new Error('Readable stream closed before ending'));
            }
            return;
          }
        }
        if (this.afterPipe !== null) this.afterPipe(this.error);
        this.to = this.from = this.afterPipe = null;
      }
    };
    function afterDrain() {
      this.stream._duplexState |= READ_PIPE_DRAINED;
      this.updateCallback();
    }
    function afterFinal(err) {
      const stream = this.stream;
      if (err) stream.destroy(err);
      if ((stream._duplexState & DESTROY_STATUS) === 0) {
        stream._duplexState |= WRITE_DONE;
        stream.emit('finish');
      }
      if ((stream._duplexState & AUTO_DESTROY) === DONE) {
        stream._duplexState |= DESTROYING;
      }
      stream._duplexState &= WRITE_NOT_ACTIVE;
      if ((stream._duplexState & WRITE_UPDATING) === 0) this.update();
      else this.updateNextTick();
    }
    function afterDestroy(err) {
      const stream = this.stream;
      if (!err && this.error !== STREAM_DESTROYED) err = this.error;
      if (err) stream.emit('error', err);
      stream._duplexState |= DESTROYED;
      stream.emit('close');
      const rs = stream._readableState;
      const ws = stream._writableState;
      if (rs !== null && rs.pipeline !== null) rs.pipeline.done(stream, err);
      if (ws !== null) {
        while (ws.drains !== null && ws.drains.length > 0) ws.drains.shift().resolve(false);
        if (ws.pipeline !== null) ws.pipeline.done(stream, err);
      }
    }
    function afterWrite(err) {
      const stream = this.stream;
      if (err) stream.destroy(err);
      stream._duplexState &= WRITE_NOT_ACTIVE;
      if (this.drains !== null) tickDrains(this.drains);
      if ((stream._duplexState & WRITE_DRAIN_STATUS) === WRITE_UNDRAINED) {
        stream._duplexState &= WRITE_DRAINED;
        if ((stream._duplexState & WRITE_EMIT_DRAIN) === WRITE_EMIT_DRAIN) {
          stream.emit('drain');
        }
      }
      this.updateCallback();
    }
    function afterRead(err) {
      if (err) this.stream.destroy(err);
      this.stream._duplexState &= READ_NOT_ACTIVE;
      if (this.readAhead === false && (this.stream._duplexState & READ_RESUMED) === 0)
        this.stream._duplexState &= READ_NO_READ_AHEAD;
      this.updateCallback();
    }
    function updateReadNT() {
      if ((this.stream._duplexState & READ_UPDATING) === 0) {
        this.stream._duplexState &= READ_NOT_NEXT_TICK;
        this.update();
      }
    }
    function updateWriteNT() {
      if ((this.stream._duplexState & WRITE_UPDATING) === 0) {
        this.stream._duplexState &= WRITE_NOT_NEXT_TICK;
        this.update();
      }
    }
    function tickDrains(drains) {
      for (let i = 0; i < drains.length; i++) {
        if (--drains[i].writes === 0) {
          drains.shift().resolve(true);
          i--;
        }
      }
    }
    function afterOpen(err) {
      const stream = this.stream;
      if (err) stream.destroy(err);
      if ((stream._duplexState & DESTROYING) === 0) {
        if ((stream._duplexState & READ_PRIMARY_STATUS) === 0) stream._duplexState |= READ_PRIMARY;
        if ((stream._duplexState & WRITE_PRIMARY_STATUS) === 0) stream._duplexState |= WRITE_PRIMARY;
        stream.emit('open');
      }
      stream._duplexState &= NOT_ACTIVE;
      if (stream._writableState !== null) {
        stream._writableState.updateCallback();
      }
      if (stream._readableState !== null) {
        stream._readableState.updateCallback();
      }
    }
    function afterTransform(err, data) {
      if (data !== void 0 && data !== null) this.push(data);
      this._writableState.afterWrite(err);
    }
    function newListener(name) {
      if (this._readableState !== null) {
        if (name === 'data') {
          this._duplexState |= READ_EMIT_DATA | READ_RESUMED_READ_AHEAD;
          this._readableState.updateNextTick();
        }
        if (name === 'readable') {
          this._duplexState |= READ_EMIT_READABLE;
          this._readableState.updateNextTick();
        }
      }
      if (this._writableState !== null) {
        if (name === 'drain') {
          this._duplexState |= WRITE_EMIT_DRAIN;
          this._writableState.updateNextTick();
        }
      }
    }
    var Stream = class extends EventEmitter {
      constructor(opts) {
        super();
        this._duplexState = 0;
        this._readableState = null;
        this._writableState = null;
        if (opts) {
          if (opts.open) this._open = opts.open;
          if (opts.destroy) this._destroy = opts.destroy;
          if (opts.predestroy) this._predestroy = opts.predestroy;
          if (opts.signal) {
            opts.signal.addEventListener('abort', abort.bind(this));
          }
        }
        this.on('newListener', newListener);
      }
      _open(cb) {
        cb(null);
      }
      _destroy(cb) {
        cb(null);
      }
      _predestroy() {}
      get readable() {
        return this._readableState !== null ? true : void 0;
      }
      get writable() {
        return this._writableState !== null ? true : void 0;
      }
      get destroyed() {
        return (this._duplexState & DESTROYED) !== 0;
      }
      get destroying() {
        return (this._duplexState & DESTROY_STATUS) !== 0;
      }
      destroy(err) {
        if ((this._duplexState & DESTROY_STATUS) === 0) {
          if (!err) err = STREAM_DESTROYED;
          this._duplexState = (this._duplexState | DESTROYING) & NON_PRIMARY;
          if (this._readableState !== null) {
            this._readableState.highWaterMark = 0;
            this._readableState.error = err;
          }
          if (this._writableState !== null) {
            this._writableState.highWaterMark = 0;
            this._writableState.error = err;
          }
          this._duplexState |= PREDESTROYING;
          this._predestroy();
          this._duplexState &= NOT_PREDESTROYING;
          if (this._readableState !== null) this._readableState.updateNextTick();
          if (this._writableState !== null) this._writableState.updateNextTick();
        }
      }
    };
    var Readable = class _Readable extends Stream {
      constructor(opts) {
        super(opts);
        this._duplexState |= OPENING | WRITE_DONE | READ_READ_AHEAD;
        this._readableState = new ReadableState(this, opts);
        if (opts) {
          if (this._readableState.readAhead === false) this._duplexState &= READ_NO_READ_AHEAD;
          if (opts.read) this._read = opts.read;
          if (opts.eagerOpen) this._readableState.updateNextTick();
          if (opts.encoding) this.setEncoding(opts.encoding);
        }
      }
      setEncoding(encoding) {
        const dec = new TextDecoder(encoding);
        const map = this._readableState.map || echo;
        this._readableState.map = mapOrSkip;
        return this;
        function mapOrSkip(data) {
          const next = dec.push(data);
          return next === '' && (data.byteLength !== 0 || dec.remaining > 0) ? null : map(next);
        }
      }
      _read(cb) {
        cb(null);
      }
      pipe(dest, cb) {
        this._readableState.updateNextTick();
        this._readableState.pipe(dest, cb);
        return dest;
      }
      read() {
        this._readableState.updateNextTick();
        return this._readableState.read();
      }
      push(data) {
        this._readableState.updateNextTick();
        return this._readableState.push(data);
      }
      unshift(data) {
        this._readableState.updateNextTick();
        return this._readableState.unshift(data);
      }
      resume() {
        this._duplexState |= READ_RESUMED_READ_AHEAD;
        this._readableState.updateNextTick();
        return this;
      }
      pause() {
        this._duplexState &= this._readableState.readAhead === false ? READ_PAUSED_NO_READ_AHEAD : READ_PAUSED;
        return this;
      }
      static _fromAsyncIterator(ite, opts) {
        let destroy;
        const rs = new _Readable({
          ...opts,
          read(cb) {
            ite.next().then(push).then(cb.bind(null, null)).catch(cb);
          },
          predestroy() {
            destroy = ite.return();
          },
          destroy(cb) {
            if (!destroy) return cb(null);
            destroy.then(cb.bind(null, null)).catch(cb);
          },
        });
        return rs;
        function push(data) {
          if (data.done) rs.push(null);
          else rs.push(data.value);
        }
      }
      static from(data, opts) {
        if (isReadStreamx(data)) return data;
        if (data[asyncIterator]) return this._fromAsyncIterator(data[asyncIterator](), opts);
        if (!Array.isArray(data)) data = data === void 0 ? [] : [data];
        let i = 0;
        return new _Readable({
          ...opts,
          read(cb) {
            this.push(i === data.length ? null : data[i++]);
            cb(null);
          },
        });
      }
      static isBackpressured(rs) {
        return (
          (rs._duplexState & READ_BACKPRESSURE_STATUS) !== 0 ||
          rs._readableState.buffered >= rs._readableState.highWaterMark
        );
      }
      static isPaused(rs) {
        return (rs._duplexState & READ_RESUMED) === 0;
      }
      [asyncIterator]() {
        const stream = this;
        let error = null;
        let promiseResolve = null;
        let promiseReject = null;
        this.on('error', (err) => {
          error = err;
        });
        this.on('readable', onreadable);
        this.on('close', onclose);
        return {
          [asyncIterator]() {
            return this;
          },
          next() {
            return new Promise(function (resolve2, reject) {
              promiseResolve = resolve2;
              promiseReject = reject;
              const data = stream.read();
              if (data !== null) ondata(data);
              else if ((stream._duplexState & DESTROYED) !== 0) ondata(null);
            });
          },
          return() {
            return destroy(null);
          },
          throw(err) {
            return destroy(err);
          },
        };
        function onreadable() {
          if (promiseResolve !== null) ondata(stream.read());
        }
        function onclose() {
          if (promiseResolve !== null) ondata(null);
        }
        function ondata(data) {
          if (promiseReject === null) return;
          if (error) promiseReject(error);
          else if (data === null && (stream._duplexState & READ_DONE) === 0) promiseReject(STREAM_DESTROYED);
          else promiseResolve({ value: data, done: data === null });
          promiseReject = promiseResolve = null;
        }
        function destroy(err) {
          stream.destroy(err);
          return new Promise((resolve2, reject) => {
            if (stream._duplexState & DESTROYED) return resolve2({ value: void 0, done: true });
            stream.once('close', function () {
              if (err) reject(err);
              else resolve2({ value: void 0, done: true });
            });
          });
        }
      }
    };
    var Writable3 = class extends Stream {
      constructor(opts) {
        super(opts);
        this._duplexState |= OPENING | READ_DONE;
        this._writableState = new WritableState(this, opts);
        if (opts) {
          if (opts.writev) this._writev = opts.writev;
          if (opts.write) this._write = opts.write;
          if (opts.final) this._final = opts.final;
          if (opts.eagerOpen) this._writableState.updateNextTick();
        }
      }
      cork() {
        this._duplexState |= WRITE_CORKED;
      }
      uncork() {
        this._duplexState &= WRITE_NOT_CORKED;
        this._writableState.updateNextTick();
      }
      _writev(batch, cb) {
        cb(null);
      }
      _write(data, cb) {
        this._writableState.autoBatch(data, cb);
      }
      _final(cb) {
        cb(null);
      }
      static isBackpressured(ws) {
        return (ws._duplexState & WRITE_BACKPRESSURE_STATUS) !== 0;
      }
      static drained(ws) {
        if (ws.destroyed) return Promise.resolve(false);
        const state = ws._writableState;
        const pending = isWritev(ws) ? Math.min(1, state.queue.length) : state.queue.length;
        const writes = pending + (ws._duplexState & WRITE_WRITING ? 1 : 0);
        if (writes === 0) return Promise.resolve(true);
        if (state.drains === null) state.drains = [];
        return new Promise((resolve2) => {
          state.drains.push({ writes, resolve: resolve2 });
        });
      }
      write(data) {
        this._writableState.updateNextTick();
        return this._writableState.push(data);
      }
      end(data) {
        this._writableState.updateNextTick();
        this._writableState.end(data);
        return this;
      }
    };
    var Duplex = class extends Readable {
      // and Writable
      constructor(opts) {
        super(opts);
        this._duplexState = OPENING | (this._duplexState & READ_READ_AHEAD);
        this._writableState = new WritableState(this, opts);
        if (opts) {
          if (opts.writev) this._writev = opts.writev;
          if (opts.write) this._write = opts.write;
          if (opts.final) this._final = opts.final;
        }
      }
      cork() {
        this._duplexState |= WRITE_CORKED;
      }
      uncork() {
        this._duplexState &= WRITE_NOT_CORKED;
        this._writableState.updateNextTick();
      }
      _writev(batch, cb) {
        cb(null);
      }
      _write(data, cb) {
        this._writableState.autoBatch(data, cb);
      }
      _final(cb) {
        cb(null);
      }
      write(data) {
        this._writableState.updateNextTick();
        return this._writableState.push(data);
      }
      end(data) {
        this._writableState.updateNextTick();
        this._writableState.end(data);
        return this;
      }
    };
    var Transform = class extends Duplex {
      constructor(opts) {
        super(opts);
        this._transformState = new TransformState(this);
        if (opts) {
          if (opts.transform) this._transform = opts.transform;
          if (opts.flush) this._flush = opts.flush;
        }
      }
      _write(data, cb) {
        if (this._readableState.buffered >= this._readableState.highWaterMark) {
          this._transformState.data = data;
        } else {
          this._transform(data, this._transformState.afterTransform);
        }
      }
      _read(cb) {
        if (this._transformState.data !== null) {
          const data = this._transformState.data;
          this._transformState.data = null;
          cb(null);
          this._transform(data, this._transformState.afterTransform);
        } else {
          cb(null);
        }
      }
      destroy(err) {
        super.destroy(err);
        if (this._transformState.data !== null) {
          this._transformState.data = null;
          this._transformState.afterTransform();
        }
      }
      _transform(data, cb) {
        cb(null, data);
      }
      _flush(cb) {
        cb(null);
      }
      _final(cb) {
        this._transformState.afterFinal = cb;
        this._flush(transformAfterFlush.bind(this));
      }
    };
    var PassThrough3 = class extends Transform {};
    function transformAfterFlush(err, data) {
      const cb = this._transformState.afterFinal;
      if (err) return cb(err);
      if (data !== null && data !== void 0) this.push(data);
      this.push(null);
      cb(null);
    }
    function pipelinePromise(...streams) {
      return new Promise((resolve2, reject) => {
        return pipeline3(...streams, (err) => {
          if (err) return reject(err);
          resolve2();
        });
      });
    }
    function pipeline3(stream, ...streams) {
      const all = Array.isArray(stream) ? [...stream, ...streams] : [stream, ...streams];
      const done = all.length && typeof all[all.length - 1] === 'function' ? all.pop() : null;
      if (all.length < 2) throw new Error('Pipeline requires at least 2 streams');
      let src = all[0];
      let dest = null;
      let error = null;
      for (let i = 1; i < all.length; i++) {
        dest = all[i];
        if (isStreamx(src)) {
          src.pipe(dest, onerror);
        } else {
          errorHandle(src, true, i > 1, onerror);
          src.pipe(dest);
        }
        src = dest;
      }
      if (done) {
        let fin = false;
        const autoDestroy = isStreamx(dest) || !!(dest._writableState && dest._writableState.autoDestroy);
        dest.on('error', (err) => {
          if (error === null) error = err;
        });
        dest.on('finish', () => {
          fin = true;
          if (!autoDestroy) done(error);
        });
        if (autoDestroy) {
          dest.on('close', () => done(error || (fin ? null : PREMATURE_CLOSE)));
        }
      }
      return dest;
      function errorHandle(s, rd, wr, onerror2) {
        s.on('error', onerror2);
        s.on('close', onclose);
        function onclose() {
          if (rd && s._readableState && !s._readableState.ended) return onerror2(PREMATURE_CLOSE);
          if (wr && s._writableState && !s._writableState.ended) return onerror2(PREMATURE_CLOSE);
        }
      }
      function onerror(err) {
        if (!err || error) return;
        error = err;
        for (const s of all) {
          s.destroy(err);
        }
      }
    }
    function echo(s) {
      return s;
    }
    function isStream(stream) {
      return !!stream._readableState || !!stream._writableState;
    }
    function isStreamx(stream) {
      return typeof stream._duplexState === 'number' && isStream(stream);
    }
    function isEnded(stream) {
      return !!stream._readableState && stream._readableState.ended;
    }
    function isFinished(stream) {
      return !!stream._writableState && stream._writableState.ended;
    }
    function getStreamError(stream, opts = {}) {
      const err =
        (stream._readableState && stream._readableState.error) ||
        (stream._writableState && stream._writableState.error);
      return !opts.all && err === STREAM_DESTROYED ? null : err;
    }
    function isReadStreamx(stream) {
      return isStreamx(stream) && stream.readable;
    }
    function isTypedArray(data) {
      return typeof data === 'object' && data !== null && typeof data.byteLength === 'number';
    }
    function defaultByteLength(data) {
      return isTypedArray(data) ? data.byteLength : 1024;
    }
    function noop() {}
    function abort() {
      this.destroy(new Error('Stream aborted.'));
    }
    function isWritev(s) {
      return s._writev !== Writable3.prototype._writev && s._writev !== Duplex.prototype._writev;
    }
    module2.exports = {
      pipeline: pipeline3,
      pipelinePromise,
      isStream,
      isStreamx,
      isEnded,
      isFinished,
      getStreamError,
      Stream,
      Writable: Writable3,
      Readable,
      Duplex,
      Transform,
      // Export PassThrough for compatibility with Node.js core's stream module
      PassThrough: PassThrough3,
    };
  },
});

// node_modules/tar-stream/headers.js
var require_headers = __commonJS({
  'node_modules/tar-stream/headers.js'(exports2) {
    var b4a = require_b4a();
    var ZEROS = '0000000000000000000';
    var SEVENS = '7777777777777777777';
    var ZERO_OFFSET = '0'.charCodeAt(0);
    var USTAR_MAGIC = b4a.from([117, 115, 116, 97, 114, 0]);
    var USTAR_VER = b4a.from([ZERO_OFFSET, ZERO_OFFSET]);
    var GNU_MAGIC = b4a.from([117, 115, 116, 97, 114, 32]);
    var GNU_VER = b4a.from([32, 0]);
    var MASK = 4095;
    var MAGIC_OFFSET = 257;
    var VERSION_OFFSET = 263;
    exports2.decodeLongPath = function decodeLongPath(buf, encoding) {
      return decodeStr(buf, 0, buf.length, encoding);
    };
    exports2.encodePax = function encodePax(opts) {
      let result = '';
      if (opts.name) result += addLength(' path=' + opts.name + '\n');
      if (opts.linkname) result += addLength(' linkpath=' + opts.linkname + '\n');
      const pax = opts.pax;
      if (pax) {
        for (const key in pax) {
          result += addLength(' ' + key + '=' + pax[key] + '\n');
        }
      }
      return b4a.from(result);
    };
    exports2.decodePax = function decodePax(buf) {
      const result = {};
      while (buf.length) {
        let i = 0;
        while (i < buf.length && buf[i] !== 32) i++;
        const len = parseInt(b4a.toString(buf.subarray(0, i)), 10);
        if (!len) return result;
        const b = b4a.toString(buf.subarray(i + 1, len - 1));
        const keyIndex = b.indexOf('=');
        if (keyIndex === -1) return result;
        result[b.slice(0, keyIndex)] = b.slice(keyIndex + 1);
        buf = buf.subarray(len);
      }
      return result;
    };
    exports2.encode = function encode(opts) {
      const buf = b4a.alloc(512);
      let name = opts.name;
      let prefix = '';
      if (opts.typeflag === 5 && name[name.length - 1] !== '/') name += '/';
      if (b4a.byteLength(name) !== name.length) return null;
      while (b4a.byteLength(name) > 100) {
        const i = name.indexOf('/');
        if (i === -1) return null;
        prefix += prefix ? '/' + name.slice(0, i) : name.slice(0, i);
        name = name.slice(i + 1);
      }
      if (b4a.byteLength(name) > 100 || b4a.byteLength(prefix) > 155) return null;
      if (opts.linkname && b4a.byteLength(opts.linkname) > 100) return null;
      b4a.write(buf, name);
      b4a.write(buf, encodeOct(opts.mode & MASK, 6), 100);
      b4a.write(buf, encodeOct(opts.uid, 6), 108);
      b4a.write(buf, encodeOct(opts.gid, 6), 116);
      encodeSize(opts.size, buf, 124);
      b4a.write(buf, encodeOct((opts.mtime.getTime() / 1e3) | 0, 11), 136);
      buf[156] = ZERO_OFFSET + toTypeflag(opts.type);
      if (opts.linkname) b4a.write(buf, opts.linkname, 157);
      b4a.copy(USTAR_MAGIC, buf, MAGIC_OFFSET);
      b4a.copy(USTAR_VER, buf, VERSION_OFFSET);
      if (opts.uname) b4a.write(buf, opts.uname, 265);
      if (opts.gname) b4a.write(buf, opts.gname, 297);
      b4a.write(buf, encodeOct(opts.devmajor || 0, 6), 329);
      b4a.write(buf, encodeOct(opts.devminor || 0, 6), 337);
      if (prefix) b4a.write(buf, prefix, 345);
      b4a.write(buf, encodeOct(cksum(buf), 6), 148);
      return buf;
    };
    exports2.decode = function decode(buf, filenameEncoding, allowUnknownFormat) {
      let typeflag = buf[156] === 0 ? 0 : buf[156] - ZERO_OFFSET;
      let name = decodeStr(buf, 0, 100, filenameEncoding);
      const mode = decodeOct(buf, 100, 8);
      const uid = decodeOct(buf, 108, 8);
      const gid = decodeOct(buf, 116, 8);
      const size = decodeOct(buf, 124, 12);
      const mtime = decodeOct(buf, 136, 12);
      const type = toType(typeflag);
      const linkname = buf[157] === 0 ? null : decodeStr(buf, 157, 100, filenameEncoding);
      const uname = decodeStr(buf, 265, 32);
      const gname = decodeStr(buf, 297, 32);
      const devmajor = decodeOct(buf, 329, 8);
      const devminor = decodeOct(buf, 337, 8);
      const c = cksum(buf);
      if (c === 8 * 32) return null;
      if (c !== decodeOct(buf, 148, 8))
        throw new Error('Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?');
      if (isUSTAR(buf)) {
        if (buf[345]) name = decodeStr(buf, 345, 155, filenameEncoding) + '/' + name;
      } else if (isGNU(buf)) {
      } else {
        if (!allowUnknownFormat) {
          throw new Error('Invalid tar header: unknown format.');
        }
      }
      if (typeflag === 0 && name && name[name.length - 1] === '/') typeflag = 5;
      return {
        name,
        mode,
        uid,
        gid,
        size,
        mtime: new Date(1e3 * mtime),
        type,
        linkname,
        uname,
        gname,
        devmajor,
        devminor,
        pax: null,
      };
    };
    function isUSTAR(buf) {
      return b4a.equals(USTAR_MAGIC, buf.subarray(MAGIC_OFFSET, MAGIC_OFFSET + 6));
    }
    function isGNU(buf) {
      return (
        b4a.equals(GNU_MAGIC, buf.subarray(MAGIC_OFFSET, MAGIC_OFFSET + 6)) &&
        b4a.equals(GNU_VER, buf.subarray(VERSION_OFFSET, VERSION_OFFSET + 2))
      );
    }
    function clamp(index, len, defaultValue) {
      if (typeof index !== 'number') return defaultValue;
      index = ~~index;
      if (index >= len) return len;
      if (index >= 0) return index;
      index += len;
      if (index >= 0) return index;
      return 0;
    }
    function toType(flag) {
      switch (flag) {
        case 0:
          return 'file';
        case 1:
          return 'link';
        case 2:
          return 'symlink';
        case 3:
          return 'character-device';
        case 4:
          return 'block-device';
        case 5:
          return 'directory';
        case 6:
          return 'fifo';
        case 7:
          return 'contiguous-file';
        case 72:
          return 'pax-header';
        case 55:
          return 'pax-global-header';
        case 27:
          return 'gnu-long-link-path';
        case 28:
        case 30:
          return 'gnu-long-path';
      }
      return null;
    }
    function toTypeflag(flag) {
      switch (flag) {
        case 'file':
          return 0;
        case 'link':
          return 1;
        case 'symlink':
          return 2;
        case 'character-device':
          return 3;
        case 'block-device':
          return 4;
        case 'directory':
          return 5;
        case 'fifo':
          return 6;
        case 'contiguous-file':
          return 7;
        case 'pax-header':
          return 72;
      }
      return 0;
    }
    function indexOf(block, num, offset, end) {
      for (; offset < end; offset++) {
        if (block[offset] === num) return offset;
      }
      return end;
    }
    function cksum(block) {
      let sum = 8 * 32;
      for (let i = 0; i < 148; i++) sum += block[i];
      for (let j = 156; j < 512; j++) sum += block[j];
      return sum;
    }
    function encodeOct(val, n) {
      val = val.toString(8);
      if (val.length > n) return SEVENS.slice(0, n) + ' ';
      return ZEROS.slice(0, n - val.length) + val + ' ';
    }
    function encodeSizeBin(num, buf, off) {
      buf[off] = 128;
      for (let i = 11; i > 0; i--) {
        buf[off + i] = num & 255;
        num = Math.floor(num / 256);
      }
    }
    function encodeSize(num, buf, off) {
      if (num.toString(8).length > 11) {
        encodeSizeBin(num, buf, off);
      } else {
        b4a.write(buf, encodeOct(num, 11), off);
      }
    }
    function parse256(buf) {
      let positive;
      if (buf[0] === 128) positive = true;
      else if (buf[0] === 255) positive = false;
      else return null;
      const tuple = [];
      let i;
      for (i = buf.length - 1; i > 0; i--) {
        const byte = buf[i];
        if (positive) tuple.push(byte);
        else tuple.push(255 - byte);
      }
      let sum = 0;
      const l = tuple.length;
      for (i = 0; i < l; i++) {
        sum += tuple[i] * Math.pow(256, i);
      }
      return positive ? sum : -1 * sum;
    }
    function decodeOct(val, offset, length) {
      val = val.subarray(offset, offset + length);
      offset = 0;
      if (val[offset] & 128) {
        return parse256(val);
      } else {
        while (offset < val.length && val[offset] === 32) offset++;
        const end = clamp(indexOf(val, 32, offset, val.length), val.length, val.length);
        while (offset < end && val[offset] === 0) offset++;
        if (end === offset) return 0;
        return parseInt(b4a.toString(val.subarray(offset, end)), 8);
      }
    }
    function decodeStr(val, offset, length, encoding) {
      return b4a.toString(val.subarray(offset, indexOf(val, 0, offset, offset + length)), encoding);
    }
    function addLength(str) {
      const len = b4a.byteLength(str);
      let digits = Math.floor(Math.log(len) / Math.log(10)) + 1;
      if (len + digits >= Math.pow(10, digits)) digits++;
      return len + digits + str;
    }
  },
});

// node_modules/tar-stream/extract.js
var require_extract = __commonJS({
  'node_modules/tar-stream/extract.js'(exports2, module2) {
    var { Writable: Writable3, Readable, getStreamError } = require_streamx();
    var FIFO = require_fast_fifo();
    var b4a = require_b4a();
    var headers = require_headers();
    var EMPTY = b4a.alloc(0);
    var BufferList = class {
      constructor() {
        this.buffered = 0;
        this.shifted = 0;
        this.queue = new FIFO();
        this._offset = 0;
      }
      push(buffer) {
        this.buffered += buffer.byteLength;
        this.queue.push(buffer);
      }
      shiftFirst(size) {
        return this._buffered === 0 ? null : this._next(size);
      }
      shift(size) {
        if (size > this.buffered) return null;
        if (size === 0) return EMPTY;
        let chunk = this._next(size);
        if (size === chunk.byteLength) return chunk;
        const chunks = [chunk];
        while ((size -= chunk.byteLength) > 0) {
          chunk = this._next(size);
          chunks.push(chunk);
        }
        return b4a.concat(chunks);
      }
      _next(size) {
        const buf = this.queue.peek();
        const rem = buf.byteLength - this._offset;
        if (size >= rem) {
          const sub = this._offset ? buf.subarray(this._offset, buf.byteLength) : buf;
          this.queue.shift();
          this._offset = 0;
          this.buffered -= rem;
          this.shifted += rem;
          return sub;
        }
        this.buffered -= size;
        this.shifted += size;
        return buf.subarray(this._offset, (this._offset += size));
      }
    };
    var Source = class extends Readable {
      constructor(self, header, offset) {
        super();
        this.header = header;
        this.offset = offset;
        this._parent = self;
      }
      _read(cb) {
        if (this.header.size === 0) {
          this.push(null);
        }
        if (this._parent._stream === this) {
          this._parent._update();
        }
        cb(null);
      }
      _predestroy() {
        this._parent.destroy(getStreamError(this));
      }
      _detach() {
        if (this._parent._stream === this) {
          this._parent._stream = null;
          this._parent._missing = overflow(this.header.size);
          this._parent._update();
        }
      }
      _destroy(cb) {
        this._detach();
        cb(null);
      }
    };
    var Extract = class extends Writable3 {
      constructor(opts) {
        super(opts);
        if (!opts) opts = {};
        this._buffer = new BufferList();
        this._offset = 0;
        this._header = null;
        this._stream = null;
        this._missing = 0;
        this._longHeader = false;
        this._callback = noop;
        this._locked = false;
        this._finished = false;
        this._pax = null;
        this._paxGlobal = null;
        this._gnuLongPath = null;
        this._gnuLongLinkPath = null;
        this._filenameEncoding = opts.filenameEncoding || 'utf-8';
        this._allowUnknownFormat = !!opts.allowUnknownFormat;
        this._unlockBound = this._unlock.bind(this);
      }
      _unlock(err) {
        this._locked = false;
        if (err) {
          this.destroy(err);
          this._continueWrite(err);
          return;
        }
        this._update();
      }
      _consumeHeader() {
        if (this._locked) return false;
        this._offset = this._buffer.shifted;
        try {
          this._header = headers.decode(this._buffer.shift(512), this._filenameEncoding, this._allowUnknownFormat);
        } catch (err) {
          this._continueWrite(err);
          return false;
        }
        if (!this._header) return true;
        switch (this._header.type) {
          case 'gnu-long-path':
          case 'gnu-long-link-path':
          case 'pax-global-header':
          case 'pax-header':
            this._longHeader = true;
            this._missing = this._header.size;
            return true;
        }
        this._locked = true;
        this._applyLongHeaders();
        if (this._header.size === 0 || this._header.type === 'directory') {
          this.emit('entry', this._header, this._createStream(), this._unlockBound);
          return true;
        }
        this._stream = this._createStream();
        this._missing = this._header.size;
        this.emit('entry', this._header, this._stream, this._unlockBound);
        return true;
      }
      _applyLongHeaders() {
        if (this._gnuLongPath) {
          this._header.name = this._gnuLongPath;
          this._gnuLongPath = null;
        }
        if (this._gnuLongLinkPath) {
          this._header.linkname = this._gnuLongLinkPath;
          this._gnuLongLinkPath = null;
        }
        if (this._pax) {
          if (this._pax.path) this._header.name = this._pax.path;
          if (this._pax.linkpath) this._header.linkname = this._pax.linkpath;
          if (this._pax.size) this._header.size = parseInt(this._pax.size, 10);
          this._header.pax = this._pax;
          this._pax = null;
        }
      }
      _decodeLongHeader(buf) {
        switch (this._header.type) {
          case 'gnu-long-path':
            this._gnuLongPath = headers.decodeLongPath(buf, this._filenameEncoding);
            break;
          case 'gnu-long-link-path':
            this._gnuLongLinkPath = headers.decodeLongPath(buf, this._filenameEncoding);
            break;
          case 'pax-global-header':
            this._paxGlobal = headers.decodePax(buf);
            break;
          case 'pax-header':
            this._pax =
              this._paxGlobal === null
                ? headers.decodePax(buf)
                : Object.assign({}, this._paxGlobal, headers.decodePax(buf));
            break;
        }
      }
      _consumeLongHeader() {
        this._longHeader = false;
        this._missing = overflow(this._header.size);
        const buf = this._buffer.shift(this._header.size);
        try {
          this._decodeLongHeader(buf);
        } catch (err) {
          this._continueWrite(err);
          return false;
        }
        return true;
      }
      _consumeStream() {
        const buf = this._buffer.shiftFirst(this._missing);
        if (buf === null) return false;
        this._missing -= buf.byteLength;
        const drained = this._stream.push(buf);
        if (this._missing === 0) {
          this._stream.push(null);
          if (drained) this._stream._detach();
          return drained && this._locked === false;
        }
        return drained;
      }
      _createStream() {
        return new Source(this, this._header, this._offset);
      }
      _update() {
        while (this._buffer.buffered > 0 && !this.destroying) {
          if (this._missing > 0) {
            if (this._stream !== null) {
              if (this._consumeStream() === false) return;
              continue;
            }
            if (this._longHeader === true) {
              if (this._missing > this._buffer.buffered) break;
              if (this._consumeLongHeader() === false) return false;
              continue;
            }
            const ignore = this._buffer.shiftFirst(this._missing);
            if (ignore !== null) this._missing -= ignore.byteLength;
            continue;
          }
          if (this._buffer.buffered < 512) break;
          if (this._stream !== null || this._consumeHeader() === false) return;
        }
        this._continueWrite(null);
      }
      _continueWrite(err) {
        const cb = this._callback;
        this._callback = noop;
        cb(err);
      }
      _write(data, cb) {
        this._callback = cb;
        this._buffer.push(data);
        this._update();
      }
      _final(cb) {
        this._finished = this._missing === 0 && this._buffer.buffered === 0;
        cb(this._finished ? null : new Error('Unexpected end of data'));
      }
      _predestroy() {
        this._continueWrite(null);
      }
      _destroy(cb) {
        if (this._stream) this._stream.destroy(getStreamError(this));
        cb(null);
      }
      [Symbol.asyncIterator]() {
        let error = null;
        let promiseResolve = null;
        let promiseReject = null;
        let entryStream = null;
        let entryCallback = null;
        const extract = this;
        this.on('entry', onentry);
        this.on('error', (err) => {
          error = err;
        });
        this.on('close', onclose);
        return {
          [Symbol.asyncIterator]() {
            return this;
          },
          next() {
            return new Promise(onnext);
          },
          return() {
            return destroy(null);
          },
          throw(err) {
            return destroy(err);
          },
        };
        function consumeCallback(err) {
          if (!entryCallback) return;
          const cb = entryCallback;
          entryCallback = null;
          cb(err);
        }
        function onnext(resolve2, reject) {
          if (error) {
            return reject(error);
          }
          if (entryStream) {
            resolve2({ value: entryStream, done: false });
            entryStream = null;
            return;
          }
          promiseResolve = resolve2;
          promiseReject = reject;
          consumeCallback(null);
          if (extract._finished && promiseResolve) {
            promiseResolve({ value: void 0, done: true });
            promiseResolve = promiseReject = null;
          }
        }
        function onentry(header, stream, callback) {
          entryCallback = callback;
          stream.on('error', noop);
          if (promiseResolve) {
            promiseResolve({ value: stream, done: false });
            promiseResolve = promiseReject = null;
          } else {
            entryStream = stream;
          }
        }
        function onclose() {
          consumeCallback(error);
          if (!promiseResolve) return;
          if (error) promiseReject(error);
          else promiseResolve({ value: void 0, done: true });
          promiseResolve = promiseReject = null;
        }
        function destroy(err) {
          extract.destroy(err);
          consumeCallback(err);
          return new Promise((resolve2, reject) => {
            if (extract.destroyed) return resolve2({ value: void 0, done: true });
            extract.once('close', function () {
              if (err) reject(err);
              else resolve2({ value: void 0, done: true });
            });
          });
        }
      }
    };
    module2.exports = function extract(opts) {
      return new Extract(opts);
    };
    function noop() {}
    function overflow(size) {
      size &= 511;
      return size && 512 - size;
    }
  },
});

// node_modules/tar-stream/constants.js
var require_constants4 = __commonJS({
  'node_modules/tar-stream/constants.js'(exports2, module2) {
    var constants2 = {
      // just for envs without fs
      S_IFMT: 61440,
      S_IFDIR: 16384,
      S_IFCHR: 8192,
      S_IFBLK: 24576,
      S_IFIFO: 4096,
      S_IFLNK: 40960,
    };
    try {
      module2.exports = require('fs').constants || constants2;
    } catch {
      module2.exports = constants2;
    }
  },
});

// node_modules/tar-stream/pack.js
var require_pack = __commonJS({
  'node_modules/tar-stream/pack.js'(exports2, module2) {
    var { Readable, Writable: Writable3, getStreamError } = require_streamx();
    var b4a = require_b4a();
    var constants2 = require_constants4();
    var headers = require_headers();
    var DMODE = 493;
    var FMODE = 420;
    var END_OF_TAR = b4a.alloc(1024);
    var Sink = class extends Writable3 {
      constructor(pack, header, callback) {
        super({ mapWritable, eagerOpen: true });
        this.written = 0;
        this.header = header;
        this._callback = callback;
        this._linkname = null;
        this._isLinkname = header.type === 'symlink' && !header.linkname;
        this._isVoid = header.type !== 'file' && header.type !== 'contiguous-file';
        this._finished = false;
        this._pack = pack;
        this._openCallback = null;
        if (this._pack._stream === null) this._pack._stream = this;
        else this._pack._pending.push(this);
      }
      _open(cb) {
        this._openCallback = cb;
        if (this._pack._stream === this) this._continueOpen();
      }
      _continuePack(err) {
        if (this._callback === null) return;
        const callback = this._callback;
        this._callback = null;
        callback(err);
      }
      _continueOpen() {
        if (this._pack._stream === null) this._pack._stream = this;
        const cb = this._openCallback;
        this._openCallback = null;
        if (cb === null) return;
        if (this._pack.destroying) return cb(new Error('pack stream destroyed'));
        if (this._pack._finalized) return cb(new Error('pack stream is already finalized'));
        this._pack._stream = this;
        if (!this._isLinkname) {
          this._pack._encode(this.header);
        }
        if (this._isVoid) {
          this._finish();
          this._continuePack(null);
        }
        cb(null);
      }
      _write(data, cb) {
        if (this._isLinkname) {
          this._linkname = this._linkname ? b4a.concat([this._linkname, data]) : data;
          return cb(null);
        }
        if (this._isVoid) {
          if (data.byteLength > 0) {
            return cb(new Error('No body allowed for this entry'));
          }
          return cb();
        }
        this.written += data.byteLength;
        if (this._pack.push(data)) return cb();
        this._pack._drain = cb;
      }
      _finish() {
        if (this._finished) return;
        this._finished = true;
        if (this._isLinkname) {
          this.header.linkname = this._linkname ? b4a.toString(this._linkname, 'utf-8') : '';
          this._pack._encode(this.header);
        }
        overflow(this._pack, this.header.size);
        this._pack._done(this);
      }
      _final(cb) {
        if (this.written !== this.header.size) {
          return cb(new Error('Size mismatch'));
        }
        this._finish();
        cb(null);
      }
      _getError() {
        return getStreamError(this) || new Error('tar entry destroyed');
      }
      _predestroy() {
        this._pack.destroy(this._getError());
      }
      _destroy(cb) {
        this._pack._done(this);
        this._continuePack(this._finished ? null : this._getError());
        cb();
      }
    };
    var Pack = class extends Readable {
      constructor(opts) {
        super(opts);
        this._drain = noop;
        this._finalized = false;
        this._finalizing = false;
        this._pending = [];
        this._stream = null;
      }
      entry(header, buffer, callback) {
        if (this._finalized || this.destroying) throw new Error('already finalized or destroyed');
        if (typeof buffer === 'function') {
          callback = buffer;
          buffer = null;
        }
        if (!callback) callback = noop;
        if (!header.size || header.type === 'symlink') header.size = 0;
        if (!header.type) header.type = modeToType(header.mode);
        if (!header.mode) header.mode = header.type === 'directory' ? DMODE : FMODE;
        if (!header.uid) header.uid = 0;
        if (!header.gid) header.gid = 0;
        if (!header.mtime) header.mtime = /* @__PURE__ */ new Date();
        if (typeof buffer === 'string') buffer = b4a.from(buffer);
        const sink = new Sink(this, header, callback);
        if (b4a.isBuffer(buffer)) {
          header.size = buffer.byteLength;
          sink.write(buffer);
          sink.end();
          return sink;
        }
        if (sink._isVoid) {
          return sink;
        }
        return sink;
      }
      finalize() {
        if (this._stream || this._pending.length > 0) {
          this._finalizing = true;
          return;
        }
        if (this._finalized) return;
        this._finalized = true;
        this.push(END_OF_TAR);
        this.push(null);
      }
      _done(stream) {
        if (stream !== this._stream) return;
        this._stream = null;
        if (this._finalizing) this.finalize();
        if (this._pending.length) this._pending.shift()._continueOpen();
      }
      _encode(header) {
        if (!header.pax) {
          const buf = headers.encode(header);
          if (buf) {
            this.push(buf);
            return;
          }
        }
        this._encodePax(header);
      }
      _encodePax(header) {
        const paxHeader = headers.encodePax({
          name: header.name,
          linkname: header.linkname,
          pax: header.pax,
        });
        const newHeader = {
          name: 'PaxHeader',
          mode: header.mode,
          uid: header.uid,
          gid: header.gid,
          size: paxHeader.byteLength,
          mtime: header.mtime,
          type: 'pax-header',
          linkname: header.linkname && 'PaxHeader',
          uname: header.uname,
          gname: header.gname,
          devmajor: header.devmajor,
          devminor: header.devminor,
        };
        this.push(headers.encode(newHeader));
        this.push(paxHeader);
        overflow(this, paxHeader.byteLength);
        newHeader.size = header.size;
        newHeader.type = header.type;
        this.push(headers.encode(newHeader));
      }
      _doDrain() {
        const drain = this._drain;
        this._drain = noop;
        drain();
      }
      _predestroy() {
        const err = getStreamError(this);
        if (this._stream) this._stream.destroy(err);
        while (this._pending.length) {
          const stream = this._pending.shift();
          stream.destroy(err);
          stream._continueOpen();
        }
        this._doDrain();
      }
      _read(cb) {
        this._doDrain();
        cb();
      }
    };
    module2.exports = function pack(opts) {
      return new Pack(opts);
    };
    function modeToType(mode) {
      switch (mode & constants2.S_IFMT) {
        case constants2.S_IFBLK:
          return 'block-device';
        case constants2.S_IFCHR:
          return 'character-device';
        case constants2.S_IFDIR:
          return 'directory';
        case constants2.S_IFIFO:
          return 'fifo';
        case constants2.S_IFLNK:
          return 'symlink';
      }
      return 'file';
    }
    function noop() {}
    function overflow(self, size) {
      size &= 511;
      if (size) self.push(END_OF_TAR.subarray(0, 512 - size));
    }
    function mapWritable(buf) {
      return b4a.isBuffer(buf) ? buf : b4a.from(buf);
    }
  },
});

// node_modules/tar-stream/index.js
var require_tar_stream = __commonJS({
  'node_modules/tar-stream/index.js'(exports2) {
    exports2.extract = require_extract();
    exports2.pack = require_pack();
  },
});

// src/cli/index.ts
var cli_exports = {};
__export(cli_exports, {
  cli: () => cli,
});
module.exports = __toCommonJS(cli_exports);

// node_modules/commander/esm.mjs
var import_index = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help,
} = import_index.default;

// src/cli/add/index.ts
var import_fs6 = require('fs');
var import_detect_indent2 = __toESM(require_detect_indent());

// src/cache/index.ts
var import_fs = require('fs');
var import_crypto = __toESM(require('crypto'));
var import_os = __toESM(require('os'));
var import_path2 = __toESM(require('path'));

// src/constants.ts
var import_path = __toESM(require('path'));

// package.json
var package_default = {
  name: 'nari',
  version: '0.0.7',
  bin: './lib/nari',
  scripts: {
    build:
      "rm -rf ./lib && esbuild src/index.ts --sourcemap --bundle --platform=node --target=node18 --external:./cli --outfile=lib/nari '--banner:js=#!/usr/bin/env node' && chmod +x lib/nari && esbuild src/cli/index.ts --sourcemap --bundle --platform=node --target=node18 --outfile=lib/cli.js",
    test: 'jest',
    nari: 'nari build && node --enable-source-maps lib/nari',
    'test:watch': 'jest --watch',
    lint: 'eslint --fix',
    prepack: 'nari build && nari lint && nari test',
  },
  repository: {
    type: 'git',
    url: 'https://github.com/narijs/nari',
  },
  bugs: {
    url: 'https://github.com/narijs/nari/issues',
  },
  keywords: ['modules', 'install', 'package manager'],
  author: 'SysGears (Cyprus) Limited',
  license: 'MIT',
  devDependencies: {
    '@types/jest': '^29.5.13',
    '@types/node': '^22.7.4',
    '@typescript-eslint/eslint-plugin': '^8.7.0',
    '@typescript-eslint/parser': '^8.7.0',
    commander: '^12.1.0',
    'detect-indent': '^6.0.0',
    micromatch: '^4.0.8',
    semver: '^7.6.3',
    'tar-stream': '^3.1.7',
    esbuild: '^0.24.0',
    'esbuild-jest': '^0.5.0',
    eslint: '^9.11.1',
    'eslint-config-prettier': '^9.1.0',
    'eslint-plugin-header': '^3.1.1',
    'eslint-plugin-jest': '^28.8.3',
    'eslint-plugin-prettier': '^5.2.1',
    husky: '^9.1.6',
    jest: '^29.7.0',
    'lint-staged': '^15.2.10',
    prettier: '^3.3.3',
    typescript: '~5.5.0',
  },
  'lint-staged': {
    '*.ts': ['eslint --fix -c tslint.json', 'git add'],
  },
  prettier: {
    printWidth: 120,
    singleQuote: true,
    parser: 'typescript',
  },
  husky: {
    'pre-commit': 'lint-staged',
  },
  lockTime: '2024-10-02T12:40:33.928Z',
};

// src/constants.ts
var VERSION = package_default.version;
var TOOL_NAME = 'nari';
var CACHE_VERSION = `v1`;
var NODE_MODULES = 'node_modules';
var DOT_BIN = '.bin';
var DOWNLOAD_DIR = import_path.default.join(NODE_MODULES, `.${TOOL_NAME}`);
var BUILD_SCRIPTS = ['preinstall', 'install', 'postinstall'];
var DEPENDENCY_TYPES = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

// src/cache/index.ts
var dirCache = /* @__PURE__ */ new Set();
var isPathExists = async (entryPath) =>
  import_fs.promises
    .stat(entryPath)
    .then(() => true)
    .catch(() => false);
var cachedCreateDir = async (dirPath) => {
  if (!dirCache.has(dirPath)) {
    await import_fs.promises.mkdir(dirPath, { recursive: true });
    const parts = dirPath.split(import_path2.default.sep);
    for (let idx = 1; idx <= parts.length; idx++) {
      let subPath = parts.slice(0, idx).join(import_path2.default.sep);
      subPath = subPath === '' ? import_path2.default.sep : subPath;
      dirCache.add(subPath);
    }
  }
};
var getCacheDir = () => {
  let cacheHome;
  if (process.platform === 'win32') {
    cacheHome = process.env.LOCALAPPDATA;
  } else if (process.env.XDG_CACHE_HOME) {
    cacheHome = process.env.XDG_CACHE_HOME;
  }
  if (!cacheHome) {
    cacheHome = import_path2.default.join(import_os.default.homedir(), '.cache');
  }
  return import_path2.default.join(cacheHome, TOOL_NAME, CACHE_VERSION);
};
var isCacheDirExists = null;
var ensureCacheDirExists = async () => {
  if (isCacheDirExists === null) {
    isCacheDirExists =
      (await import_fs.promises
        .stat(import_path2.default.join(CACHE_DIR, 'tarballs'))
        .then(() => true)
        .catch(() => false)) &&
      (await import_fs.promises
        .stat(import_path2.default.join(CACHE_DIR, 'metadata'))
        .then(() => true)
        .catch(() => false));
  }
  if (isCacheDirExists === false) {
    await import_fs.promises.mkdir(import_path2.default.join(CACHE_DIR, 'tarballs'), { recursive: true });
    await import_fs.promises.mkdir(import_path2.default.join(CACHE_DIR, 'metadata'), { recursive: true });
    isCacheDirExists = true;
  }
};
var CACHE_DIR = getCacheDir();
var atomicFileWrite = async (filePath, content) => {
  const tmpPath = import_path2.default.join(
    import_path2.default.dirname(filePath),
    `${import_crypto.default.randomBytes(16).toString(`hex`)}.tmp`,
  );
  try {
    await import_fs.promises.writeFile(tmpPath, content);
    try {
      await import_fs.promises.link(tmpPath, filePath);
    } catch {}
  } finally {
    await import_fs.promises.unlink(tmpPath);
  }
};

// src/resolver/registry.ts
var import_fs2 = require('fs');
var import_path3 = __toESM(require('path'));
var import_stream = require('stream');
var import_promises = require('stream/promises');
var import_zlib = __toESM(require('zlib'));

// src/net/index.ts
var import_dns = __toESM(require('dns'));
var import_https = __toESM(require('https'));
var ipv6 = true;
var disableIpv6 = () => (ipv6 = false);
var agent = new import_https.default.Agent({
  lookup: (hostname, opts, cb) => {
    import_dns.default.lookup(hostname, opts, (err, address, family) => {
      let resolvedAddress = address;
      if (Array.isArray(address) && !ipv6) {
        resolvedAddress = address.filter((a) => a.family !== 6);
      }
      cb(err, resolvedAddress, family);
    });
  },
  keepAlive: true,
  maxSockets: 64,
});
import_https.default.globalAgent = agent;
var request = async (url, options) => {
  return new Promise((resolve2) => {
    import_https.default
      .get(url, options, (response) => resolve2({ response }))
      .on('error', (error) => resolve2({ error }));
  });
};
var MAX_RETRIES = 5;
var RETRY_TIMEOUT = 1e3;
var get = async (url, opts) => {
  const headers = opts?.headers || {};
  headers['User-Agent'] = `${TOOL_NAME}/${VERSION} npm/? node/${process.version} ${process.platform} ${process.arch}`;
  let retries = 0;
  let lastError;
  do {
    const { response, error } = await request(url, { headers });
    if (response) {
      return response;
    } else {
      lastError = error;
    }
    if (error.code && error.code === 'ENETUNREACH') {
      disableIpv6();
    }
    retries++;
    if (retries > 1) {
      await new Promise((r) => setTimeout(r, RETRY_TIMEOUT));
    }
  } while (retries < MAX_RETRIES);
  throw lastError;
};

// src/resolver/registry.ts
var minimizeMetadata = (metaJson) => {
  for (const key of Object.keys(metaJson)) {
    if (['name', 'version', 'dist-tags', 'versions', 'time'].indexOf(key) < 0) {
      delete metaJson[key];
    }
  }
  for (const versionJson of Object.values(metaJson.versions)) {
    for (const key of Object.keys(versionJson)) {
      if (
        [
          'name',
          'version',
          'license',
          'engines',
          'dist',
          'exports',
          'scripts',
          'bin',
          'dependencies',
          'peerDependencies',
          'optionalDependencies',
          'peerDependenciesMeta',
          'os',
          'cpu',
          'libc',
        ].indexOf(key) < 0
      ) {
        delete versionJson[key];
      }
    }
    for (const key of Object.keys(versionJson['dist'])) {
      if (['tarball', 'integrity'].indexOf(key) < 0) {
        delete versionJson['dist'][key];
      }
    }
    for (const key of Object.keys(versionJson['scripts'] || {})) {
      if (
        ['preinstall', 'install', 'postinstall', 'prepublish', 'preprepare', 'prepare', 'postprepare'].indexOf(key) < 0
      ) {
        delete versionJson['scripts'][key];
      }
    }
    if (Object.keys(versionJson['scripts'] || {}).length === 0) {
      delete versionJson['scripts'];
    }
  }
  metaJson['_nariRefVer'] = 1;
};
var getMetadataCacheFilePath = (name) => {
  const filename = `${name.replaceAll('/', '-')}.tjson`;
  const filePath = import_path3.default.join(CACHE_DIR, 'metadata', filename);
  return filePath;
};
var getCachedMetadata = async (name) => {
  const filePath = getMetadataCacheFilePath(name);
  const isFileCached = await isPathExists(filePath);
  let metaJson, jsonList;
  if (isFileCached) {
    const contents = await import_fs2.promises.readFile(filePath, 'utf8');
    jsonList = contents.split('\n');
    const cacheMeta = JSON.parse(jsonList[0]);
    cacheMeta.date = new Date(cacheMeta.date);
    metaJson = JSON.parse(jsonList[1]);
    return { metaJson, cacheMeta };
  } else {
    return null;
  }
};
var downloadMetadata = async (name, cachedMetadata) => {
  const headers = { 'Accept-Encoding': 'gzip' };
  if (cachedMetadata) {
    headers['if-none-match'] = cachedMetadata.cacheMeta.etag;
  }
  try {
    const response = await get(`https://registry.npmjs.org/${name}`, { headers });
    const unzip =
      response.headers['content-encoding'] === 'gzip'
        ? import_zlib.default.createGunzip()
        : new import_stream.PassThrough();
    const chunks = [];
    await (0, import_promises.pipeline)(
      response,
      unzip,
      new import_stream.Writable({
        write(chunk, _encoding, callback) {
          chunks.push(chunk);
          callback();
        },
      }),
    );
    const data = Buffer.concat(chunks);
    let metaJson;
    if (response.statusCode === 304) {
      metaJson = cachedMetadata.metaJson;
    } else if (response.statusCode === 200) {
      const etag = response.headers['etag'];
      const date = response.headers['date'];
      const cachedFilePath = getMetadataCacheFilePath(name);
      if (cachedMetadata) {
        await import_fs2.promises.rm(cachedFilePath, { force: true });
      }
      metaJson = JSON.parse(data.toString('utf-8'));
      minimizeMetadata(metaJson);
      await atomicFileWrite(
        cachedFilePath,
        `${JSON.stringify({ etag, date })}
${JSON.stringify(metaJson)}`,
      );
    } else {
      throw new Error(`the registry replied with status: ${response.statusCode}: ${data.toString('utf-8')}`);
    }
    return metaJson;
  } catch (e) {
    e.message = `While fetching https://registry.npmjs.org/${name}: ${e.message}`;
    throw e;
  }
};

// src/cli/add/addScript.ts
var import_semver2 = __toESM(require_semver2());

// src/resolver/resolver.ts
var import_fs4 = require('fs');
var import_path5 = __toESM(require('path'));
var import_detect_indent = __toESM(require_detect_indent());

// src/resolver/workspace.ts
var import_fs3 = require('fs');
var import_micromatch = __toESM(require_micromatch());
var import_path4 = __toESM(require('path'));
var IGNORED_WORKSPACE_DIRECTORIES = /* @__PURE__ */ new Set(['.git', NODE_MODULES]);
var readWorkspaceTree = async ({ json, relativePath, directories }) => {
  const pkg = { json, workspacePath: relativePath };
  const workspaceConfig = Array.isArray(json.workspaces) ? { packages: json.workspaces } : json.workspaces;
  if (workspaceConfig?.packages?.length > 0) {
    if (!directories) {
      directories = await getProjectDirectories();
    }
    const matchedDirectories = (0, import_micromatch.default)(directories, workspaceConfig.packages);
    for (const dir of matchedDirectories) {
      try {
        const json2 = JSON.parse(
          await import_fs3.promises.readFile(import_path4.default.join(dir, 'package.json'), 'utf8'),
        );
        const relativeDirectories = [];
        for (const subdir of directories) {
          const subdirRelativePath = import_path4.default.relative(dir, subdir);
          if (subdirRelativePath !== '' && !subdirRelativePath.startsWith('.')) {
            relativeDirectories.push(subdirRelativePath);
          }
        }
        const workspace = await readWorkspaceTree({ json: json2, relativePath: dir, directories: relativeDirectories });
        pkg.workspaces = pkg.workspaces || [];
        pkg.workspaces.push(workspace);
      } catch (e) {
        if (e?.code !== 'ENOENT') throw e;
      }
    }
  }
  return pkg;
};
var getProjectDirectories = async () => {
  const directories = [];
  const addDirectory = async (baseDir) => {
    const entries = await import_fs3.promises.readdir(baseDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !IGNORED_WORKSPACE_DIRECTORIES.has(entry.name)) {
        const dir = import_path4.default.join(baseDir, entry.name);
        directories.push(dir);
        await addDirectory(dir);
      }
    }
  };
  await addDirectory('.');
  return directories;
};

// src/resolver/resolveScript.ts
var import_semver = __toESM(require_semver2());

// src/resolver/dependencies.ts
var getDependencies = (packageJson, includeDev) => {
  const regular = /* @__PURE__ */ new Map();
  const regularType = /* @__PURE__ */ new Map();
  const peer = /* @__PURE__ */ new Map();
  const optionalPeerNames = /* @__PURE__ */ new Set();
  const optionalNames = /* @__PURE__ */ new Set();
  for (const [name, range] of Object.entries(packageJson.dependencies || {})) {
    regular.set(name, range);
    regularType.set(name, 'dependencies' /* DEPENDENCIES */);
  }
  for (const [name, range] of Object.entries(packageJson.optionalDependencies || {})) {
    optionalNames.add(name);
    regular.set(name, range);
    regularType.set(name, 'optionalDependencies' /* OPTIONAL_DEPENDENCIES */);
  }
  if (includeDev) {
    for (const [name, range] of Object.entries(packageJson.devDependencies || {})) {
      regular.set(name, range);
      regularType.set(name, 'devDependencies' /* DEV_DEPENDENCIES */);
    }
  }
  for (const [name, range] of Object.entries(packageJson.peerDependencies || {})) {
    peer.set(name, range);
  }
  for (const [name, value] of Object.entries(packageJson.peerDependenciesMeta || {})) {
    if (value.optional === true && peer.has(name)) {
      optionalPeerNames.add(name);
    }
  }
  return { regular, regularType, peer, optionalPeerNames, optionalNames };
};

// src/hoister/decision.ts
var getHoistingDecision = (graphPath, depName, currentPriorityDepth) => {
  const parentPkg = graphPath[graphPath.length - 1];
  const dep = parentPkg.dependencies.get(depName);
  const realDepId = fromAliasedId(dep.id).id;
  let isHoistable = 'YES'; /* YES */
  const dependsOn = /* @__PURE__ */ new Set();
  let priorityDepth = 0;
  let newParentIndex;
  let reason;
  let waterMark = 0;
  for (let idx = graphPath.length - 1; idx >= 0; idx--) {
    const newParentPkg = graphPath[idx];
    const newParentDep = newParentPkg.dependencies?.get(depName);
    if (newParentDep && newParentDep.id !== dep.id) {
      waterMark = idx + 1;
      if (newParentDep.queueIndex && waterMark !== graphPath.length - 1) {
        isHoistable = 'LATER' /* LATER */;
        priorityDepth = newParentDep.queueIndex;
      } else {
        reason = `${dep.id} is blocked by a conflicting dependency ${newParentDep.id} at ${printGraphPath(
          graphPath.slice(0, idx + 1),
        )}`;
      }
      break;
    }
    if (newParentPkg.wall && (newParentPkg.wall.size === 0 || newParentPkg.wall.has(depName))) {
      waterMark = idx;
      reason = `${dep.id} is blocked by the hoisting wall at ${newParentPkg.id}`;
      break;
    }
  }
  if (isHoistable === 'YES' /* YES */) {
    for (let idx = graphPath.length - 2; idx >= waterMark; idx--) {
      const newParentPkg = graphPath[idx];
      let hasBinConflicts = false;
      for (const scriptName of dep.ownBinEntries) {
        const pkgId = newParentPkg.binEntries.get(scriptName);
        if (pkgId && pkgId !== realDepId) {
          waterMark = idx + 1;
          reason = `${dep.id} is blocked by the coflicting bin script ${scriptName} from ${pkgId} at ${newParentPkg.id}`;
          hasBinConflicts = true;
          break;
        }
      }
      if (hasBinConflicts) {
        break;
      }
    }
  }
  if (isHoistable === 'YES' /* YES */) {
    for (newParentIndex = waterMark; newParentIndex < graphPath.length - 1; newParentIndex++) {
      const newParentPkg = graphPath[newParentIndex];
      const newParentDep = newParentPkg.dependencies?.get(depName);
      if (!newParentPkg.hoistingPriorities.get(depName)) {
        console.log(
          depName,
          graphPath.map((n) => n.id),
          parentPkg.dependencies?.get('@gqlapp/look-client-react')?.workspace?.id,
          parentPkg.dependencies?.get('@gqlapp/look-client-react')?.workspace ===
            parentPkg.dependencies?.get('@gqlapp/look-client-react'),
        );
      }
      priorityDepth = newParentPkg.hoistingPriorities.get(depName).indexOf(dep.id);
      if (!newParentDep) {
        const isDepTurn = priorityDepth <= currentPriorityDepth;
        if (!isDepTurn) {
          isHoistable = 'LATER' /* LATER */;
          break;
        }
      }
      let canBeHoisted = true;
      if (dep.dependencies) {
        for (const [hoistedName, hoistedDep] of dep.dependencies) {
          if (hoistedDep.newParent) {
            const originalId = hoistedDep.id;
            const availableId = newParentPkg.dependencies.get(hoistedName)?.id;
            if (availableId !== originalId) {
              canBeHoisted = false;
              reason = `hoisting ${dep.id} to ${printGraphPath(
                graphPath.slice(0, newParentIndex + 1),
              )} will result in usage of ${availableId || "'none'"} instead of ${originalId}`;
              break;
            }
          }
        }
      }
      if (canBeHoisted) {
        break;
      }
    }
  }
  if (isHoistable === 'YES' /* YES */) {
    if (dep.peerNames) {
      for (const peerName of dep.peerNames.keys()) {
        if (peerName !== depName) {
          let peerParent;
          let peerParentIdx;
          for (let idx = graphPath.length - 1; idx >= 0; idx--) {
            if (!graphPath[idx].peerNames?.has(peerName)) {
              peerParentIdx = idx;
              peerParent = graphPath[idx];
              break;
            }
          }
          const peerDep = peerParent.dependencies?.get(peerName);
          if (peerDep) {
            const depPriority = graphPath[newParentIndex].hoistingPriorities.get(depName).indexOf(dep.id);
            if (depPriority <= currentPriorityDepth) {
              if (peerParentIdx === graphPath.length - 1) {
                isHoistable = 'DEPENDS' /* DEPENDS */;
                dependsOn.add(peerName);
              } else {
                if (peerParentIdx > newParentIndex) {
                  newParentIndex = peerParentIdx;
                  reason = `unable to hoist ${dep.id} over peer dependency ${printGraphPath(
                    graphPath.slice(0, newParentIndex + 1).concat([peerDep]),
                  )}`;
                }
              }
            } else {
              isHoistable = 'LATER' /* LATER */;
              priorityDepth = Math.max(priorityDepth, depPriority);
            }
          }
        }
      }
    }
  }
  if (isHoistable === 'LATER' /* LATER */) {
    return { isHoistable, queueIndex: priorityDepth };
  } else if (isHoistable === 'DEPENDS' /* DEPENDS */) {
    const result = { isHoistable, dependsOn, newParentIndex };
    if (reason) {
      result.reason = reason;
    }
    return result;
  } else {
    const result = { isHoistable: 'YES' /* YES */, newParentIndex };
    if (reason) {
      result.reason = reason;
    }
    return result;
  }
};
var finalizeDependedDecisions = (graphPath, preliminaryDecisionMap, opts) => {
  const parentPkg = graphPath[graphPath.length - 1];
  const options = opts || { trace: false };
  const finalDecisions = {
    decisionMap: /* @__PURE__ */ new Map(),
    circularPackageNames: /* @__PURE__ */ new Set(),
  };
  const dependsOn = /* @__PURE__ */ new Map();
  const getRecursiveDependees = (dependant, seen) => {
    const dependees = /* @__PURE__ */ new Set();
    if (seen.has(dependant)) return dependees;
    seen.add(dependant);
    const decision = preliminaryDecisionMap.get(dependant);
    if (decision && decision.isHoistable === 'DEPENDS' /* DEPENDS */) {
      for (const dependee of decision.dependsOn) {
        dependees.add(dependee);
        const nestedDependees = getRecursiveDependees(dependee, seen);
        for (const nestedDependee of nestedDependees) {
          dependees.add(nestedDependee);
        }
      }
    }
    dependees.delete(dependant);
    return dependees;
  };
  for (const [dependantName, decision] of preliminaryDecisionMap) {
    if (decision.isHoistable === 'DEPENDS' /* DEPENDS */) {
      const dependees = getRecursiveDependees(dependantName, /* @__PURE__ */ new Set());
      dependsOn.set(dependantName, dependees);
      const dependeesArray = Array.from(dependees);
      for (let idx = dependeesArray.length - 1; idx >= 0; idx--) {
        const dependee = dependeesArray[idx];
        const dependeeDecision = preliminaryDecisionMap.get(dependee);
        if (dependeeDecision && !finalDecisions.decisionMap.has(dependee)) {
          finalDecisions.decisionMap.set(dependee, dependeeDecision);
        }
      }
    } else {
      finalDecisions.decisionMap.set(dependantName, decision);
    }
  }
  for (const [dependantName, dependees] of dependsOn) {
    const originalDecision = preliminaryDecisionMap.get(dependantName);
    if (originalDecision.isHoistable === 'DEPENDS' /* DEPENDS */) {
      let isHoistable = originalDecision.isHoistable;
      let priorityDepth = 0;
      let newParentIndex = originalDecision.newParentIndex;
      let reason = originalDecision.reason;
      for (const dependeeName of dependees) {
        const dependeeDecision = preliminaryDecisionMap.get(dependeeName);
        if (dependeeDecision) {
          if (dependeeDecision.isHoistable === 'LATER' /* LATER */) {
            isHoistable = 'LATER' /* LATER */;
            priorityDepth = Math.max(priorityDepth, dependeeDecision.queueIndex);
          } else if (isHoistable !== 'LATER' /* LATER */) {
            if (dependeeDecision.isHoistable === 'YES' /* YES */) {
              isHoistable = 'YES' /* YES */;
            }
            if (dependeeDecision.newParentIndex > newParentIndex) {
              newParentIndex = dependeeDecision.newParentIndex;
              reason = `peer dependency was not hoisted, due to ${dependeeDecision.reason}`;
            }
          }
        }
      }
      if (isHoistable !== 'DEPENDS' /* DEPENDS */ || newParentIndex > originalDecision.newParentIndex) {
        let finalDecision;
        if (isHoistable === 'LATER' /* LATER */) {
          finalDecision = { isHoistable, queueIndex: priorityDepth };
        } else if (isHoistable === 'YES' /* YES */) {
          finalDecision = { isHoistable, newParentIndex };
          if (reason) {
            finalDecision.reason = reason;
          }
        } else {
          finalDecision = { isHoistable, newParentIndex, dependsOn: originalDecision.dependsOn };
          if (reason) {
            finalDecision.reason = reason;
          }
        }
        finalDecisions.decisionMap.set(dependantName, finalDecision);
      }
    }
  }
  for (const depName of finalDecisions.decisionMap.keys()) {
    const decision = finalDecisions.decisionMap.get(depName);
    if (decision.isHoistable === 'DEPENDS' /* DEPENDS */) {
      finalDecisions.circularPackageNames.add(depName);
    }
  }
  if (options.trace) {
    const prettifyDecision = (decision) => ({
      ...decision,
      isHoistable:
        decision.isHoistable !== 'YES' /* YES */ || decision.newParentIndex !== graphPath.length - 1
          ? decision.isHoistable.toString()
          : 'NO',
    });
    for (const depName of Array.from(finalDecisions.decisionMap.keys()).sort()) {
      const decision = finalDecisions.decisionMap.get(depName);
      const preliminaryDecision = preliminaryDecisionMap.get(depName);
      const args = [parentPkg.dependencies?.get(depName)?.id, prettifyDecision(preliminaryDecision)];
      if (preliminaryDecision !== decision) {
        args.push('finalized:');
        args.push(prettifyDecision(decision));
      }
      console.log(...args);
    }
  }
  return finalDecisions;
};

// src/hoister/priority.ts
var getUsages = (graph) => {
  const packageUsages = /* @__PURE__ */ new Map();
  const seen = /* @__PURE__ */ new Set();
  const visitDependency = (graphPath) => {
    const pkg = graphPath[graphPath.length - 1];
    let usedBy = packageUsages.get(pkg.id);
    let isSeen = false;
    if (!pkg.workspace || pkg.workspace !== pkg) {
      isSeen = seen.has(pkg.id);
      seen.add(pkg.id);
      if (!usedBy) {
        usedBy = /* @__PURE__ */ new Set();
        packageUsages.set(pkg.id, usedBy);
      }
      if (graphPath.length > 1) {
        usedBy.add(graphPath[graphPath.length - 2].id);
      }
    }
    if (pkg.peerNames) {
      for (const peerName of pkg.peerNames.keys()) {
        let peerDep;
        for (let idx = graphPath.length - 2; idx >= 0; idx--) {
          peerDep = graphPath[idx].dependencies?.get(peerName);
          if (peerDep) {
            let usedBy2 = packageUsages.get(peerDep.id);
            if (!usedBy2) {
              usedBy2 = /* @__PURE__ */ new Set();
              packageUsages.set(peerDep.id, usedBy2);
            }
            usedBy2.add(pkg.id);
            break;
          }
        }
      }
    }
    if (pkg.workspaces) {
      for (const dep of pkg.workspaces.values()) {
        graphPath.push(dep);
        visitDependency(graphPath);
        graphPath.pop();
      }
    }
    if (!isSeen) {
      if (pkg.dependencies) {
        for (const dep of pkg.dependencies.values()) {
          graphPath.push(dep);
          visitDependency(graphPath);
          graphPath.pop();
        }
      }
    }
  };
  visitDependency([graph]);
  return packageUsages;
};
var getChildren = (graph) => {
  const children = /* @__PURE__ */ new Map();
  const visitDependency = (graphPath) => {
    const pkg = graphPath[graphPath.length - 1];
    let isSeen = false;
    if (!pkg.workspace || pkg.workspace !== pkg) {
      let pkgPriority = children.get(pkg.id);
      isSeen = typeof pkgPriority !== 'undefined';
      pkgPriority = pkgPriority || { internalPriority: 0, userPriority: 0 };
      if (graphPath.length > 1) {
        const parent = graphPath[graphPath.length - 2];
        let priority = 0;
        if (parent.workspace === parent) {
          priority = 1;
        } else if (parent.packageType === 'PORTAL' /* PORTAL */) {
          priority = 2;
        }
        children.set(pkg.id, {
          internalPriority: Math.max(pkgPriority.internalPriority, priority),
          userPriority: Math.max(pkgPriority.userPriority, pkg.priority || 0),
        });
      }
    }
    if (pkg.workspaces) {
      for (const dep of pkg.workspaces.values()) {
        graphPath.push(dep);
        visitDependency(graphPath);
        graphPath.pop();
      }
    }
    if (!isSeen) {
      if (pkg.dependencies) {
        for (const dep of pkg.dependencies.values()) {
          if (!dep.newParent || dep.newParent === pkg) {
            graphPath.push(dep);
            visitDependency(graphPath);
            graphPath.pop();
          }
        }
      }
    }
  };
  visitDependency([graph]);
  return children;
};
var getPriorities = (usages, children) => {
  const priorities = /* @__PURE__ */ new Map();
  const pkgIds = Array.from(children.keys());
  pkgIds.sort((id1, id2) => {
    const priority1 = children.get(id1);
    const priority2 = children.get(id2);
    if (priority2.internalPriority !== priority1.internalPriority) {
      return priority2.internalPriority - priority1.internalPriority;
    } else if (priority2.userPriority !== priority1.userPriority) {
      return priority2.userPriority - priority1.userPriority;
    } else {
      const usage1 = usages.get(id1).size;
      const usage2 = usages.get(id2).size;
      if (usage2 !== usage1) {
        return usage2 - usage1;
      } else {
        return id2 > id1 ? -1 : 1;
      }
    }
  });
  for (const pkgId of pkgIds) {
    const pkgName = getPackageName(pkgId);
    let priorityList = priorities.get(pkgName);
    if (!priorityList) {
      priorityList = [];
      priorities.set(pkgName, priorityList);
    }
    priorityList.push(pkgId);
  }
  return priorities;
};

// src/hoister/workspace.ts
var getWorkspaceNodes = (graph) => {
  const workspaceNodes = /* @__PURE__ */ new Map();
  const visitWorkspace = (workspace) => {
    workspaceNodes.set(workspace.id, workspace);
    if (workspace.workspaces) {
      for (const dep of workspace.workspaces.values()) {
        visitWorkspace(dep);
      }
    }
  };
  visitWorkspace(graph);
  return workspaceNodes;
};
var getAlternativeWorkspaceRoutes = (graph, packageIds) => {
  const usages = /* @__PURE__ */ new Map();
  const seen = /* @__PURE__ */ new Set();
  const visitDependency = (graphRoute, node) => {
    const isSeen = seen.has(node);
    seen.add(node);
    const realId = fromAliasedId(node.id).id;
    if (packageIds.has(realId) && graphRoute.length > 0 && !graphRoute[graphRoute.length - 1].isWorkspaceDep) {
      let workspaceRoutes = usages.get(realId);
      if (!workspaceRoutes) {
        workspaceRoutes = /* @__PURE__ */ new Set();
        usages.set(realId, workspaceRoutes);
      }
      workspaceRoutes.add(graphRoute.slice(0));
    }
    if (!isSeen) {
      if (node.workspaces) {
        for (const [name, dep] of node.workspaces) {
          graphRoute.push({ isWorkspaceDep: true, name });
          visitDependency(graphRoute, dep);
          graphRoute.pop();
        }
      }
      if (node.dependencies) {
        for (const [name, dep] of node.dependencies) {
          graphRoute.push({ isWorkspaceDep: false, name });
          visitDependency(graphRoute, dep);
          graphRoute.pop();
        }
      }
    }
  };
  visitDependency([], graph);
  return usages;
};

// src/hoister/hoist.ts
var getPackageName = (pkgId) => {
  const idx = pkgId.indexOf(`@`, 1);
  return idx < 0 ? pkgId : pkgId.substring(0, idx);
};
var getGraphPath = (graphRoute, graph) => {
  const graphPath = [graph];
  let node = graph;
  for (const nextDep of graphRoute) {
    if (nextDep.isWorkspaceDep) {
      node = node.workspaces.get(nextDep.name);
    } else {
      node = node.dependencies.get(nextDep.name);
    }
    graphPath.push(node.workspace || node);
  }
  return graphPath;
};
var cloneNode = (node) => {
  if (node.workspace) return node;
  const clone = {
    id: node.id,
    hoistingPriorities: node.hoistingPriorities,
    lastDecisions: /* @__PURE__ */ new Map(),
    originalNode: node.originalNode,
    binEntries: new Map(node.binEntries),
    ownBinEntries: node.ownBinEntries,
  };
  if (node.packageType) {
    clone.packageType = node.packageType;
  }
  if (node.peerNames) {
    clone.peerNames = new Map(node.peerNames);
  }
  if (node.wall) {
    clone.wall = node.wall;
  }
  if (node.workspaces) {
    clone.workspaces = new Map(node.workspaces);
  }
  if (node.dependencies) {
    clone.dependencies = new Map(node.dependencies);
    const nodeName = getPackageName(node.id);
    const selfNameDep = node.dependencies.get(nodeName);
    if (selfNameDep === node) {
      clone.dependencies.set(nodeName, clone);
    }
  }
  if (node.priority) {
    clone.priority = node.priority;
  }
  return clone;
};
var getAliasedId = (pkg) => (!pkg.alias ? pkg.id : `${pkg.alias}@>${pkg.id}`);
var fromAliasedId = (aliasedId) => {
  const alias = getPackageName(aliasedId);
  const idIndex = aliasedId.indexOf('@>', alias.length);
  return idIndex < 0 ? { id: aliasedId } : { alias, id: aliasedId.substring(idIndex + 2) };
};
var populateImplicitPeers = (graph) => {
  const seen = /* @__PURE__ */ new Set();
  const visitDependency = (graphPath) => {
    const node = graphPath[graphPath.length - 1];
    const isSeen = seen.has(node);
    seen.add(node);
    if (node.peerNames && graphPath.length > 1) {
      const parent = graphPath[graphPath.length - 2];
      for (const [peerName, route] of node.peerNames) {
        if (route === null && !parent.dependencies?.has(peerName) && !parent.peerNames?.has(peerName)) {
          const route2 = [
            {
              name: getPackageName(node.id),
              isWorkspaceDep: node.workspace === node,
            },
          ];
          for (let idx = graphPath.length - 2; idx >= 0; idx--) {
            const parent2 = graphPath[idx];
            if (parent2.dependencies?.has(peerName)) {
              for (let j = idx + 1; j < graphPath.length - 1; j++) {
                const peerNode = graphPath[j];
                if (!peerNode.peerNames) {
                  peerNode.peerNames = /* @__PURE__ */ new Map();
                }
                if (!peerNode.peerNames.has(peerName)) {
                  peerNode.peerNames.set(peerName, route2);
                }
              }
              break;
            } else {
              route2.unshift({ name: getPackageName(parent2.id), isWorkspaceDep: parent2.workspace === parent2 });
            }
          }
        }
      }
    }
    if (!isSeen) {
      if (node.workspaces) {
        for (const dep of node.workspaces.values()) {
          graphPath.push(dep);
          visitDependency(graphPath);
          graphPath.pop();
        }
      }
      if (node.dependencies) {
        for (const dep of node.dependencies.values()) {
          graphPath.push(dep);
          visitDependency(graphPath);
          graphPath.pop();
        }
      }
    }
  };
  visitDependency([graph]);
};
var toWorkGraph = (rootPkg) => {
  const seen = /* @__PURE__ */ new Map();
  const workspaceNodes = /* @__PURE__ */ new Map();
  const workspaceRefs = /* @__PURE__ */ new Map();
  const idMap = /* @__PURE__ */ new Map();
  const createWorkspaceNodes = (pkg) => {
    const workspace = {
      id: pkg.id,
      hoistingPriorities: /* @__PURE__ */ new Map(),
      lastDecisions: /* @__PURE__ */ new Map(),
      originalNode: pkg,
      binEntries: /* @__PURE__ */ new Map(),
      ownBinEntries: /* @__PURE__ */ new Set(),
    };
    workspaceNodes.set(workspace.id, workspace);
    if (pkg.workspaces) {
      for (const dep of pkg.workspaces) {
        createWorkspaceNodes(dep);
      }
    }
  };
  createWorkspaceNodes(rootPkg);
  const convertNode = (pkg, isWorkspace, parent) => {
    const aliasedId = getAliasedId(pkg);
    if (!isWorkspace) {
      const seenIdInstance = idMap.get(aliasedId);
      if (typeof seenIdInstance !== 'undefined' && seenIdInstance.node !== pkg) {
        throw new Error(
          `Package ${pkg.id}${pkg.alias ? ' with alias ' + pkg.alias : ''} has multiple instances in the graph, which is disallowed:
1: ${JSON.stringify(seenIdInstance.node)}, parent: ${seenIdInstance.parent?.id}
2: ${JSON.stringify(pkg)}, parent: ${parent?.id}`,
        );
      }
      idMap.set(aliasedId, { node: pkg, parent });
    }
    const seenNode = seen.get(pkg);
    const newNode = isWorkspace
      ? workspaceNodes.get(pkg.id)
      : seenNode || {
          id: aliasedId,
          hoistingPriorities: /* @__PURE__ */ new Map(),
          lastDecisions: /* @__PURE__ */ new Map(),
          originalNode: pkg,
          binEntries: /* @__PURE__ */ new Map(),
          ownBinEntries: /* @__PURE__ */ new Set(),
        };
    seen.set(pkg, newNode);
    if (pkg === rootPkg) {
      newNode.workspace = newNode;
    }
    if (!seenNode) {
      if (pkg.packageType) {
        newNode.packageType = pkg.packageType;
      }
      if (pkg.peerNames) {
        newNode.peerNames = /* @__PURE__ */ new Map();
        for (const peerName of pkg.peerNames) {
          newNode.peerNames.set(peerName, null);
        }
      }
      if (pkg.wall) {
        newNode.wall = new Set(pkg.wall);
      }
      if (pkg.priority) {
        newNode.priority = pkg.priority;
      }
      if (pkg.bin) {
        for (const scriptName of Object.keys(pkg.bin)) {
          newNode.binEntries.set(scriptName, pkg.id);
          newNode.ownBinEntries.add(scriptName);
        }
      }
      if (pkg.workspaces && pkg.workspaces.length > 0) {
        newNode.workspaces = /* @__PURE__ */ new Map();
        for (const dep of pkg.workspaces) {
          const name = dep.alias || getPackageName(dep.id);
          const depNode = convertNode(dep, true, pkg);
          depNode.workspace = depNode;
          newNode.workspaces.set(name, depNode);
        }
      }
      if (pkg.dependencies && pkg.dependencies.length > 0) {
        newNode.dependencies = /* @__PURE__ */ new Map();
        for (const dep of pkg.dependencies || []) {
          const name = dep.alias || getPackageName(dep.id);
          const depNode = convertNode(dep, false, pkg);
          if (dep.bin) {
            for (const scriptName of Object.keys(dep.bin)) {
              newNode.binEntries.set(scriptName, dep.id);
            }
          }
          const workspace = workspaceNodes.get(dep.id);
          if (workspace) {
            let workspaceRef = workspaceRefs.get(depNode);
            if (!workspaceRef) {
              workspaceRef = {
                id: depNode.id,
                hoistingPriorities: /* @__PURE__ */ new Map(),
                lastDecisions: /* @__PURE__ */ new Map(),
                workspace,
                originalNode: depNode.originalNode,
                binEntries: /* @__PURE__ */ new Map(),
                ownBinEntries: /* @__PURE__ */ new Set(),
              };
              workspaceRefs.set(depNode, workspaceRef);
            }
            newNode.dependencies.set(name, workspaceRef);
          } else {
            newNode.dependencies.set(name, depNode);
          }
        }
      }
    }
    return newNode;
  };
  const graph = convertNode(rootPkg, true);
  graph.workspace = graph;
  const seenNodes = /* @__PURE__ */ new Set();
  const usages = getUsages(graph);
  const fillPriorities = (node) => {
    if (seenNodes.has(node)) return;
    seenNodes.add(node);
    const children = getChildren(node);
    node.hoistingPriorities = getPriorities(usages, children);
    if (node.workspaces) {
      for (const dep of node.workspaces.values()) {
        fillPriorities(dep);
      }
    }
    if (node.dependencies) {
      for (const dep of node.dependencies.values()) {
        fillPriorities(dep);
      }
    }
  };
  fillPriorities(graph);
  return graph;
};
var fromWorkGraph = (graph) => {
  const nodeMap = /* @__PURE__ */ new Map();
  const cloneNode2 = (node, parent) => {
    let pkg = nodeMap.get(node);
    if (pkg) return pkg;
    const { alias, id } = fromAliasedId(node.id);
    pkg = { id };
    if (alias) {
      pkg.alias = alias;
    }
    nodeMap.set(node, pkg);
    if (node.packageType) {
      pkg.packageType = node.packageType;
    }
    if (node.peerNames) {
      for (const [peerName, route] of node.peerNames) {
        if (route === null) {
          if (!pkg.peerNames) {
            pkg.peerNames = [];
          }
          pkg.peerNames.push(peerName);
        }
      }
    }
    if (node.reason) {
      pkg.reason = node.reason;
    }
    if (node.wall) {
      pkg.wall = Array.from(node.wall).sort();
    }
    if (node.priority) {
      pkg.priority = node.priority;
    }
    if (node.workspaces) {
      pkg.workspaces = [];
    }
    if (node.dependencies) {
      pkg.dependencies = [];
    }
    if (parent) {
      pkg.parent = parent;
    }
    if (!node.workspace || node.workspace === node) {
      const originalNode = node.originalNode;
      if (originalNode.bin) {
        pkg.bin = originalNode.bin;
      }
      if (originalNode.buildScripts) {
        pkg.buildScripts = originalNode.buildScripts;
      }
      if (originalNode.workspacePath) {
        pkg.workspacePath = originalNode.workspacePath;
      }
      if (originalNode.tarballUrl) {
        pkg.tarballUrl = originalNode.tarballUrl;
      }
      if (originalNode.optional) {
        pkg.optional = originalNode.optional;
      }
    }
    if (node.workspaces) {
      for (const dep of node.workspaces.values()) {
        cloneNode2(dep, pkg);
      }
    }
    if (node.dependencies) {
      for (const dep of node.dependencies.values()) {
        if (!dep.newParent || dep.newParent === node) {
          cloneNode2(dep, pkg);
        }
      }
    }
    return pkg;
  };
  const rootPkg = cloneNode2(graph, null);
  const getClonedNode = (node) => {
    const clonedNode = nodeMap.get(node);
    if (!clonedNode) {
      throw new Error(`Assertion: expected to have cloned node: ${node.id}`);
    }
    return clonedNode;
  };
  const visitDependency = (graphPath, pkg) => {
    let node = graphPath[graphPath.length - 1];
    if (graphPath.indexOf(node) !== graphPath.length - 1) return;
    if (node.workspaces) {
      const sortedEntries = Array.from(node.workspaces.entries()).sort((x1, x2) =>
        x1[0] === x2[0] ? 0 : x1[0] < x2[0] ? -1 : 1,
      );
      pkg.workspaces = [];
      for (const [, dep] of sortedEntries) {
        const depPkg = getClonedNode(dep);
        pkg.workspaces.push(depPkg);
        graphPath.push(dep);
        visitDependency(graphPath, depPkg);
        graphPath.pop();
      }
    }
    if (node.workspace) {
      pkg.workspace = getClonedNode(node.workspace);
    }
    if (node.dependencies) {
      const sortedEntries = Array.from(node.dependencies.entries()).sort((x1, x2) =>
        x1[0] === x2[0] ? 0 : x1[0] < x2[0] ? -1 : 1,
      );
      pkg.dependencies = [];
      for (const [depName, dep] of sortedEntries) {
        if (!dep.newParent || dep.newParent === node) {
          const depPkg = getClonedNode(dep);
          pkg.dependencies.push(depPkg);
          graphPath.push(dep);
          visitDependency(graphPath, depPkg);
          graphPath.pop();
        } else if (dep.originalParent === node && dep.newParent !== node) {
          let depNode = dep,
            parent = node;
          do {
            parent = depNode.newParent;
            depNode = parent.dependencies.get(depName);
          } while (depNode.newParent && depNode.newParent !== parent);
          const depPkg = getClonedNode(depNode);
          pkg.dependencies.push(depPkg);
        }
      }
    }
  };
  visitDependency([graph], rootPkg);
  return rootPkg;
};
var hoistDependencies = (
  graphPath,
  queueIndex,
  depNames,
  options,
  hoistingQueue,
  lastWorkspaceIndex,
  workspaceUsageRoutes,
) => {
  let wasGraphChanged = false;
  const parentPkg = graphPath[graphPath.length - 1];
  if (options.trace) {
    console.log(queueIndex === 0 ? 'visit' : 'revisit', graphPath.map((x) => x.id).join('/'), depNames);
  }
  const preliminaryDecisionMap = /* @__PURE__ */ new Map();
  for (const depName of depNames) {
    let decision = getHoistingDecision(graphPath, depName, queueIndex);
    if (
      options.preserveSymlinksSafe &&
      decision.isHoistable !== 'LATER' /* LATER */ &&
      decision.newParentIndex < lastWorkspaceIndex
    ) {
      const workspaceId = fromAliasedId(graphPath[lastWorkspaceIndex].id).id;
      const alternativeGraphRoutes = workspaceUsageRoutes.get(workspaceId);
      if (alternativeGraphRoutes) {
        for (const workspaceGraphRoute of alternativeGraphRoutes) {
          const graphPathToWorkspace = getGraphPath(workspaceGraphRoute, graphPath[0]);
          const usageGraphPath = graphPathToWorkspace.concat(graphPath.slice(lastWorkspaceIndex + 1));
          const usageDecision = getHoistingDecision(usageGraphPath, depName, queueIndex);
          if (options.trace) {
            console.log(
              'alternative usage path:',
              usageGraphPath.map((x) => x.id).join('/'),
              depName,
              'decision:',
              usageDecision,
            );
          }
          if (usageDecision.isHoistable === 'LATER' /* LATER */) {
            decision = usageDecision;
            if (options.trace) {
              console.log('updated decision:', decision);
            }
            break;
          } else {
            for (let idx = usageDecision.newParentIndex; idx < usageGraphPath.length; idx++) {
              let originalIndex;
              const node = usageGraphPath[idx];
              for (originalIndex = graphPath.length - 1; originalIndex >= 0; originalIndex--) {
                if (graphPath[originalIndex].id === node.id) {
                  break;
                }
              }
              if (originalIndex >= 0) {
                if (originalIndex > decision.newParentIndex) {
                  decision.newParentIndex = originalIndex;
                  decision.reason = `dependency was not hoisted due to ${usageDecision.reason} at alternative usage route: ${printGraphPath(
                    usageGraphPath,
                  )}`;
                  if (options.trace) {
                    console.log('updated decision:', decision);
                  }
                }
                break;
              }
            }
          }
        }
      }
    }
    preliminaryDecisionMap.set(depName, decision);
  }
  const finalDecisions = finalizeDependedDecisions(graphPath, preliminaryDecisionMap, options);
  const hoistDependency = (dep, depName, newParentIndex) => {
    delete dep.queueIndex;
    const rootPkg = graphPath[newParentIndex];
    if (rootPkg.workspace && rootPkg.workspace !== rootPkg) {
      throw new Error(`Assertion: trying to hoist into workspace reference: ${rootPkg.id}`);
    }
    for (let idx = newParentIndex; idx < graphPath.length - 1; idx++) {
      const pkg = graphPath[idx];
      const rootPkgDep = pkg.dependencies?.get(depName);
      if (!rootPkgDep) {
        if (!pkg.dependencies) {
          pkg.dependencies = /* @__PURE__ */ new Map();
        }
        pkg.dependencies.set(depName, dep);
      }
      if (!pkg.lookupUsages) {
        pkg.lookupUsages = /* @__PURE__ */ new Map();
      }
      let lookupNameList = pkg.lookupUsages.get(parentPkg.id);
      if (!lookupNameList) {
        lookupNameList = /* @__PURE__ */ new Set();
        pkg.lookupUsages.set(parentPkg.id, lookupNameList);
      }
      lookupNameList.add(depName);
      if (!pkg.lookupDependants) {
        pkg.lookupDependants = /* @__PURE__ */ new Map();
      }
      let dependantList = pkg.lookupDependants.get(depName);
      if (!dependantList) {
        dependantList = /* @__PURE__ */ new Set();
        pkg.lookupDependants.set(depName, dependantList);
      }
      dependantList.add(parentPkg.id);
    }
    dep.newParent = rootPkg;
    for (let idx = newParentIndex + 1; idx < graphPath.length; idx++) {
      const pkg = graphPath[idx];
      if (pkg.lookupUsages) {
        const depLookupNames = pkg.lookupUsages.get(dep.id);
        if (depLookupNames) {
          for (const name of depLookupNames) {
            const dependantList = pkg.lookupDependants.get(name);
            dependantList.delete(dep.id);
            if (dependantList.size === 0) {
              pkg.lookupDependants.delete(name);
              const pkgDep = pkg.dependencies.get(name);
              if (pkgDep.newParent && pkgDep.newParent !== pkg) {
                if (options.trace) {
                  console.log(
                    `clearing previous lookup dependency by ${dep.id} on ${pkgDep.id} in`,
                    graphPath.slice(0, idx + 1).map((x) => x.id),
                  );
                }
                pkg.dependencies.delete(name);
              }
            }
          }
        }
        pkg.lookupUsages.delete(dep.id);
      }
    }
  };
  if (finalDecisions.circularPackageNames.size > 0) {
    for (const depName of finalDecisions.circularPackageNames) {
      const dep = parentPkg.dependencies.get(depName);
      const decision = finalDecisions.decisionMap.get(depName);
      if (decision.isHoistable === 'DEPENDS' /* DEPENDS */) {
        if (dep.newParent !== graphPath[decision.newParentIndex]) {
          if (options.showChanges) {
            console.log(`unexpected decision to hoist ${dep.id} at ${printGraphPath(graphPath)}`, decision);
          }
          hoistDependency(dep, depName, decision.newParentIndex);
          wasGraphChanged = true;
        }
      }
    }
    if (options.check === 'THOROUGH' /* THOROUGH */) {
      const log = checkContracts(graphPath[0]);
      if (log) {
        console.log(
          `Contracts violated after hoisting ${Array.from(finalDecisions.circularPackageNames)} from ${printGraphPath(
            graphPath,
          )}
${log}${print(graphPath[0])}`,
        );
      }
    }
  }
  for (const depName of finalDecisions.decisionMap.keys()) {
    const dep = parentPkg.dependencies.get(depName);
    const decision = finalDecisions.decisionMap.get(depName);
    if (decision.isHoistable === 'YES' /* YES */ && decision.newParentIndex !== graphPath.length - 1) {
      if (dep.newParent !== graphPath[decision.newParentIndex]) {
        if (options.showChanges) {
          console.log(
            `unexpected decision to hoist ${dep.id} at ${printGraphPath(graphPath)}${parentPkg.newParent ? ' previously hoisted' : ''}`,
            decision,
            'previous:',
            parentPkg.lastDecisions.get(depName),
          );
        }
        hoistDependency(dep, depName, decision.newParentIndex);
        wasGraphChanged = true;
        if (options.check === 'THOROUGH' /* THOROUGH */) {
          const log = checkContracts(graphPath[0]);
          if (log) {
            throw new Error(
              `Contracts violated after hoisting ${depName} from ${printGraphPath(graphPath)}
${log}${print(graphPath[0])}`,
            );
          }
        }
      }
    } else if (decision.isHoistable === 'LATER' /* LATER */) {
      if (options.trace) {
        console.log(
          'queue',
          graphPath
            .map((x) => x.id)
            .concat([dep.id])
            .join('/'),
          'to index:',
          decision.queueIndex,
          'current index:',
          queueIndex,
        );
      }
      dep.queueIndex = decision.queueIndex;
      hoistingQueue[decision.queueIndex].push({
        graphPath: graphPath.slice(0),
        depName,
      });
    } else {
      if (options.explain && decision.reason) {
        dep.reason = decision.reason;
      }
      delete dep.queueIndex;
    }
    parentPkg.lastDecisions.set(depName, decision);
  }
  return wasGraphChanged;
};
var hoistGraph = (graph, options) => {
  let wasGraphChanged = false;
  if (options.check) {
    const log = checkContracts(graph);
    if (log) {
      throw new Error(`Contracts violated on initial graph:
${log}`);
    }
  }
  const usages = getUsages(graph);
  const children = getChildren(graph);
  const priorities = getPriorities(usages, children);
  let maxQueueIndex = 0;
  for (const priorityIds of priorities.values()) {
    maxQueueIndex = Math.max(maxQueueIndex, priorityIds.length);
  }
  const hoistingQueue = [];
  for (let idx = 0; idx < maxQueueIndex; idx++) {
    hoistingQueue.push([]);
  }
  let queueIndex = 0;
  const workspaceNodes = getWorkspaceNodes(graph);
  let workspaceUsageRoutes = /* @__PURE__ */ new Map();
  if (options.preserveSymlinksSafe) {
    workspaceUsageRoutes = getAlternativeWorkspaceRoutes(graph, new Set(workspaceNodes.keys()));
    if (options.trace && workspaceUsageRoutes.size > 0) {
      console.log('alternative workspace usage routes', require('util').inspect(workspaceUsageRoutes, false, null));
    }
  }
  const visitParent = (graphPath, lastWorkspaceIndex) => {
    const node = graphPath[graphPath.length - 1];
    if (node.dependencies) {
      for (const [depName, dep] of node.dependencies) {
        if (!dep.originalParent && dep !== graph) {
          const newDep = cloneNode(dep);
          newDep.originalParent = node;
          node.dependencies.set(depName, newDep);
        }
      }
    }
    if (node.workspaces) {
      for (const workspaceDep of node.workspaces.values()) {
        workspaceDep.originalParent = node;
      }
    }
    if (graphPath.length > 1 && node.dependencies) {
      const dependencies = /* @__PURE__ */ new Set();
      for (const [depName, dep] of node.dependencies) {
        if (!dep.newParent || dep.newParent === node) {
          dependencies.add(depName);
        }
      }
      if (dependencies.size > 0) {
        if (
          hoistDependencies(
            graphPath,
            queueIndex,
            dependencies,
            options,
            hoistingQueue,
            lastWorkspaceIndex,
            workspaceUsageRoutes,
          )
        ) {
          wasGraphChanged = true;
        }
      }
    }
    if (graphPath.indexOf(node) === graphPath.length - 1) {
      if (node.workspaces) {
        for (const depWorkspace of node.workspaces.values()) {
          const depPriorities = getPriorities(usages, getChildren(depWorkspace));
          if (depPriorities.size > 0) {
            graphPath.push(depWorkspace);
            visitParent(graphPath, lastWorkspaceIndex + 1);
            graphPath.pop();
          }
        }
      }
      if (node.dependencies) {
        for (const [, dep] of node.dependencies) {
          if (dep.id !== node.id && !dep.workspace && (!dep.newParent || dep.newParent === node)) {
            const depPriorities = dep.hoistingPriorities;
            if (depPriorities.size > 0) {
              graphPath.push(dep);
              visitParent(graphPath, lastWorkspaceIndex);
              graphPath.pop();
            }
          }
        }
      }
    }
  };
  visitParent([graph], 0);
  for (queueIndex = 1; queueIndex < maxQueueIndex; queueIndex++) {
    while (hoistingQueue[queueIndex].length > 0) {
      const queueElement = hoistingQueue[queueIndex].shift();
      const graphPath = [];
      let node = queueElement.graphPath[queueElement.graphPath.length - 1];
      do {
        graphPath.unshift(node);
        node = node.newParent || node.originalParent;
      } while (node);
      let lastWorkspaceIndex = 0;
      for (let idx = graphPath.length - 1; idx >= 0; idx--) {
        const node2 = graphPath[idx];
        const realId = fromAliasedId(node2.id).id;
        if (workspaceNodes.has(realId)) {
          lastWorkspaceIndex = idx;
          break;
        }
      }
      if (
        hoistDependencies(
          graphPath,
          queueIndex,
          /* @__PURE__ */ new Set([queueElement.depName]),
          options,
          hoistingQueue,
          lastWorkspaceIndex,
          workspaceUsageRoutes,
        )
      ) {
        wasGraphChanged = true;
      }
    }
  }
  if (options.check === 'FINAL' /* FINAL */) {
    const log = checkContracts(graph);
    if (log) {
      throw new Error(`Contracts violated after hoisting finished:
${log}`);
    }
  }
  return wasGraphChanged;
};
var cloneWorkGraph = (graph) => {
  const clonedNodes = /* @__PURE__ */ new Map();
  const cloneDependency = (node) => {
    if (node.workspace) return node;
    let clonedNode = clonedNodes.get(node);
    if (!clonedNode) {
      clonedNode = Object.assign({}, node);
      delete clonedNode.queueIndex;
      clonedNodes.set(node, clonedNode);
      if (node.dependencies) {
        for (const dep of node.dependencies.values()) {
          cloneDependency(dep);
        }
      }
    }
    return clonedNode;
  };
  const getClonedNode = (originalNode) => {
    const clonedNode = clonedNodes.get(originalNode);
    if (!clonedNode) {
      throw new Error('Clone error');
    }
    return clonedNode;
  };
  const clonedGraph = cloneDependency(graph);
  for (const node of clonedNodes.values()) {
    if (node.originalParent) {
      node.originalParent = cloneDependency(node.originalParent);
    }
    if (node.newParent) {
      node.newParent = cloneDependency(node.newParent);
    }
    if (node.dependencies) {
      const newDependencies = /* @__PURE__ */ new Map();
      for (const [depName, dep] of node.dependencies) {
        newDependencies.set(depName, getClonedNode(dep));
      }
      node.dependencies = newDependencies;
    }
    if (node.workspaces) {
      const newWorkspaces = /* @__PURE__ */ new Map();
      for (const [depName, dep] of node.workspaces) {
        newWorkspaces.set(depName, getClonedNode(dep));
      }
      node.workspaces = newWorkspaces;
    }
    if (node.lookupUsages) {
      node.lookupUsages = new Map(node.lookupUsages);
    }
    if (node.lookupDependants) {
      const newLookupDependants = /* @__PURE__ */ new Map();
      for (const [depName, usedBySet] of node.lookupDependants) {
        newLookupDependants.set(depName, new Set(usedBySet));
      }
      node.lookupDependants = newLookupDependants;
    }
  }
  return clonedGraph;
};
var hoist = (pkg, opts) => {
  let graph = toWorkGraph(pkg);
  const options = opts || { trace: false };
  populateImplicitPeers(graph);
  let wasGraphChanged = true;
  do {
    wasGraphChanged = hoistGraph(graph, options);
    if (wasGraphChanged) graph = cloneWorkGraph(graph);
  } while (wasGraphChanged);
  if (options.check) {
    if (options.trace) {
      console.log('second pass');
    }
    const secondGraph = cloneWorkGraph(graph);
    let wasGraphChanged2 = false;
    try {
      wasGraphChanged2 = hoistGraph(secondGraph, { ...options, showChanges: true });
    } catch (e) {
      e.message = `While checking for terminal result: ${e.message}`;
      throw e;
    }
    if (wasGraphChanged2) {
      throw new Error(`Hoister produced non-terminal result`);
    }
  }
  if (options.trace || options.dump) {
    console.log(`final hoisted graph:
${print(graph)}`);
  }
  return fromWorkGraph(graph);
};
var getOriginalGrapPath = (node) => {
  const graphPath = [];
  let pkg = node;
  do {
    if (pkg) {
      graphPath.unshift(pkg);
      pkg = pkg.originalParent;
    }
  } while (pkg);
  return graphPath;
};
var getLatestGrapPath = (node) => {
  const graphPath = [];
  let pkg = node;
  do {
    if (pkg) {
      graphPath.unshift(pkg);
      pkg = pkg.newParent || pkg.originalParent;
    }
  } while (pkg);
  return graphPath;
};
var printGraphPath = (graphPath) => graphPath.map((x) => x.id).join('/');
var checkContracts = (graph) => {
  const seen = /* @__PURE__ */ new Set();
  const checkParent = (graphPath) => {
    const node = graphPath[graphPath.length - 1];
    const isSeen = seen.has(node);
    seen.add(node);
    let log = '';
    const originalDependencies = node?.originalParent?.dependencies?.get(getPackageName(node.id))?.dependencies;
    if (originalDependencies) {
      for (const [depName, originalDep] of originalDependencies) {
        let actualDep;
        for (let idx = graphPath.length - 1; idx >= 0; idx--) {
          actualDep = graphPath[idx]?.dependencies?.get(depName);
          if (actualDep) {
            break;
          }
        }
        if (actualDep?.id !== originalDep.id) {
          log += `Expected ${originalDep.id} for ${printGraphPath(graphPath.slice(0, -1))}, but found: ${printGraphPath(
            getLatestGrapPath(actualDep),
          )}`;
          if (actualDep?.newParent) {
            log += ` previously hoisted from ${printGraphPath(getOriginalGrapPath(actualDep))}`;
          }
          log += `
`;
        }
      }
    }
    if (node.peerNames) {
      const originalGraphPath = getOriginalGrapPath(node);
      for (const peerName of node.peerNames.keys()) {
        let originalPeerDep;
        for (let idx = originalGraphPath.length - 2; idx >= 0; idx--) {
          const nodeDep = originalGraphPath[idx].dependencies?.get(peerName);
          if (nodeDep?.originalParent == originalGraphPath[idx]) {
            originalPeerDep = nodeDep;
            break;
          }
        }
        if (originalPeerDep) {
          let actualPeerDep;
          for (let idx = graphPath.length - 1; idx >= 0; idx--) {
            const nodeDep = graphPath[idx].dependencies?.get(peerName);
            if (nodeDep && (nodeDep.newParent || nodeDep.originalParent) == graphPath[idx]) {
              actualPeerDep = nodeDep;
              break;
            }
          }
          let parentPeerDep;
          for (let idx = graphPath.length - 2; idx >= 0; idx--) {
            const nodeDep = graphPath[idx].dependencies?.get(peerName);
            if (nodeDep && (nodeDep.newParent || nodeDep.originalParent) == graphPath[idx]) {
              parentPeerDep = nodeDep;
              break;
            }
          }
          if (actualPeerDep.id !== originalPeerDep.id) {
          } else if (actualPeerDep !== parentPeerDep) {
            log += `Expected peer dependency ${printGraphPath(getLatestGrapPath(actualPeerDep))}`;
            if (actualPeerDep?.newParent) {
              log += ` previously hoisted from ${printGraphPath(getOriginalGrapPath(actualPeerDep))}`;
            }
            log += ` for ${printGraphPath(
              graphPath,
            )} to be shared with parent, but parent uses peer dependency from ${printGraphPath(
              getLatestGrapPath(parentPeerDep),
            )} instead
`;
          }
        }
      }
    }
    if (!isSeen) {
      if (node.workspaces) {
        for (const dep of node.workspaces.values()) {
          graphPath.push(dep);
          log += checkParent(graphPath);
          graphPath.pop();
        }
      }
      if (node.dependencies) {
        for (const dep of node.dependencies.values()) {
          if ((dep.newParent || dep.originalParent) === node) {
            graphPath.push(dep);
            log += checkParent(graphPath);
            graphPath.pop();
          }
        }
      }
    }
    return log;
  };
  return checkParent([graph]);
};
var print = (graph) => {
  const printDependency = (graphPath, { prefix, depPrefix }) => {
    const node = graphPath[graphPath.length - 1];
    let str = depPrefix;
    if (node.workspace === node) {
      str += 'workspace:';
    } else if (node.packageType === 'PORTAL' /* PORTAL */) {
      str += 'portal:';
    }
    str += node.id;
    if (node.wall) {
      str += '|';
      if (node.wall.size > 0) {
        str += Array.from(node.wall);
      }
    }
    if (node.queueIndex) {
      str += ` queue: ${node.queueIndex}`;
    }
    if (node.reason) {
      str += ` - ${node.reason}`;
    }
    str += '\n';
    if (graphPath.indexOf(node) !== graphPath.length - 1) {
      return str;
    }
    const deps = [];
    if (node.workspaces) {
      for (const dep of node.workspaces.values()) {
        deps.push(dep);
      }
    }
    if (node.dependencies) {
      for (const dep of node.dependencies.values()) {
        if (!dep.newParent || dep.newParent === node) {
          deps.push(dep);
        }
      }
    }
    deps.sort((d1, d2) => (d2.id < d1.id ? 1 : -1));
    for (let idx = 0; idx < deps.length; idx++) {
      const dep = deps[idx];
      graphPath.push(dep);
      const hasMoreDependencies = idx < deps.length - 1;
      str += printDependency(graphPath, {
        depPrefix: prefix + (hasMoreDependencies ? `\u251C\u2500` : `\u2514\u2500`),
        prefix: prefix + (hasMoreDependencies ? `\u2502 ` : `  `),
      });
      graphPath.pop();
    }
    return str;
  };
  return printDependency([graph], { prefix: '  ', depPrefix: '' }).trim();
};

// src/resolver/resolveScript.ts
var resolveStateDeserializer = (key, value) => {
  if (['resolutions', 'ranges'].indexOf(key) >= 0) {
    return new Map(value);
  } else {
    return value;
  }
};
var resolveStateSerializer = (key, value) => {
  if (['resolutions', 'ranges'].indexOf(key) >= 0) {
    return Array.from(value.entries());
  } else if (key.startsWith('_')) {
    return void 0;
  } else {
    return value;
  }
};
var getWorkspaceName = (node) => node.json.name || `workspace:${node.workspacePath}`;
var getWorkspaceVersion = (node) => node.json.version || `0.0.0`;
var parseRange = (range) => {
  let version, alias, protocol;
  version = range;
  const protocolParts = range.split(':');
  if (protocolParts.length === 3 && protocol === 'npm') {
    alias = protocolParts[1];
    version = protocolParts[2];
  }
  if (protocolParts.length > 1) {
    protocol = protocolParts[0];
    version = protocolParts.slice(1).join(':');
  }
  return { version, alias, protocol };
};
var parsePackageName = (name) => {
  const idx = name.indexOf('/');
  return idx < 0 ? { basename: name } : { scope: name.substring(0, idx), basename: name.substring(idx + 1) };
};
var stringifyGraphId = (graphId) =>
  `${stringifyPackageId(graphId)}${graphId.alias ? '>' + graphId.alias : ''}${graphId.resolutions ? '#' + Array.from(graphId.resolutions).join(',') : ''}${graphId.autoPeerNames ? '|' + Array.from(graphId.autoPeerNames).join(',') : ''}`;
var stringifyPackageId = (graphId) =>
  `${graphId.protocol ? graphId.protocol + ':' : ''}${graphId.scope ? graphId.scope + '/' : ''}${graphId.basename}${graphId.version ? '@' + graphId.version : ''}`;
var assignId = ({ pkg, name, version, parentDependencyNames, resolutionPath, resolutions, options }) => {
  const rawDependencies = getDependencies(pkg.json, options.prod ? false : !!pkg.workspacePath);
  const dependencies = /* @__PURE__ */ new Map();
  const peerNames = /* @__PURE__ */ new Set();
  const idProps = { ...parsePackageName(name), ...parseRange(version) };
  for (const [depName, depRange] of rawDependencies.regular) {
    const { resolution, range } = getResolutionRange({
      resolutions,
      resolutionPath: getResolutionPath(depName, resolutionPath),
      depRange,
    });
    if (resolution && !pkg.workspacePath) {
      if (!idProps.resolutions) {
        idProps.resolutions = /* @__PURE__ */ new Set();
      }
      idProps.resolutions.add(depName);
    }
    dependencies.set(depName, range);
  }
  for (const [depName, depRange] of rawDependencies.peer) {
    if (rawDependencies.optionalPeerNames.has(depName)) continue;
    if (options.autoInstallPeers) {
      if (!parentDependencyNames.has(depName)) {
        dependencies.set(depName, depRange);
        if (!pkg.workspacePath) {
          if (!idProps.autoPeerNames) {
            idProps.autoPeerNames = /* @__PURE__ */ new Set();
          }
          idProps.autoPeerNames.add(depName);
        }
      } else {
        peerNames.add(depName);
      }
    } else {
      peerNames.add(depName);
    }
  }
  return { idProps, dependencies, peerNames, optionalNames: rawDependencies.optionalNames };
};
var getLibc = () => {
  if (process.platform === 'linux') {
    const report = process.report?.getReport() || {};
    if (report.header?.glibcVersionRuntime) {
      return 'glibc';
    } else if (Array.isArray(report.sharedObjects) && report.sharedObjects.some(isMusl)) {
      return 'musl';
    }
  }
  return null;
};
var isMusl = (file) => file.includes('libc.musl-') || file.includes('ld-musl-');
var isPackageJsonFieldCompatible = (actual, rules) => {
  if (!rules || !actual) return true;
  let isNotAllowlist = true;
  let isBlocklist = false;
  for (const rule of rules) {
    if (rule[0] === `!`) {
      isBlocklist = true;
      if (actual === rule.slice(1)) {
        return false;
      }
    } else {
      isNotAllowlist = false;
      if (rule === actual) {
        return true;
      }
    }
  }
  return isBlocklist && isNotAllowlist;
};
var resolveRange = function* ({
  name,
  range,
  resolvedPackageRanges,
  unresolvedPackageRanges,
  workspaceVersions,
  requestedMetadata,
  receivedMetadata,
  lockTime,
  state,
}) {
  let resolvedRangeInfo = resolvedPackageRanges.get(name)?.get(range);
  if (!resolvedRangeInfo && workspaceVersions) {
    const versions = workspaceVersions.get(name);
    if (versions) {
      const version = import_semver.default.maxSatisfying(Array.from(versions.keys()), range, true);
      if (version) {
        let resolvedRanges = resolvedPackageRanges.get(name);
        if (!resolvedRanges) {
          resolvedRanges = /* @__PURE__ */ new Map();
          resolvedPackageRanges.set(name, resolvedRanges);
        }
        resolvedRangeInfo = { name, range, version, isWorkspace: true };
        resolvedRanges.set(range, resolvedRangeInfo);
      }
    }
  }
  if (!resolvedRangeInfo && state) {
    const version = state.resolutions.get(name)?.ranges.get(range);
    if (version) {
      let resolvedRanges = resolvedPackageRanges.get(name);
      if (!resolvedRanges) {
        resolvedRanges = /* @__PURE__ */ new Map();
        resolvedPackageRanges.set(name, resolvedRanges);
      }
      resolvedRangeInfo = { name, range, version };
      resolvedRanges.set(range, resolvedRangeInfo);
    }
  }
  const metadataEntry = receivedMetadata.get(name);
  if (!resolvedRangeInfo && metadataEntry) {
    const metadata = metadataEntry.metadata;
    const availableVersions = Object.keys(metadata.versions);
    const versionsBeforeLock = [];
    const versionsAfterLock = [];
    const times = Object.entries(metadata.time)
      .map(([version2, timeStr]) => [version2, new Date(timeStr)])
      .sort((e1, e2) => e1[1].getTime() - e2[1].getTime());
    for (const [v, t] of times) {
      if (metadata.versions[v]) {
        if (t <= lockTime) {
          versionsBeforeLock.push(v);
        } else {
          versionsAfterLock.push(v);
        }
      }
    }
    let version = import_semver.default.maxSatisfying(versionsBeforeLock, range, true);
    if (!version) {
      for (const v of versionsAfterLock) {
        if (import_semver.default.satisfies(v, range, true)) {
          version = v;
          break;
        }
      }
    }
    if (!version) {
      if (metadataEntry.fresh) {
        throw new Error(
          `Unable to resolve ${name}@${range}, ${metadata.name}, available versions: ${availableVersions}`,
        );
      }
    } else {
      let resolvedRanges = resolvedPackageRanges.get(name);
      if (!resolvedRanges) {
        resolvedRanges = /* @__PURE__ */ new Map();
        resolvedPackageRanges.set(name, resolvedRanges);
      }
      resolvedRangeInfo = { name, range, version };
      resolvedRanges.set(range, resolvedRangeInfo);
    }
  }
  if (!resolvedRangeInfo) {
    let unresolvedRanges = unresolvedPackageRanges.get(name);
    if (!unresolvedRanges) {
      unresolvedRanges = /* @__PURE__ */ new Set();
      unresolvedPackageRanges.set(name, unresolvedRanges);
      const requestedEntry = requestedMetadata.get(name);
      if (!requestedEntry || !requestedEntry.fresh) {
        requestedMetadata.set(name, { fresh: !!requestedEntry });
        const event = { type: 'get_metadata' /* GET_METADATA */, name };
        if (!requestedEntry) {
          event.lockTime = lockTime;
        }
        yield event;
      }
    }
    unresolvedRanges.add(range);
  }
  return resolvedRangeInfo;
};
var resolvePackage = function* ({
  pkg,
  id,
  resolutionDependencies,
  declaredPackageRanges,
  unresolvedPackageRanges,
  resolvedPackageRanges,
  workspaceVersions,
  requestedMetadata,
  receivedMetadata,
  lockTime,
  state,
  options,
}) {
  if (declaredPackageRanges.has(id)) return;
  const declaredRanges = /* @__PURE__ */ new Map();
  declaredPackageRanges.set(id, declaredRanges);
  if (
    !isPackageJsonFieldCompatible(options.cpu, pkg.json.cpu) ||
    !isPackageJsonFieldCompatible(options.os, pkg.json.os) ||
    !isPackageJsonFieldCompatible(options.libc, pkg.json.libc)
  ) {
    return;
  }
  const dependencies = getDependencies(pkg.json, options.prod ? false : !!pkg.workspacePath);
  const allDependencies = /* @__PURE__ */ new Set();
  for (const [depName, depRange] of dependencies.regular) {
    allDependencies.add({ depName, depRange });
  }
  if (options.autoInstallPeers) {
    for (const [depName, depRange] of dependencies.peer) {
      if (!dependencies.optionalPeerNames.has(depName)) {
        allDependencies.add({ depName, depRange });
      }
    }
  }
  if (resolutionDependencies) {
    for (const [depName, depRange] of resolutionDependencies) {
      allDependencies.add({ depName, depRange });
    }
  }
  for (const { depName, depRange } of allDependencies) {
    const { name, range } = parseSpecifier(depName, depRange);
    let ranges = declaredRanges.get(name);
    if (!ranges) {
      ranges = /* @__PURE__ */ new Set();
      declaredRanges.set(name, ranges);
    }
    ranges.add(range);
    const resolvedRangeInfo = yield* resolveRange({
      name,
      range,
      resolvedPackageRanges,
      unresolvedPackageRanges,
      workspaceVersions,
      requestedMetadata,
      receivedMetadata,
      lockTime,
      state,
    });
    if (resolvedRangeInfo) {
      const { version, isWorkspace } = resolvedRangeInfo;
      const childId = `${name}@${version}`;
      if (!isWorkspace) {
        const pkg2 = { json: receivedMetadata.get(name).metadata.versions[version] };
        yield* resolvePackage({
          pkg: pkg2,
          id: childId,
          declaredPackageRanges,
          unresolvedPackageRanges,
          resolvedPackageRanges,
          workspaceVersions,
          requestedMetadata,
          receivedMetadata,
          lockTime,
          state,
          options,
        });
      }
    }
  }
};
var resolveWorkspace = function* ({
  pkg,
  declaredPackageRanges,
  unresolvedPackageRanges,
  resolvedPackageRanges,
  workspaceVersions,
  requestedMetadata,
  receivedMetadata,
  lockTime,
  state,
  options,
}) {
  const id = `${getWorkspaceName(pkg)}@${getWorkspaceVersion(pkg)}`;
  yield* resolvePackage({
    pkg,
    id,
    resolutionDependencies: getResolutionDependencies(pkg),
    declaredPackageRanges,
    unresolvedPackageRanges,
    resolvedPackageRanges,
    workspaceVersions,
    requestedMetadata,
    receivedMetadata,
    lockTime,
    state,
    options,
  });
  if (pkg.workspaces) {
    for (const workspace of pkg.workspaces) {
      yield* resolveWorkspace({
        pkg: workspace,
        declaredPackageRanges,
        unresolvedPackageRanges,
        resolvedPackageRanges,
        workspaceVersions,
        requestedMetadata,
        receivedMetadata,
        lockTime,
        state,
        options,
      });
    }
  }
};
var createPackage = ({
  pkg,
  name,
  version,
  optional,
  parentDependencyNames,
  resolvedPackageRanges,
  receivedMetadata,
  nodeMap,
  resolutionPath,
  resolutions,
  options,
}) => {
  if (
    !pkg.workspacePath &&
    (!isPackageJsonFieldCompatible(options.cpu, pkg.json.cpu) ||
      !isPackageJsonFieldCompatible(options.os, pkg.json.os) ||
      !isPackageJsonFieldCompatible(options.libc, pkg.json.libc))
  ) {
    return null;
  }
  const { idProps, dependencies, peerNames, optionalNames } = assignId({
    pkg,
    name,
    version,
    parentDependencyNames,
    resolutionPath,
    resolutions,
    options,
  });
  const graphId = stringifyGraphId(idProps);
  let node;
  if (!pkg.workspacePath) {
    node = nodeMap.get(graphId);
  }
  if (node) {
    if (!optional && node.optional) {
      delete node.optional;
    }
    return node;
  }
  node = { id: graphId };
  if (optional) {
    node.optional = true;
  }
  if (pkg.workspacePath) {
    node.workspacePath = pkg.workspacePath;
  } else {
    if (idProps.alias) {
      node.alias = idProps.alias;
    }
  }
  if (!pkg.workspacePath) {
    nodeMap.set(graphId, node);
  }
  const tarballUrl = pkg.json?.dist?.tarball;
  if (tarballUrl) {
    node.tarballUrl = tarballUrl;
  }
  const buildScripts = getBuildScripts(pkg.json);
  if (buildScripts) {
    node.buildScripts = buildScripts;
  }
  const binType = typeof pkg.json.bin;
  if (binType !== 'undefined') {
    if (binType === 'string') {
      node.bin = { [getPackageName2(parseSpecifier(node.id).name)]: pkg.json.bin };
    } else {
      node.bin = pkg.json.bin;
    }
  }
  const nextParentDependencyNames = new Set(parentDependencyNames);
  for (const depName of dependencies.keys()) {
    nextParentDependencyNames.add(depName);
  }
  if (dependencies.size > 0) {
    node.dependencies = node.dependencies || [];
    for (const [depName, depRange] of dependencies) {
      const { name: name2, range, alias } = parseSpecifier(depName, depRange);
      const resolveMap = resolvedPackageRanges.get(name2);
      if (!resolveMap) {
        throw new Error(`Unable to get resolve map for ${name2}`);
      }
      const resolvedRangeInfo = resolveMap.get(range);
      if (!resolvedRangeInfo) {
        throw new Error(`Not found ${name2}@${range} resolution used by ${graphId}`);
      }
      const { version: version2, isWorkspace } = resolvedRangeInfo;
      const pkg2 = isWorkspace
        ? { json: { name: depName, version: version2 } }
        : { json: receivedMetadata.get(name2).metadata.versions[version2] };
      const depNode = createPackage({
        pkg: pkg2,
        name: depName,
        version: alias ? `npm:${alias}:${version2}` : version2,
        optional: optional || optionalNames.has(depName),
        parentDependencyNames: nextParentDependencyNames,
        resolvedPackageRanges,
        receivedMetadata,
        nodeMap,
        resolutions,
        resolutionPath: getResolutionPath(depName, resolutionPath),
        options,
      });
      if (depNode) {
        node.dependencies.push(depNode);
      }
    }
  }
  if (peerNames.size > 0) {
    node.peerNames = Array.from(peerNames);
  }
  return node;
};
var createWorkspace = ({
  pkg,
  parentDependencyNames,
  resolvedPackageRanges,
  receivedMetadata,
  nodeMap,
  resolutionPath,
  resolutions,
  options,
}) => {
  const name = getWorkspaceName(pkg);
  const version = getWorkspaceVersion(pkg);
  const node = createPackage({
    pkg,
    name,
    version,
    optional: false,
    resolvedPackageRanges,
    receivedMetadata,
    nodeMap,
    parentDependencyNames,
    resolutionPath,
    resolutions,
    options,
  });
  if (pkg.workspaces) {
    node.workspaces = [];
    for (const workspace of pkg.workspaces) {
      node.workspaces.push(
        createWorkspace({
          pkg: workspace,
          parentDependencyNames,
          resolvedPackageRanges,
          receivedMetadata,
          nodeMap,
          resolutions,
          resolutionPath: getResolutionPath(getWorkspaceName(workspace), resolutionPath),
          options,
        }),
      );
    }
  }
  return node;
};
var getResolutionDependencies = (node) => {
  const dependencies = /* @__PURE__ */ new Map();
  for (const [resolutionPath, range] of Object.entries(node.json.resolutions || {})) {
    const parts = resolutionPath.split('/');
    if (parts.length === 1) {
      dependencies.set(resolutionPath, range);
    } else {
      const nextToLast = parts[parts.length - 2];
      if (nextToLast.startsWith('@')) {
        dependencies.set([nextToLast, parts[parts.length - 1]].join('/'), range);
      } else {
        dependencies.set(parts[parts.length - 1], range);
      }
    }
  }
  return dependencies;
};
var getWorkspaceResolutions = (node) => {
  const resolutions = /* @__PURE__ */ new Map();
  for (const [resolutionPath, range] of Object.entries(node.json.resolutions || {})) {
    const parts = resolutionPath.split('/');
    const packageParts = [];
    let scopePart;
    for (const part of parts) {
      if (part.startsWith('@')) {
        scopePart = part;
      } else {
        if (scopePart) {
          packageParts.push(`${scopePart}#${part}`);
        } else {
          packageParts.push(part);
        }
      }
    }
    resolutions.set(packageParts.join('/'), range);
  }
  return resolutions;
};
var readWorkspaceVersions = ({ pkg }) => {
  const workspaceVersions = /* @__PURE__ */ new Map();
  const fillWorkspaceVersion = (workspace) => {
    const name = getWorkspaceName(workspace);
    let versions = workspaceVersions.get(name);
    if (!versions) {
      versions = /* @__PURE__ */ new Set();
      workspaceVersions.set(name, versions);
    }
    versions.add(getWorkspaceVersion(workspace));
    if (workspace.workspaces) {
      for (const nestedWorkspace of workspace.workspaces) {
        fillWorkspaceVersion(nestedWorkspace);
      }
    }
  };
  fillWorkspaceVersion(pkg);
  return workspaceVersions;
};
var refineGraph = (node, seen = /* @__PURE__ */ new Set()) => {
  if (seen.has(node)) return;
  seen.add(node);
  if (node.dependencies) {
    let totalLen = node.dependencies.length;
    for (let idx = 0; idx < totalLen; idx++) {
      const dep = node.dependencies[idx];
      if (dep.id.startsWith('=')) {
        node.dependencies.splice(idx, 1);
        totalLen--;
        idx--;
      } else {
        refineGraph(dep, seen);
      }
    }
    if (totalLen === 0) {
      delete node.dependencies;
    }
  }
  if (node.workspaces) {
    for (const dep of node.workspaces) {
      refineGraph(dep, seen);
    }
  }
};
var getMetadataMapFromStateAndOptions = ({ state, options }) => {
  const receivedMetadata = /* @__PURE__ */ new Map();
  if (state) {
    for (const [name, { meta }] of state.resolutions) {
      receivedMetadata.set(name, { metadata: meta, fresh: false });
    }
  }
  if (options.receivedMetadata) {
    for (const [name, metadata] of options.receivedMetadata) {
      receivedMetadata.set(name, { metadata, fresh: true });
    }
  }
  return receivedMetadata;
};
var resolveScript = function* (pkg, opts, prevState) {
  const options = opts || {};
  options.cpu = options.cpu || process.arch;
  options.os = options.os || process.platform;
  options.libc = options.libc || getLibc();
  let lockTime = pkg.json.lockTime ? new Date(pkg.json.lockTime) : /* @__PURE__ */ new Date();
  const declaredPackageRanges = /* @__PURE__ */ new Map();
  const unresolvedPackageRanges = /* @__PURE__ */ new Map();
  const resolvedPackageRanges = /* @__PURE__ */ new Map();
  const state = prevState && new Date(prevState.lockTime).getTime() === lockTime.getTime() ? prevState : void 0;
  const requestedMetadata = /* @__PURE__ */ new Map();
  const receivedMetadata = getMetadataMapFromStateAndOptions({ state, options });
  const workspaceVersions = readWorkspaceVersions({ pkg });
  yield* resolveWorkspace({
    pkg,
    declaredPackageRanges,
    unresolvedPackageRanges,
    resolvedPackageRanges,
    requestedMetadata,
    receivedMetadata,
    workspaceVersions,
    lockTime,
    state,
    options,
  });
  while (unresolvedPackageRanges.size !== 0) {
    const packageMetadata = yield { type: 'next_metadata' /* NEXT_METADATA */ };
    if (!packageMetadata) {
      throw new Error('Unable to receive packages metadata, aborting...');
    }
    const depName = packageMetadata.name;
    if (packageMetadata.fresh) {
      requestedMetadata.set(depName, { fresh: true });
    }
    receivedMetadata.set(depName, packageMetadata);
    const unresolvedRanges = unresolvedPackageRanges.get(depName);
    let resolvedRanges = resolvedPackageRanges.get(depName);
    if (!resolvedRanges) {
      resolvedRanges = /* @__PURE__ */ new Map();
      resolvedPackageRanges.set(depName, resolvedRanges);
    }
    if (unresolvedRanges) {
      do {
        const unresolvedRange = unresolvedRanges.values().next().value;
        const resolvedRangeInfo = yield* resolveRange({
          name: depName,
          range: unresolvedRange,
          resolvedPackageRanges,
          unresolvedPackageRanges,
          requestedMetadata,
          receivedMetadata,
          lockTime,
          state,
        });
        if (resolvedRangeInfo) {
          const version = resolvedRangeInfo.version;
          resolvedRanges.set(unresolvedRange, resolvedRangeInfo);
          unresolvedRanges.delete(unresolvedRange);
          const json = packageMetadata.metadata.versions[version];
          const childId = `${depName}@${version}`;
          yield* resolvePackage({
            pkg: { json },
            id: childId,
            declaredPackageRanges,
            unresolvedPackageRanges,
            resolvedPackageRanges,
            workspaceVersions,
            requestedMetadata,
            receivedMetadata,
            lockTime,
            state,
            options,
          });
        } else {
          break;
        }
      } while (unresolvedRanges.size);
      if (unresolvedRanges.size === 0) {
        unresolvedPackageRanges.delete(depName);
      }
    }
  }
  orderResolvedRanges(resolvedPackageRanges);
  if (options.resolutionOptimization) {
    optimizeResolutions({ workspaceVersions, declaredPackageRanges, resolvedPackageRanges, options });
  }
  const nodeMap = /* @__PURE__ */ new Map();
  const graph = createWorkspace({
    pkg,
    parentDependencyNames: /* @__PURE__ */ new Set(),
    resolvedPackageRanges,
    receivedMetadata,
    nodeMap,
    resolutionPath: getResolutionPath(getWorkspaceName(pkg)),
    resolutions: getWorkspaceResolutions(pkg),
    options,
  });
  refineGraph(graph);
  if (options.dump) {
    console.log(print2(graph));
  }
  const nextState = getState({ resolvedPackageRanges, receivedMetadata, lockTime });
  let result = { graph };
  if (nextState) {
    result.state = nextState;
  }
  return result;
};
var minimizeJson = (json) => {
  const result = {};
  for (const key of Object.keys(json)) {
    if (
      [
        'bin',
        'os',
        'cpu',
        'libc',
        'dependencies',
        'optionalDependencies',
        'peerDependencies',
        'peerDependenciesMeta',
      ].indexOf(key) >= 0
    ) {
      result[key] = json[key];
    }
  }
  if (json.scripts) {
    for (const scriptName of Object.keys(json.scripts)) {
      if (BUILD_SCRIPTS.indexOf(scriptName) >= 0) {
        if (!result.scripts) {
          result.scripts = {};
        }
        result.scripts[scriptName] = json.scripts[scriptName];
      }
    }
  }
  return result;
};
var minimizeMetadata2 = (metadata, versions) => {
  const result = { versions: {}, time: {} };
  for (const version of versions) {
    result.versions[version] = minimizeJson(metadata.versions[version]);
    result.time[version] = metadata.time[version];
  }
  return result;
};
var orderResolvedRanges = (resolvedPackageRanges) => {
  const originalResolveRanges = new Map(resolvedPackageRanges);
  resolvedPackageRanges.clear();
  const sortedNames = Array.from(originalResolveRanges.keys()).sort();
  for (const name of sortedNames) {
    const resolveMap = originalResolveRanges.get(name);
    const originalResolveMap = new Map(resolveMap);
    resolveMap.clear();
    const sortedRanges = Array.from(originalResolveMap.keys()).sort();
    for (const range of sortedRanges) {
      resolveMap.set(range, originalResolveMap.get(range));
    }
    resolvedPackageRanges.set(name, resolveMap);
  }
};
var getState = ({ resolvedPackageRanges, receivedMetadata, lockTime }) => {
  const resolutions = /* @__PURE__ */ new Map();
  for (const [name, resolveMap] of resolvedPackageRanges) {
    const ranges = /* @__PURE__ */ new Map();
    const versions = [];
    for (const [range, { isWorkspace, version }] of resolveMap) {
      if (isWorkspace) continue;
      ranges.set(range, version);
      versions.push(version);
    }
    if (ranges.size > 0) {
      const metadataEntry = receivedMetadata.get(name);
      if (metadataEntry) {
        const meta = minimizeMetadata2(metadataEntry.metadata, new Set(versions));
        resolutions.set(name, { meta, ranges });
      }
    }
  }
  return resolutions.size > 0 ? { resolutions, lockTime } : void 0;
};
var optimizeResolutions = ({ workspaceVersions, declaredPackageRanges, resolvedPackageRanges, options }) => {
  let shouldOptimizeAgain;
  do {
    shouldOptimizeAgain = false;
    for (const [name, resolveMap] of resolvedPackageRanges) {
      const resolveInfoSet = new Set(resolveMap.values());
      const hasNonCaret = Array.from(resolveMap.keys()).find((x) => !/^\^[0-9]+\.[0-9]+\.[0-9]+$/.test(x));
      if (resolveInfoSet.size === 1 || !hasNonCaret) {
        continue;
      }
      let versionToRanges = /* @__PURE__ */ new Map();
      let rangesToVersion = /* @__PURE__ */ new Map();
      const versionList = new Set(Array.from(resolveMap.values()).map((x) => x.version));
      for (const version of versionList) {
        const matchedRanges = /* @__PURE__ */ new Set();
        versionToRanges.set(version, matchedRanges);
        for (const [checkRange, { version: checkVersion }] of resolveMap) {
          if (version === checkVersion || import_semver.default.satisfies(version, checkRange, true)) {
            matchedRanges.add(checkRange);
            let matchedVersions = rangesToVersion.get(checkRange);
            if (!matchedVersions) {
              matchedVersions = /* @__PURE__ */ new Set();
              rangesToVersion.set(checkRange, matchedVersions);
            }
            matchedVersions.add(version);
          }
        }
      }
      const unmatchedRanges = new Set(resolveMap.keys());
      const versions = [];
      while (unmatchedRanges.size > 0) {
        let bestCoverVersion, bestMatchedRanges;
        for (const [version, matchedRanges] of versionToRanges) {
          if (!bestCoverVersion || versionToRanges.get(bestCoverVersion).size < matchedRanges.size) {
            bestCoverVersion = version;
            bestMatchedRanges = matchedRanges;
          }
        }
        versions.push(bestCoverVersion);
        versionToRanges.delete(bestCoverVersion);
        for (const range of bestMatchedRanges) {
          unmatchedRanges.delete(range);
          rangesToVersion.get(range).delete(bestCoverVersion);
        }
      }
      for (const [range, rangeInfo] of resolveMap) {
        const { version: originalVersion } = rangeInfo;
        const version = import_semver.default.maxSatisfying(versions, range, true);
        if (version === originalVersion) continue;
        if (options.traceRangeUsages) {
          console.log(`rewire ${name}@${range} from ${originalVersion} to ${version}`);
        }
        shouldOptimizeAgain = true;
        rangeInfo.version = version;
      }
    }
    const usedPackageRanges = /* @__PURE__ */ new Map();
    const addRangeUsages = (packageId, seen2) => {
      if (seen2.has(packageId)) return;
      seen2.add(packageId);
      const declaredRanges = declaredPackageRanges.get(packageId);
      if (!declaredRanges) {
        throw new Error(`No declared ranges for ${packageId}`);
      }
      for (const [name, ranges] of declaredRanges) {
        let usedRanges = usedPackageRanges.get(name);
        if (!usedRanges) {
          usedRanges = /* @__PURE__ */ new Set();
          usedPackageRanges.set(name, usedRanges);
        }
        for (const range of ranges) {
          usedRanges.add(range);
          const resolveMap = resolvedPackageRanges.get(name);
          const { version } = resolveMap.get(range);
          addRangeUsages(`${name}@${version}`, seen2);
        }
      }
    };
    const seen = /* @__PURE__ */ new Set();
    for (const [name, versions] of workspaceVersions) {
      for (const version of versions) {
        addRangeUsages(`${name}@${version}`, seen);
      }
    }
    for (const [name, resolveMap] of resolvedPackageRanges) {
      const usedRanges = usedPackageRanges.get(name);
      if (!usedRanges) {
        if (options.traceRangeUsages) {
          console.log(`delete all versions for package ${name}`);
        }
        resolvedPackageRanges.delete(name);
        continue;
      }
      for (const [range, rangeInfo] of resolveMap) {
        if (!usedRanges.has(range)) {
          if (options.traceRangeUsages) {
            console.log(`delete ${name}@${rangeInfo.range}`);
          }
          resolveMap.delete(range);
        }
      }
    }
  } while (shouldOptimizeAgain);
};
var getBuildScripts = (json) => {
  const buildScripts = {};
  for (const [scriptName, script] of Object.entries(json.scripts || {})) {
    if (BUILD_SCRIPTS.indexOf(scriptName) >= 0) {
      buildScripts[scriptName] = script;
    }
  }
  return Object.entries(buildScripts).length > 0 ? buildScripts : void 0;
};
var getPackageName2 = (name) => {
  const idx = name.indexOf('/');
  return idx < 0 ? name : name.substring(idx + 1);
};
var parseSpecifier = (fullSpecifier, specifierRange) => {
  let name, range;
  let ignoreIdx = fullSpecifier.indexOf('>');
  if (ignoreIdx < 0) {
    ignoreIdx = fullSpecifier.indexOf('#');
  }
  if (ignoreIdx < 0) {
    ignoreIdx = fullSpecifier.indexOf('|');
  }
  const specifier = ignoreIdx < 0 ? fullSpecifier : fullSpecifier.substring(0, ignoreIdx);
  const idx = specifier.indexOf(`@`, 1);
  if (idx < 0) {
    name = specifier;
    range = specifierRange || '';
  } else {
    name = specifier.substring(0, idx);
    range = specifier.substring(idx + 1);
    if (specifierRange) {
      throw new Error(`Unclear specification. Specifier: ${specifier}, range: ${specifierRange}`);
    }
  }
  if (!range.startsWith('npm:')) return { name, range, alias: '' };
  const realSpecifier = range.substring(4);
  const realIdx = realSpecifier.indexOf(`@`, 1);
  if (realIdx < 0) return { name: realSpecifier, range: '', alias: name };
  return { name: realSpecifier.substring(0, realIdx), range: realSpecifier.substring(realIdx + 1), alias: name };
};
var getResolutionPath = (name, parentResolutionPath) =>
  (parentResolutionPath ? [parentResolutionPath] : []).concat(name.replaceAll('/', '#')).join('/');
var getResolutionRange = ({ resolutions, resolutionPath, depRange }) => {
  let range = depRange;
  for (const [resolution, resolutionRange] of resolutions) {
    if (resolutionPath.endsWith(resolution)) {
      return { range: resolutionRange, resolution };
    }
  }
  return { range };
};
var print2 = (graph) => {
  const seen = /* @__PURE__ */ new Map();
  const printDependency = (node, { depPrefix, suffix }) => {
    let str = depPrefix;
    if (node.workspacePath) {
      str += 'workspace:';
    } else if (node.packageType === 'PORTAL' /* PORTAL */) {
      str += 'portal:';
    }
    str += node.id;
    if (node.wall) {
      str += '|';
      if (node.wall.length > 0) {
        str += Array.from(node.wall);
      }
    }
    str += `(${suffix})`;
    str += '\n';
    return str;
  };
  const visitDependency = (node, { prefix, depPrefix }) => {
    const seq = seen.get(node);
    let str = printDependency(node, { depPrefix, suffix: seq ? seq + '*' : seen.size + '' });
    if (seq) return str;
    seen.set(node, seen.size);
    const deps = [];
    if (node.workspaces) {
      for (const dep of node.workspaces.values()) {
        deps.push(dep);
      }
    }
    if (node.dependencies) {
      for (const dep of node.dependencies) {
        deps.push(dep);
      }
    }
    for (let idx = 0; idx < deps.length; idx++) {
      const dep = deps[idx];
      const hasMoreDependencies = idx < deps.length - 1;
      str += visitDependency(dep, {
        depPrefix: prefix + (hasMoreDependencies ? `\u251C\u2500` : `\u2514\u2500`),
        prefix: prefix + (hasMoreDependencies ? `\u2502 ` : `  `),
      });
    }
    return str;
  };
  return visitDependency(graph, { prefix: '  ', depPrefix: '' }).trim();
};

// src/resolver/resolver.ts
var RESOLVE_STATE_FILE = '.resolve-state.json';
var RESOLVE_STATE_PATH = import_path5.default.join(NODE_MODULES, RESOLVE_STATE_FILE);
var RESOLVE_STATE_VERSION = '1';
var getMetadata = async ({ name, lockTime }) => {
  let fresh;
  const cachedMetadata = await getCachedMetadata(name);
  let metadata;
  if (lockTime && cachedMetadata && cachedMetadata.cacheMeta.date >= lockTime) {
    fresh = false;
    metadata = cachedMetadata.metaJson;
  } else {
    fresh = true;
    metadata = await downloadMetadata(name, cachedMetadata);
  }
  return { name, metadata, fresh };
};
var resolve = async (opts) => {
  const options = opts || {};
  const packageJsonPath = 'package.json';
  const text = await import_fs4.promises.readFile(packageJsonPath, 'utf8');
  const indent = (0, import_detect_indent.default)(text).indent || '  ';
  const json = JSON.parse(text);
  const pkg = await readWorkspaceTree({ json, relativePath: '.' });
  let prevState;
  let prevStateText;
  try {
    prevStateText = await import_fs4.promises.readFile(RESOLVE_STATE_PATH, 'utf8');
    prevState = JSON.parse(prevStateText, resolveStateDeserializer);
  } catch {}
  const script = resolveScript(
    pkg,
    { autoInstallPeers: true, resolutionOptimization: true, receivedMetadata: options.metadata, prod: options.prod },
    prevState,
  );
  const promises = /* @__PURE__ */ new Map();
  try {
    let next;
    let nextArg;
    do {
      next = script.next(nextArg);
      nextArg = void 0;
      if (next.done) break;
      const step = next.value;
      if (step.type === 'get_metadata' /* GET_METADATA */) {
        const { name, lockTime } = step;
        promises.set(name, getMetadata({ name, lockTime }));
      } else if (step.type === 'next_metadata' /* NEXT_METADATA */) {
        const resolvedPromise = await Promise.race(promises.values());
        promises.delete(resolvedPromise.name);
        nextArg = resolvedPromise;
        if (options.verbose) {
          console.log(JSON.stringify(resolvedPromise));
        }
      }
    } while (!next.done);
    const resolveState = next.value.state;
    if (resolveState) {
      resolveState.version = RESOLVE_STATE_VERSION;
      await cachedCreateDir(NODE_MODULES);
      const newStateText = JSON.stringify(resolveState, resolveStateSerializer, 0);
      if (newStateText !== prevStateText) {
        if (prevStateText) console.log('resolve state changed');
        if (prevStateText) {
          await import_fs4.promises.writeFile(
            RESOLVE_STATE_PATH + '.old',
            JSON.stringify(JSON.parse(prevStateText), null, 2),
          );
          await import_fs4.promises.writeFile(
            RESOLVE_STATE_PATH + '.new',
            JSON.stringify(JSON.parse(newStateText), null, 2),
          );
        }
        await import_fs4.promises.writeFile(RESOLVE_STATE_PATH, newStateText);
      }
      const newText = JSON.stringify({ ...json, lockTime: next.value.state.lockTime.toISOString() }, void 0, indent);
      if (newText !== text) {
        console.log('package.json changed');
        await import_fs4.promises.writeFile(packageJsonPath, newText);
      }
    } else {
      console.log('deleted resolve state');
      await import_fs4.promises.rm(RESOLVE_STATE_PATH, { force: true });
    }
    return next.value.graph;
  } finally {
    await Promise.all(promises.values());
  }
};

// src/cli/add/addScript.ts
var addScript = function* (pkg, specifierList, opts) {
  const options = opts || {};
  const pendingMetadata = /* @__PURE__ */ new Set();
  const receivedMetadata = /* @__PURE__ */ new Map();
  const unresolvedSpecifiers = /* @__PURE__ */ new Set();
  const prefix = options.tilde ? `~` : `^`;
  let dependencyType = 'dependencies';
  if (options.dev) {
    dependencyType = 'devDependencies';
  } else if (options.peer) {
    dependencyType = 'peerDependencies';
  } else if (options.optional) {
    dependencyType = 'optionalDependencies';
  }
  for (const specifier of specifierList) {
    const { name, range, alias } = parseSpecifier(specifier);
    if (!pendingMetadata.has(name)) {
      pendingMetadata.add(name);
      yield { type: 'get_metadata' /* GET_METADATA */, name };
      unresolvedSpecifiers.add({ name, range, alias });
    }
  }
  while (pendingMetadata.size > 0) {
    const packageMetadata = yield { type: 'next_metadata' /* NEXT_METADATA */ };
    if (!packageMetadata) {
      throw new Error('Unable to receive packages metadata, aborting...');
    }
    const { name, metadata } = packageMetadata;
    pendingMetadata.delete(name);
    receivedMetadata.set(name, metadata);
  }
  let isModified = false;
  const nextJson = structuredClone(pkg.json);
  for (const { name, range, alias } of unresolvedSpecifiers) {
    const metadata = receivedMetadata.get(name);
    const availableVersions = Object.keys(metadata.versions);
    const version = import_semver2.default.maxSatisfying(availableVersions, range);
    const targetRange = range !== '' ? range : `${prefix}${version}`;
    const depRange = alias ? `npm:${name}:${targetRange}` : targetRange;
    const dependencies = getDependencies(pkg.json, true);
    let existingRange = dependencies.regular.get(name);
    if (depRange !== existingRange) {
      const targetDependencyType = dependencies.regularType.get(name) || dependencyType;
      nextJson[targetDependencyType] = nextJson[targetDependencyType] || {};
      nextJson[targetDependencyType][alias || name] = depRange;
      isModified = true;
    }
  }
  if (isModified) {
    yield { type: 'modify' /* MODIFY */, json: nextJson };
  }
};

// src/installer/installScript.ts
var import_path6 = __toESM(require('path'));
var import_crypto2 = __toESM(require('crypto'));
var parseName = (name) => {
  const idx = name.indexOf('/');
  return idx < 0
    ? { scope: null, packageName: name }
    : { scope: name.substring(0, idx), packageName: name.substring(idx + 1) };
};
var getTransitiveDependencies = (workNode) => {
  const dependencies = [];
  const seenNodes = /* @__PURE__ */ new Set();
  const visitNode = (graphPath) => {
    let node = graphPath[graphPath.length - 1];
    node = node.workspace || node;
    if (seenNodes.has(node)) return;
    seenNodes.add(node);
    if (node.dependencies) {
      for (const dep of node.dependencies.values()) {
        visitNode([...graphPath, dep]);
      }
    }
    dependencies.push(node);
  };
  visitNode([workNode]);
  return dependencies;
};
var traverseGraph = (graph) => {
  const allNodes = /* @__PURE__ */ new Set();
  const buildNodes = /* @__PURE__ */ new Set();
  const nodePathMap = /* @__PURE__ */ new Map();
  const installState = {};
  const addPathToState = (rootNode, pathKind, ...segments) => {
    let node = rootNode;
    for (const segment of segments) {
      let nextNode = node.nodes?.get(segment);
      if (!nextNode) {
        nextNode = {};
        if (!node.nodes) {
          node.nodes = /* @__PURE__ */ new Map();
        }
        node.nodes.set(segment, nextNode);
      }
      node = nextNode;
    }
    node._pathKind = pathKind;
    return node;
  };
  const visitNode = (node, stateNode, parentFsPath) => {
    const { name } = parseSpecifier(node.id);
    const { scope, packageName } = parseName(node.alias || name);
    const fsPath = node.workspacePath || import_path6.default.join(parentFsPath, NODE_MODULES, node.alias || name);
    nodePathMap.set(node, fsPath);
    if (allNodes.has(node)) return;
    let nmNode;
    let nextStateNode = stateNode;
    if (!node.workspacePath) {
      nmNode = node.parent?.workspacePath
        ? stateNode
        : addPathToState(stateNode, 'node_modules' /* NODE_MODULES */, NODE_MODULES);
      nmNode._pathKind = 'node_modules' /* NODE_MODULES */;
      if (scope) {
        nextStateNode = addPathToState(
          addPathToState(nmNode, 'scope' /* SCOPE */, scope),
          'package' /* PACKAGE */,
          packageName,
        );
      } else {
        nextStateNode = addPathToState(nmNode, 'package' /* PACKAGE */, packageName);
      }
      nextStateNode.id = node.id;
      if (node.workspace) {
        nextStateNode.isLink = true;
      }
    } else {
      const location = import_path6.default.join(node.workspacePath, NODE_MODULES);
      nextStateNode = addPathToState(installState, 'node_modules' /* NODE_MODULES */, location);
      nmNode = nextStateNode;
    }
    if (node.bin) {
      const binNode = addPathToState(nmNode, 'dot_bin' /* DOT_BIN */, DOT_BIN);
      Object.keys(node.bin).forEach((filename) => {
        addPathToState(binNode, 'bin_link' /* BIN_LINK */, filename).id = node.id;
      });
    }
    allNodes.add(node);
    if (node.buildScripts) {
      buildNodes.add(node);
    }
    for (const dep of node.dependencies || []) {
      if (dep.parent !== node) continue;
      visitNode(dep, nextStateNode, fsPath);
    }
    for (const dep of node.workspaces || []) {
      visitNode(dep, nextStateNode);
    }
  };
  visitNode(graph, installState);
  return { allNodes, buildNodes, nodePathMap, installState };
};
var getPreferredBuildNodes = (buildDependencies) =>
  Array.from(buildDependencies.keys()).sort(
    (node1, node2) => buildDependencies.get(node1).length - buildDependencies.get(node2).length,
  );
var installStateDeserializer = (key, value) => {
  if (key === 'nodes') {
    return new Map(value);
  } else {
    return value;
  }
};
var installStateSerializer = (key, value) => {
  if (key === 'nodes') {
    return Array.from(value.entries());
  } else if (key.startsWith('_')) {
    return void 0;
  } else {
    return value;
  }
};
var getGraphPath2 = (node) => {
  const graphPath = [];
  let currentNode = node;
  do {
    graphPath.unshift(currentNode);
    currentNode = currentNode.parent;
  } while (currentNode);
  return graphPath;
};
function* cleanNode({ dirPath, stateNode, prevStateNode, existingPaths }) {
  if (stateNode._cleanStatus) return;
  if (dirPath !== NODE_MODULES && (!stateNode.nodes || !prevStateNode)) {
    yield { type: 'delete' /* DELETE */, targetPath: dirPath };
    stateNode._cleanStatus = 'missing' /* MISSING */;
    return;
  }
  const entries = yield { type: 'readdir' /* READDIR */, targetPath: dirPath };
  if (!entries) {
    stateNode._cleanStatus = 'missing' /* MISSING */;
  } else {
    let canRemoveWholeDir = true;
    const pathsToRemove = /* @__PURE__ */ new Map();
    for (const entry of entries) {
      if (dirPath === NODE_MODULES && entry.name === RESOLVE_STATE_FILE) {
        canRemoveWholeDir = false;
      }
      if (entry.name.startsWith('.') && !stateNode.nodes?.has(entry.name)) continue;
      const targetPath = import_path6.default.join(dirPath, entry.name);
      const entryStateNode = stateNode.nodes?.get(entry.name);
      const prevEntryNode = prevStateNode?.nodes?.get(entry.name);
      const entryType = entryStateNode
        ? entryStateNode.isLink || stateNode._pathKind === 'dot_bin' /* DOT_BIN */
          ? 'symlink' /* SYMLINK */
          : 'directory' /* DIRECTORY */
        : void 0;
      const isGoodEntry =
        entryStateNode &&
        prevEntryNode &&
        prevEntryNode.id === entryStateNode.id &&
        prevEntryNode.isLink === entryStateNode.isLink &&
        entry.type === entryType;
      const isWrongEntry =
        !entryStateNode ||
        !prevEntryNode ||
        (entryStateNode &&
          prevEntryNode &&
          (entryStateNode.id !== prevEntryNode.id ||
            entryStateNode.isLink !== prevEntryNode.isLink ||
            entry.type !== entryType));
      if (isGoodEntry) {
        canRemoveWholeDir = false;
        existingPaths.add(targetPath);
      } else if (isWrongEntry) {
        const isInnerNmExists = entryStateNode && entryStateNode.nodes?.get(NODE_MODULES);
        pathsToRemove.set(targetPath, isInnerNmExists);
        if (entryStateNode && isInnerNmExists) {
          canRemoveWholeDir = false;
        }
      }
    }
    if (canRemoveWholeDir) {
      yield { type: 'delete' /* DELETE */, targetPath: dirPath };
      stateNode._cleanStatus = 'missing' /* MISSING */;
    } else {
      for (const [targetPath, isInnerNmExists] of pathsToRemove) {
        if (isInnerNmExists) {
          yield { type: 'delete' /* DELETE */, targetPath, cleanOnly: true };
        } else {
          yield { type: 'delete' /* DELETE */, targetPath };
        }
      }
      stateNode._cleanStatus = 'clean' /* CLEAN */;
    }
  }
}
function* cleanPackage({ pkg, installState, prevState, existingPaths }) {
  const graphPath = getGraphPath2(pkg);
  let stateNode = installState,
    prevNode = prevState,
    parentPath = '.';
  for (const node of graphPath) {
    if (node.workspacePath) {
      parentPath = import_path6.default.join(node.workspacePath, NODE_MODULES);
      stateNode = installState.nodes.get(parentPath);
      prevNode = prevState?.nodes?.get(parentPath);
      yield* cleanNode({ dirPath: parentPath, stateNode, prevStateNode: prevNode, existingPaths });
    } else {
      if (stateNode._pathKind === 'node_modules' /* NODE_MODULES */) {
        yield* cleanNode({ dirPath: parentPath, stateNode, prevStateNode: prevNode, existingPaths });
        if (stateNode._cleanStatus === 'missing' /* MISSING */) break;
        const { name } = parseSpecifier(node.id);
        const { scope, packageName } = parseName(node.alias || name);
        if (scope) {
          yield* cleanNode({
            dirPath: import_path6.default.join(parentPath, scope),
            stateNode: stateNode.nodes.get(scope),
            prevStateNode: prevNode?.nodes?.get(scope),
            existingPaths,
          });
        }
        if (node.bin) {
          yield* cleanNode({
            dirPath: import_path6.default.join(parentPath, '.bin'),
            stateNode: stateNode.nodes.get(DOT_BIN),
            prevStateNode: prevNode?.nodes?.get(DOT_BIN),
            existingPaths,
          });
        }
        parentPath = [parentPath]
          .concat(scope ? [scope] : [])
          .concat([packageName, NODE_MODULES])
          .join(import_path6.default.sep);
        const packageStateNode = scope ? stateNode.nodes.get(scope) : stateNode;
        const packagePrevNode = scope ? prevNode?.nodes?.get(scope) : prevNode;
        const nextStateNode = packageStateNode.nodes.get(packageName).nodes?.get(NODE_MODULES);
        if (nextStateNode) {
          stateNode = nextStateNode;
          prevNode = packagePrevNode?.nodes?.get(packageName)?.nodes?.get(NODE_MODULES);
        }
      }
    }
  }
}
var cleanState = (state) => {
  let isEmpty = !state.buildFail && !state.buildHash;
  if (isEmpty) {
    for (const node of state.nodes.values()) {
      if (node.nodes) {
        isEmpty = false;
        break;
      }
    }
  }
  if (isEmpty) {
    return void 0;
  }
  const cloneNode2 = (node) => {
    const clone = {};
    for (const [key, val] of Object.entries(node)) {
      if (!key.startsWith('_') && key !== 'nodes') {
        clone[key] = val;
      }
    }
    if (node.nodes) {
      clone.nodes = /* @__PURE__ */ new Map();
      for (const [subdir, child2] of node.nodes) {
        clone.nodes.set(subdir, cloneNode2(child2));
      }
    }
    return clone;
  };
  return cloneNode2(state);
};
var getStateNode = (targetPath, state) => {
  if (targetPath === '.' || !state) return state;
  const segments = targetPath.split(import_path6.default.sep);
  const firstNmIndex = targetPath.indexOf(NODE_MODULES);
  if (firstNmIndex < 0) {
    throw new Error(`Assertion: unexpected target path: ${targetPath}`);
  }
  let subdir = segments.slice(0, firstNmIndex + 1).join(import_path6.default.sep);
  let node = state.nodes?.get(subdir);
  for (let idx = firstNmIndex + 1; node && idx < segments.length; idx++) {
    node = node?.nodes?.get(segments[idx]);
  }
  return node;
};
var getBuildHash = (deps, nodePathMap) => {
  const hash = import_crypto2.default.createHash('sha1');
  for (const dep of deps) {
    const targetPath = nodePathMap.get(dep);
    hash.update(`${targetPath}|${dep.id}`);
  }
  return hash.digest('hex');
};
var setBuildFailures = (state, failures) => {
  for (const [targetPath, failedBuild] of failures) {
    const stateNode = getStateNode(targetPath, state);
    stateNode.buildFail = failedBuild;
  }
};
var installScript = function* (graph, prevState) {
  const { allNodes, buildNodes, nodePathMap, installState } = traverseGraph(graph);
  const buildDependencies = /* @__PURE__ */ new Map();
  for (const buildNode of buildNodes) {
    const dependencies = getTransitiveDependencies(buildNode);
    buildDependencies.set(buildNode, dependencies);
    const stateNode = getStateNode(nodePathMap.get(buildNode), installState);
    if (!stateNode) {
      throw new Error(`Unable to find state node for path: ${nodePathMap.get(buildNode)}`);
    }
    stateNode.buildHash = getBuildHash(dependencies, nodePathMap);
  }
  const buildNodePreferenceList = getPreferredBuildNodes(buildDependencies);
  const buildNodePreferenceMap = /* @__PURE__ */ new Map();
  for (let idx = 0; idx < buildNodePreferenceList.length; idx++) {
    buildNodePreferenceMap.set(buildNodePreferenceList[idx], idx);
  }
  const priorityMap = /* @__PURE__ */ new Map();
  let priority = 0;
  for (const buildNode of buildNodePreferenceList) {
    const dependencies = buildDependencies.get(buildNode);
    for (const dep of dependencies) {
      if (!priorityMap.has(dep)) {
        priorityMap.set(dep, priority);
        priority++;
      }
    }
  }
  const sortedNodeList = Array.from(allNodes).sort((node1, node2) => {
    let compareValue = (priorityMap.get(node1) ?? priority) - (priorityMap.get(node2) ?? priority);
    return compareValue === 0 ? node1.id.localeCompare(node2.id) : compareValue;
  });
  const existingPaths = /* @__PURE__ */ new Set();
  const installPaths = /* @__PURE__ */ new Map();
  const cloneablePaths = /* @__PURE__ */ new Map();
  for (const node of sortedNodeList) {
    const targetPath = nodePathMap.get(node);
    yield* cleanPackage({ pkg: node, installState, prevState, existingPaths });
    const isAlreadyUnpacked = existingPaths.has(targetPath);
    let bin;
    const binPath = import_path6.default.join(nodePathMap.get(node.parent || node), NODE_MODULES, DOT_BIN);
    if (node.bin) {
      for (const [binName, relativePath] of Object.entries(node.bin)) {
        if (existingPaths.has(import_path6.default.join(binPath, binName))) {
          continue;
        }
        bin = bin || {};
        bin[binName] = relativePath;
      }
    }
    if (!node.workspacePath && (!isAlreadyUnpacked || bin)) {
      const sourcePath = cloneablePaths.get(node.id);
      if (sourcePath) {
        yield {
          type: 'clone' /* CLONE */,
          skipUnpack: isAlreadyUnpacked || void 0,
          sourcePath,
          targetPath,
          bin,
          id: node.id,
          binPath: bin ? binPath : void 0,
        };
      } else {
        if (node.workspace) {
          yield { type: 'link' /* LINK */, sourcePath: node.workspace.workspacePath, targetPath, id: node.id };
        } else {
          yield {
            type: 'install' /* INSTALL */,
            skipUnpack: isAlreadyUnpacked || void 0,
            tarballUrl: node.tarballUrl,
            targetPath,
            bin,
            id: node.id,
            binPath: bin ? binPath : void 0,
          };
        }
      }
      if (!isAlreadyUnpacked) {
        cloneablePaths.set(node.id, targetPath);
      }
      installPaths.set(node.id, targetPath);
    }
    if (node.buildScripts) {
      const stateNode = getStateNode(targetPath, installState);
      const prevStateNode = getStateNode(targetPath, prevState);
      if (
        stateNode &&
        (isAlreadyUnpacked || node.workspacePath) &&
        prevStateNode &&
        stateNode.buildHash === prevStateNode.buildHash &&
        !prevStateNode.buildFail
      )
        continue;
      const deps = buildDependencies.get(node);
      const waitPaths = [];
      for (const dep of deps) {
        if (
          existingPaths.has(nodePathMap.get(dep)) ||
          (dep.workspacePath && (!dep.buildScripts || dep === node)) ||
          (dep.workspace && !dep.workspace.buildScripts)
        )
          continue;
        const waitPath = installPaths.get(dep.id);
        if (!waitPath) {
          throw new Error(`Dependency ${dep.id} wait path not found for parent package: ${node.id}`);
        }
        waitPaths.push(waitPath);
      }
      const buildScripts = /* @__PURE__ */ new Map();
      const startIdx =
        prevStateNode &&
        prevStateNode.buildFail &&
        (isAlreadyUnpacked || node.workspacePath) &&
        prevStateNode.buildHash === stateNode.buildHash
          ? BUILD_SCRIPTS.indexOf(prevStateNode.buildFail)
          : 0;
      for (let idx = startIdx; idx < BUILD_SCRIPTS.length; idx++) {
        const scriptName = BUILD_SCRIPTS[idx];
        const scriptLine = node.buildScripts[scriptName];
        if (typeof scriptLine !== 'undefined') {
          buildScripts.set(scriptName, scriptLine);
        }
      }
      let event = { type: 'build' /* BUILD */, waitPaths, targetPath, buildScripts, id: node.id };
      if (node.optional) {
        event.optional = true;
      }
      if (node.workspace) {
        event.isWorkspace = true;
      }
      yield event;
    }
  }
  return cleanState(installState);
};

// src/installer/installer.ts
var import_fs5 = require('fs');
var import_constants8 = __toESM(require('constants'));
var import_path8 = __toESM(require('path'));
var import_stream2 = require('stream');
var import_promises2 = require('stream/promises');
var import_tar_stream = __toESM(require_tar_stream());
var import_zlib2 = __toESM(require('zlib'));

// src/runCommand.ts
var import_child_process = __toESM(require('child_process'));
var import_path7 = __toESM(require('path'));
var runCommand = async (cwd, scriptName, script, args, buffer) => {
  if (typeof script === 'undefined') {
    console.error(`Command ${scriptName} not found`);
    return { output: '', code: 1 };
  }
  const cmd = [script, ...args].join(' ');
  const env = {
    NODE: process.execPath,
    INIT_CWD: process.cwd(),
    ...process.env,
  };
  env.npm_lifecycle_event = scriptName;
  env.npm_node_execpath = env.NODE;
  env.npm_execpath = env.npm_execpath || (require.main && require.main.filename);
  const pathList = [];
  const nodeModulesParts = import_path7.default
    .resolve(cwd)
    .split(import_path7.default.sep + NODE_MODULES + import_path7.default.sep);
  const currentParts = [];
  for (const part of nodeModulesParts) {
    currentParts.push(part);
    pathList.unshift(
      import_path7.default.join(
        currentParts.join(import_path7.default.sep + NODE_MODULES + import_path7.default.sep),
        NODE_MODULES,
        DOT_BIN,
      ),
    );
  }
  pathList.push(import_path7.default.dirname(process.argv[1]));
  const envPathList = env.PATH ? env.PATH.split(import_path7.default.delimiter) : [];
  for (const pathElement of envPathList) {
    pathList.push(pathElement);
  }
  env.PATH = pathList.join(import_path7.default.delimiter);
  const options = { env, detached: false, shell: true, cwd };
  if (!buffer) {
    options.stdio = 'inherit';
  }
  let output = ``;
  const task = import_child_process.default.spawn(cmd, [], options);
  if (buffer) {
    task.stdout.on('data', (chunk) => {
      output += chunk.toString('utf8');
    });
    task.stderr.on('data', (chunk) => {
      output += chunk.toString('utf8');
    });
  }
  let promise, resolve2;
  promise = new Promise((r) => (resolve2 = r));
  task.on('exit', (code) => resolve2({ output, code }));
  return await promise;
};

// src/installer/installer.ts
var INSTALL_STATE_PATH = import_path8.default.join(NODE_MODULES, '.install-state.json');
var INSTALL_STATE_VERSION = '1';
var downloadTarball = async (name, version, tarballUrl) => {
  if (!tarballUrl) {
    throw new Error(`tarball url is empty for ${name}@${version}`);
  }
  const response = await get(tarballUrl);
  if (response.statusCode !== 200) {
    throw new Error(
      `Received ${response.statusCode}: ${response.statusMessage} from the registry while downloading ${tarballUrl}`,
    );
  } else {
    const unzip = import_zlib2.default.createGunzip();
    const chunks = [];
    await (0, import_promises2.pipeline)(
      response,
      unzip,
      new import_stream2.Writable({
        write(chunk, _encoding, callback) {
          chunks.push(chunk);
          callback();
        },
      }),
    );
    const body = Buffer.concat(chunks);
    if (body.length === 0) {
      throw new Error(`Received empty tarball from ${tarballUrl}, response status: ${response.statusCode}`);
    }
    await atomicFileWrite(getTarballCacheFilePath(name, version), body);
    return body;
  }
};
var unpackTarball = async (dirPath, buffer) => {
  const extract = import_tar_stream.default.extract();
  const entries = [];
  const passthrough = new import_stream2.PassThrough();
  extract.on('entry', (header, stream, next) => {
    const relativeEntryPath = header.name.substring(header.name.indexOf('/') + 1);
    const entryPath = import_path8.default.join(dirPath, relativeEntryPath);
    if (header.type === 'file') {
      (async () => {
        await cachedCreateDir(import_path8.default.dirname(entryPath));
        await (0, import_promises2.pipeline)(stream, (0, import_fs5.createWriteStream)(entryPath));
        if (header.mode & import_constants8.default.S_IXUSR) {
          entries.push({ location: relativeEntryPath, mode: 493 });
          await import_fs5.promises.chmod(entryPath, 493);
        } else {
          entries.push({ location: relativeEntryPath, mode: 436 });
        }
        next();
      })();
    } else {
      next();
    }
  });
  passthrough.end(buffer);
  await (0, import_promises2.pipeline)(passthrough, extract);
  return entries;
};
var getTarballBaseName = (name, version) => `${name.replaceAll('/', '+')}-${version}`;
var getTarballName = (name, version) => `${getTarballBaseName(name, version)}.tar`;
var getTarballCacheFilePath = (name, version) => {
  const filename = getTarballName(name, version);
  const filePath = import_path8.default.join(CACHE_DIR, 'tarballs', filename);
  return filePath;
};
var getCachedTarball = async (name, version) => {
  const filePath = getTarballCacheFilePath(name, version);
  const isFileCached = await isPathExists(filePath);
  if (isFileCached) {
    const buffer = await import_fs5.promises.readFile(filePath);
    if (buffer.length === 0) {
      throw new Error(`Empty tarball at ${filePath}`);
    }
    return buffer;
  } else {
    return null;
  }
};
var installBin = async ({ bin, binSet, dirPath, binPath }) => {
  if (bin) {
    await cachedCreateDir(binPath);
    for (const [scriptName, scriptPath] of Object.entries(bin)) {
      const dstPath = import_path8.default.join(binPath, scriptName);
      if (binSet.has(dstPath)) continue;
      binSet.add(dstPath);
      const srcPath = import_path8.default.join(dirPath, scriptPath);
      await import_fs5.promises.rm(dstPath, { force: true });
      await import_fs5.promises.chmod(srcPath, 493);
      await import_fs5.promises.symlink(
        import_path8.default.relative(import_path8.default.dirname(dstPath), srcPath),
        dstPath,
      );
    }
  }
};
var installTask = async ({ id, targetPath, tarballMap, tarballUrl, bin, binSet, binPath, skipUnpack }) => {
  if (!skipUnpack) {
    const { name, range: version } = parseSpecifier(id);
    let buffer = await getCachedTarball(name, version);
    if (!buffer) {
      buffer = await downloadTarball(name, version, tarballUrl);
    }
    const entries = await unpackTarball(targetPath, buffer);
    tarballMap.set(id, entries);
  }
  await installBin({ bin, dirPath: targetPath, binSet, binPath });
};
var cloneTask = async ({ id, sourcePath, targetPath, bin, binSet, tarballMap, binPath }) => {
  const entries = tarballMap.get(id);
  if (!entries) {
    throw new Error(`No info of tarball entries for package ${id}`);
  }
  for (const entry of entries) {
    const srcPath = import_path8.default.join(sourcePath, entry.location);
    const dstPath = import_path8.default.join(targetPath, entry.location);
    await cachedCreateDir(import_path8.default.dirname(dstPath));
    await import_fs5.promises.copyFile(srcPath, dstPath, import_constants8.default.COPYFILE_FICLONE);
    if (entry.mode & import_constants8.default.S_IXUSR) {
      await import_fs5.promises.chmod(dstPath, 493);
    }
  }
  await installBin({ bin, dirPath: targetPath, binSet, binPath });
};
var linkTask = async ({ sourcePath, targetPath }) => {
  await cachedCreateDir(import_path8.default.dirname(targetPath));
  await import_fs5.promises.symlink(
    import_path8.default.relative(import_path8.default.dirname(targetPath), sourcePath),
    targetPath,
  );
};
var buildTask = async ({ id, targetPath, isWorkspace, optional, buildScripts, buildFailures }) => {
  for (const [scriptName, script] of buildScripts) {
    const timeStart = Date.now();
    const { code, output } = await runCommand(targetPath, scriptName, script, [], true);
    const timeEnd = Date.now();
    if (isWorkspace || (!optional && code !== 0)) {
      const finalOutput = output.trimEnd();
      console.log(`\u250C\u2500${id} -> ${scriptName} at ${targetPath}`);
      if (finalOutput.length > 0) {
        const lines = finalOutput.split('\n');
        for (const line of lines) {
          console.log(`\u2502 ${line}`);
        }
      }
      console.log(`\u2514\u2500\u2500\u2500${code === 0 ? '' : ' failed with code: ' + code} ${timeEnd - timeStart}ms`);
    }
    if (code !== 0 && !optional) {
      buildFailures.set(targetPath, scriptName);
      break;
    }
  }
};
var getDirEntryType = (entry) => {
  if (entry.isSymbolicLink()) {
    return 'symlink' /* SYMLINK */;
  } else if (entry.isDirectory()) {
    return 'directory' /* DIRECTORY */;
  } else {
    return 'file' /* FILE */;
  }
};
var deleteDir = async ({ targetPath, cleanOnly }) => {
  if (!cleanOnly) {
    await import_fs5.promises.rm(targetPath, { force: true, recursive: true });
  } else {
    const entries = await import_fs5.promises.readdir(targetPath);
    for (const entry in entries) {
      if (entry === NODE_MODULES) continue;
      await import_fs5.promises.rm(import_path8.default.join(targetPath, entry), { force: true, recursive: true });
    }
  }
};
var write = async (graph) => {
  let prevState;
  let prevStateText;
  try {
    prevStateText = await import_fs5.promises.readFile(INSTALL_STATE_PATH, 'utf8');
    prevState = JSON.parse(prevStateText, installStateDeserializer);
  } catch {}
  const script = installScript(graph, prevState);
  const installTasks = /* @__PURE__ */ new Map();
  const buildTasks = /* @__PURE__ */ new Map();
  const buildFailures = /* @__PURE__ */ new Map();
  const binSet = /* @__PURE__ */ new Set();
  const tarballMap = /* @__PURE__ */ new Map();
  let next;
  let nextArg;
  try {
    do {
      next = script.next(nextArg);
      nextArg = void 0;
      if (next.done) break;
      const step = next.value;
      const { targetPath } = step;
      if (step.type === 'readdir' /* READDIR */) {
        let entries = [];
        try {
          entries = await import_fs5.promises.readdir(targetPath, { withFileTypes: true });
        } catch {}
        nextArg = entries.map((entry) => ({ name: entry.name, type: getDirEntryType(entry) }));
      } else if (step.type === 'delete' /* DELETE */) {
        await deleteDir({ targetPath, cleanOnly: step.cleanOnly });
      }
      if (step.type === 'install' /* INSTALL */) {
        installTasks.set(
          targetPath,
          installTask({
            id: step.id,
            targetPath,
            tarballUrl: step.tarballUrl,
            tarballMap,
            binSet,
            bin: step.bin,
            binPath: step.binPath,
            skipUnpack: step.skipUnpack,
          }),
        );
      } else if (step.type === 'clone' /* CLONE */) {
        const { sourcePath } = step;
        const installPromise = installTasks.get(sourcePath);
        if (!installPromise) {
          throw new Error('Assertion: nothing to clone');
        }
        installTasks.set(
          targetPath,
          installPromise.then(() =>
            cloneTask({
              id: step.id,
              sourcePath,
              targetPath,
              tarballMap,
              binSet,
              bin: step.bin,
              binPath: step.binPath,
            }),
          ),
        );
      } else if (step.type === 'link' /* LINK */) {
        installTasks.set(targetPath, linkTask({ sourcePath: step.sourcePath, targetPath }));
      } else if (step.type === 'build' /* BUILD */) {
        const waitTasks = [];
        for (const waitPath of step.waitPaths) {
          const installPromise = installTasks.get(waitPath);
          waitTasks.push(installPromise);
          const buildPromise = buildTasks.get(waitPath);
          if (buildPromise) {
            waitTasks.push(buildPromise);
          }
        }
        buildTasks.set(
          targetPath,
          Promise.all(waitTasks).then(() =>
            buildTask({
              id: step.id,
              targetPath,
              optional: step.optional,
              isWorkspace: step.isWorkspace,
              buildScripts: step.buildScripts,
              buildFailures,
            }),
          ),
        );
      }
    } while (!next.done);
  } finally {
    await Promise.all(installTasks.values());
    await Promise.all(buildTasks.values());
  }
  if (next && next.value) {
    const installState = next.value;
    installState.version = INSTALL_STATE_VERSION;
    setBuildFailures(installState, buildFailures);
    await cachedCreateDir(NODE_MODULES);
    const newStateText = JSON.stringify(installState, installStateSerializer, 0);
    if (newStateText !== prevStateText) {
      if (prevStateText) console.log('install state changed');
      if (prevStateText) {
        await import_fs5.promises.writeFile(
          INSTALL_STATE_PATH + '.old',
          JSON.stringify(JSON.parse(prevStateText), null, 2),
        );
        await import_fs5.promises.writeFile(
          INSTALL_STATE_PATH + '.new',
          JSON.stringify(JSON.parse(newStateText), null, 2),
        );
      }
      await import_fs5.promises.writeFile(INSTALL_STATE_PATH, newStateText);
    }
  } else {
    console.log('deleted install state');
    await import_fs5.promises.rm(INSTALL_STATE_PATH, { force: true });
  }
  return buildFailures.size === 0 ? 0 : 1;
};

// src/cli/install/index.ts
var install = async (options) => {
  if (!options?.skipBanner) {
    console.log(`${TOOL_NAME} install ${VERSION}`);
  }
  const resolveStart = Date.now();
  await ensureCacheDirExists();
  const graph = await resolve(options);
  const resolveEnd = Date.now();
  const resolveTime = (resolveEnd - resolveStart) / 1e3;
  console.log(`Resolution done in ${resolveTime}s`);
  const hoistedGraph = hoist(graph, { check: 'FINAL' /* FINAL */ });
  const installStart = Date.now();
  await write(hoistedGraph);
  const installEnd = Date.now();
  const installTime = (installEnd - installStart) / 1e3;
  console.log(`Installing done in ${installTime}s`);
  const totalTime = (installEnd - resolveStart) / 1e3;
  console.log(`Total time: ${totalTime}s `);
  return 0;
};

// src/cli/add/index.ts
var getMetadata2 = async ({ name }) => {
  const metadata = await downloadMetadata(name);
  return { name, metadata };
};
var add = async (specifierList, options) => {
  console.log(`${TOOL_NAME} add ${VERSION}`);
  await ensureCacheDirExists();
  const packageJsonPath = 'package.json';
  const text = await import_fs6.promises.readFile(packageJsonPath, 'utf8');
  const indent = (0, import_detect_indent2.default)(text).indent || '  ';
  const json = JSON.parse(text);
  const script = addScript({ json }, specifierList, options);
  const promises = /* @__PURE__ */ new Map();
  const metadata = /* @__PURE__ */ new Map();
  let isModified = false;
  let next;
  try {
    let nextArg;
    do {
      next = script.next(nextArg);
      nextArg = void 0;
      if (next.done) break;
      const step = next.value;
      if (step.type === 'get_metadata' /* GET_METADATA */) {
        const { name } = step;
        promises.set(name, getMetadata2({ name }));
      } else if (step.type === 'next_metadata' /* NEXT_METADATA */) {
        const resolvedPromise = await Promise.race(promises.values());
        promises.delete(resolvedPromise.name);
        nextArg = resolvedPromise;
        metadata.set(resolvedPromise.name, resolvedPromise.metadata);
      } else if (step.type === 'modify' /* MODIFY */) {
        const newText = JSON.stringify(step.json, void 0, indent);
        if (newText !== text) {
          console.log('package.json changed');
          isModified = true;
          await import_fs6.promises.writeFile(packageJsonPath, newText);
        }
      }
    } while (!next.done);
  } finally {
    await Promise.all(promises.values());
  }
  if (isModified) {
    console.log('install meta:', JSON.stringify(metadata));
    return await install({ metadata, skipBanner: true, verbose: true });
  } else {
    return 0;
  }
};

// src/cli/remove/index.ts
var import_fs7 = require('fs');
var import_detect_indent3 = __toESM(require_detect_indent());

// src/cli/remove/removeScript.ts
var removeScript = function* (pkg, nameList) {
  let isModified = false;
  const nextJson = structuredClone(pkg.json);
  for (const name of nameList) {
    let found = false;
    for (const dependencyType of DEPENDENCY_TYPES) {
      if (nextJson[dependencyType] && nextJson[dependencyType][name]) {
        delete nextJson[dependencyType][name];
        if (Object.keys(nextJson[dependencyType]).length === 0) {
          delete nextJson[dependencyType];
        }
        found = true;
        isModified = true;
      }
    }
    if (!found) {
      yield { type: 'not_found' /* NOT_FOUND */, message: `The module '${name}' is not present in the 'package.json'` };
      isModified = false;
      break;
    }
  }
  if (isModified) {
    yield { type: 'modify' /* MODIFY */, json: nextJson };
  }
};

// src/cli/remove/index.ts
var remove = async (nameList) => {
  console.log(`${TOOL_NAME} remove ${VERSION}`);
  await ensureCacheDirExists();
  let isModified = false;
  const packageJsonPath = 'package.json';
  const text = await import_fs7.promises.readFile(packageJsonPath, 'utf8');
  const indent = (0, import_detect_indent3.default)(text).indent || '  ';
  const json = JSON.parse(text);
  const script = removeScript({ json }, nameList);
  let hasErrors = false;
  let next;
  do {
    next = script.next();
    if (next.done) break;
    const step = next.value;
    if (step.type === 'modify' /* MODIFY */) {
      const newText = JSON.stringify(step.json, void 0, indent);
      if (newText !== text) {
        console.log('package.json changed');
        isModified = true;
        await import_fs7.promises.writeFile(packageJsonPath, newText);
      }
    } else if (step.type === 'not_found' /* NOT_FOUND */) {
      hasErrors = true;
      console.error(step.message);
    }
  } while (!next.done);
  if (isModified) {
    return await install({ skipBanner: true });
  } else {
    return hasErrors ? 1 : 0;
  }
};

// src/cli/index.ts
var cli = async () => {
  let exitCode;
  program.name(TOOL_NAME).version(VERSION);
  program
    .command('add [packages...]')
    .description('installs one or more dependencies into the project')
    .option('-D, --dev', 'save package to `devDependencies`')
    .option('-P, --peer', 'save package to `peerDependencies`')
    .option('-O, --optional', 'save package to `optionalDependencies`')
    .option('-T, --tilde', 'install most recent release with the same minor version')
    .action(async (specifierList, options) => {
      exitCode = await add(specifierList, options);
    });
  program
    .command('install', { isDefault: true })
    .alias('i')
    .description('installs all the dependencies of a project')
    .option('-P, --prod', 'modules from `devDependencies` will not be installed')
    .action(async (options) => {
      exitCode = await install(options);
    });
  program
    .command('remove [packages...]')
    .alias('rm')
    .description('removes one or more dependencies from the project')
    .action(async (nameList) => {
      exitCode = await remove(nameList);
    });
  program
    .command('run')
    .description('runs a script from the package')
    .action(async () => {});
  await program.parseAsync();
  return exitCode;
};
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    cli,
  });
/*! Bundled license information:

is-number/index.js:
  (*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

to-regex-range/index.js:
  (*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   *)

fill-range/index.js:
  (*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   *)
*/
//# sourceMappingURL=cli.js.map
