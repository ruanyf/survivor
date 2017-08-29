#!/usr/bin/env node
'use strict';
var argv = require('yargs').argv;
var md = require('../lib');

var string = argv._[0];

if (!string) return;
console.log(md.render(string));
