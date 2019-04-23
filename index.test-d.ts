import {expectType} from 'tsd';
import isWsl = require('.');

expectType<boolean>(isWsl);
