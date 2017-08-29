#!/usr/bin/env node

'use strict';

var
  program = require( 'commander' ),
  path = require( 'path' ),
  managePath = require( 'manage-path' ),
  clone = require( 'lodash.clone' ),
  spawn = require( 'spawn-command' ),
  opt = require( '../lib/index' ),
  pkg = require( '../package.json' );

program
  .version( pkg.version )
  .description( 'Execute CLI Statements based upon Opt-In / Opt-Out Rules.' )
  .option( '-i, --in [rule]', 'Rule to be opted-in to' )
  .option( '-o, --out [rule]', 'Rule to be outed-out of' )
  .option( '-e, --exec <command>', 'Command to execute when opted-in to or not opted-out of the given rule' )
  .option( '--verbose', 'Output additional details' );

program.on( '--help', function customHelp() {
  console.log( // eslint-disable-line no-console
    '  Please specify\n\n' +
    '    - either a rule to be opted-in to or out of\n' +
    '    - a command to execute\n\n' +
    '  See https://www.npmjs.com/package/opt-cli for detailed usage instructions\n'
  );
} );

program.parse( process.argv );

cliMain();

function cliMain() {
  var
    info = function emptyFn() { }, // eslint-disable-line func-style, no-empty-function
    cwd = process.cwd(),
    env = clone( process.env ), // eslint-disable-line no-process-env
    alteredEnvPath = null;

  // invalid arguments: "in" OR "out" have to be specified, as well es "exec"
  if ( ( program.in && program.out ) || ( !program.in && !program.out ) || !program.exec ) {
    program.help();

    return;
  }

  if ( program.verbose ) {
    info = console.log; // eslint-disable-line no-console
  }

  if ( program.in && !opt.testOptIn( program.in ) ) {
    info( 'Not opted-in to "' + program.in + '".' );

    return;
  }

  if ( program.out && opt.testOptOut( program.out ) ) {
    info( 'Opted-out of "' + program.out + '".' );

    return;
  }

  // prepare PATH env var to include cwd/node_modules/bin
  alteredEnvPath = managePath( env );
  alteredEnvPath.unshift( path.resolve( cwd, 'node_modules', '.bin' ) );

  info( 'Execute all the things: ' + program.exec );
  spawn( program.exec, { stdio: 'inherit', env: env } )
    .on( 'exit', process.exit );
}
