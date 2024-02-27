import {
  ExecSyncOptionsWithStringEncoding,
  exec,
  execSync,
} from 'child_process';

// Signal to graphile-migrate scripts that we're in the tests
process.env.NODE_ENV = 'test';

const watchMode = process.argv.indexOf('--watch') > -1;
let executed = false;

export default function setup() {
  if (executed) return;

  // reset the test database
  const opts: ExecSyncOptionsWithStringEncoding = {
    encoding: 'utf-8',
    stdio: 'inherit',
  };

  execSync('pnpm nx run database:cli reset --shadow --erase', opts);

  if (watchMode) {
    exec('pnpm nx run database:cli watch --shadow', opts);
  } else {
    execSync('pnpm nx run database:cli watch --shadow --once', opts);
  }

  executed = true;
}
