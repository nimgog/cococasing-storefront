const setEnv = () => {
  const fs = require('fs');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.prod.ts';
  // Load node modules
  const colors = require('colors');
  const appVersion = require('../../package.json').version;
  require('dotenv').config({
    path: 'src/environments/.env',
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
  ipapiKey: '${process.env['ipapiKey']}',
  storeFrontAT: '${process.env['storeFrontAT']}',
  storeFrontEndpoint: '${process.env['storeFrontEndpoint']}',
  contactWorkerEndpoint: '${process.env['contactWorkerEndpoint']}',
  turnstileSiteKey: '${process.env['turnstileSiteKey']}',
  mailChimpNewsletterEndpoint: '${process.env['mailChimpNewsletterEndpoint']}',
  appVersion: '${appVersion}',
  production: true,
};
`;
  console.log(
    colors.magenta(
      'The file `environment.ts` will be written with the following content: \n'
    )
  );
  writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(
        colors.magenta(
          `Angular environment.ts file generated correctly at ${targetPath} \n`
        )
      );
    }
  });
};

setEnv();
