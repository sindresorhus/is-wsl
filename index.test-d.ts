import {expectType} from 'tsd';
import isWsl from './index.js';

expectType<boolean>(isWsl);
