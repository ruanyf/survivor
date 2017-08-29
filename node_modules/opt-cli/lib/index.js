'use strict';

var
  fs = require( 'fs' ),
  path = require( 'path' );


function fileExists( filePath ) {
  var
    fileStat = null;

  try {
    fileStat = fs.statSync( filePath );
  } catch ( ex ) {
    return false;
  }

  return fileStat && fileStat.isFile();
}

function transformFileContents( file ) {
  var
    filePath = path.resolve( process.cwd(), file ),
    optFileRegex = /\s{0,}(#[^\r\n]{0,}){0,}$/,
    opts = [];

  if ( fileExists( filePath ) ) {
    opts = ( fs.readFileSync( filePath, 'utf8' ) )
      .split( '\n' )
      .map( function filterComments( line ) {
        return line.replace( optFileRegex, '' );
      } )
      .filter( function removeEmptyLines( line ) {
        return line !== '';
      } );
  }

  return opts.length > 0 ? opts : null; // eslint-disable-line no-magic-numbers
}

function getPackageConfig() {
  var
    jsonPath = path.resolve( process.cwd(), 'package.json' ),
    json = null,
    config = {};

  if ( fileExists( jsonPath ) && ( json = require( jsonPath ) ) && json.hasOwnProperty( 'config' ) && json.config.hasOwnProperty( 'opt' ) ) { // eslint-disable-line global-require
    /* istanbul ignore else */
    if ( json.config.opt.hasOwnProperty( 'in' ) && Array.isArray( json.config.opt.in ) ) { // eslint-disable-line id-match
      config.in = json.config.opt.in;
    }

    /* istanbul ignore else */
    if ( json.config.opt.hasOwnProperty( 'out' ) && Array.isArray( json.config.opt.out ) ) { // eslint-disable-line id-match
      config.out = json.config.opt.out;
    }
  }

  return config;
}

function getEnvironmentConfig() {
  var
    config = {};

  if ( process.env.hasOwnProperty( 'OPT_IN' ) ) {
    config.in = process.env.OPT_IN.split( path.delimiter );
  }

  if ( process.env.hasOwnProperty( 'OPT_OUT' ) ) {
    config.out = process.env.OPT_OUT.split( path.delimiter );
  }

  return config;
}

function getOptIns() {
  var
    config = getPackageConfig(),
    env = getEnvironmentConfig();

  return config.in || transformFileContents( '.opt-in' ) || env.in || [];
}

function getOptOuts() {
  var
    config = getPackageConfig(),
    env = getEnvironmentConfig();

  return config.out || transformFileContents( '.opt-out' ) || env.out || [];
}

function includesAll( needles, haystack ) {
  var
    needle = null,
    thisNeedles = [].concat( needles ),
    len = thisNeedles.length;

  if ( !needles || !len || !haystack.length ) {
    return false;
  }

  while ( len-- ) {
    needle = thisNeedles[ len ];
    if ( haystack.indexOf( needle ) === -1 ) { // eslint-disable-line no-magic-numbers
      return false;
    }
  }

  return true;
}


function getExplicitOpts() {
  var
    allOpts = {};

  getOptIns().forEach(
    function iterateOptIns( opt ) {
      allOpts[ opt ] = true;
    }
  );

  getOptOuts().forEach(
    function iterateOptOuts( opt ) {
      allOpts[ opt ] = false;
    }
  );

  return allOpts;
}

function testOptIn( opts ) {
  return includesAll( opts, getOptIns() );
}

function testOptOut( opts ) {
  return includesAll( opts, getOptOuts() );
}


module.exports = {
  getExplicitOpts: getExplicitOpts,
  testOptIn: testOptIn,
  testOptOut: testOptOut
};
