import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'rui',
  buildEs5: 'prod',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
  ],
  globalStyle: 'src/global/styles.css',
};
