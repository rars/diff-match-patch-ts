import 'core-js/es6';
import 'core-js/es7/reflect';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;

// Prevent Karma from running prematurely.
// tslint:disable-next-line:no-empty
__karma__.loaded = () => {};

// require all files ending in '.spec.ts' from the
// current directory and all subdirectories
const testsContext = (require as any).context('.', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);

__karma__.start();
