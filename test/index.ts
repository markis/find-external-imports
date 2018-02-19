import { deepEqual, ok, throws } from 'assert';
import { findExternalImports } from '../src';

{
  throws(() => {
      findExternalImports(undefined as any);
  });
}

{
  const imports = findExternalImports({ dir: './src' });

  deepEqual(imports, ['fs', 'typescript']);
}

{
  const imports = findExternalImports({ dir: './src', exclusion: /fs/ });

  deepEqual(imports, ['typescript']);
}

{
  const imports = findExternalImports({ dir: './node_modules' });

  ok(imports.length > 0);
}
