/* eslint no-console: 0 */
import test from 'ava';

const
  proxyquire = require( 'proxyquire' ).noPreserveCache(),
  processCwd = process.cwd,
  workingDir = process.cwd(),
  consoleLog = console.log;


test.beforeEach( () => {
  process.argv.splice( 2, process.argv.length );
  process.cwd = () => workingDir;
} );

test.afterEach( () => {
  process.cwd = processCwd;
  console.log = consoleLog;
} );


test( 'test execution with insufficient arguments', ( t ) => {
  const
    commander = {
      evts: [],
      help() {
        commander.evts.forEach( ( custHelp ) => {
          custHelp();
        } );
        t.pass();
      },
      on( event, func ) {
        if ( event === '--help' ) {
          commander.evts.push( func );
        }
      },
      version() {
        return commander;
      },
      description() {
        return commander;
      },
      option() {
        return commander;
      },
      parse() {
        return commander;
      },
      // prevent proxyquire from caching!
      '@global': true
    };

  console.log = ( message ) => {
    t.regex( message, /[^]Please specify[^]/ );
  };

  t.plan( 2 );
  proxyquire( '../bin/index', { commander } );
} );

test( 'test execution on not specified opt-in rule', ( t ) => {
  t.plan( 1 );

  process.argv = process.argv.concat( [
    '--in',
    'unset-opt-in-rule',
    '--exec',
    'echo "opt-cli bin test output #1"',
    '--verbose'
  ] );

  console.log = ( message ) => {
    t.deepEqual( message, 'Not opted-in to "unset-opt-in-rule".' );
  };

  proxyquire( '../bin/index', { } );
} );

test( 'test execution on not specified opt-out rule', ( t ) => {
  t.plan( 2 );

  process.argv = process.argv.concat( [
    '--out',
    'unset-opt-out-rule',
    '--exec',
    'echo "opt-cli bin test output #2"'
  ] );

  proxyquire( '../bin/index', {
    'spawn-command'( command ) {
      t.deepEqual( command, 'echo "opt-cli bin test output #2"' );

      return {
        on: ( what ) => {
          t.deepEqual( what, 'exit' );
        }
      };
    }
  } );
} );

test( 'test execution on a specified opt-in rule', ( t ) => {
  t.plan( 1 );

  process.argv = process.argv.concat( [
    '--out',
    'set-opt-out-rule',
    '--exec',
    'echo "opt-cli bin test output #2"',
    '--verbose'
  ] );

  console.log = ( message ) => {
    t.deepEqual( message, 'Opted-out of "set-opt-out-rule".' );
  };

  proxyquire( '../bin/index', {
    '../lib/index': {
      testOptOut( opt ) {
        return opt === 'set-opt-out-rule';
      },
      // prevent proxyquire from caching!
      '@global': true
    }
  } );
} );
