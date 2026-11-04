import * as migration_20261104_051602_initial from './20261104_051602_initial';
import * as migration_20261104_052517_profile_years from './20261104_052517_profile_years';

export const migrations = [
  {
    up: migration_20261104_051602_initial.up,
    down: migration_20261104_051602_initial.down,
    name: '20261104_051602_initial',
  },
  {
    up: migration_20261104_052517_profile_years.up,
    down: migration_20261104_052517_profile_years.down,
    name: '20261104_052517_profile_years'
  },
];
