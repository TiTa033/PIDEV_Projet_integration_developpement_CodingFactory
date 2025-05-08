// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  production: false,
  appVersion: packageInfo.version, // ✅ Define appVersion here!
  apiUrl: 'http://localhost:8080/api', // Backend base URL
  stripePublicKey: 'pk_test_51RMTtWQ6GycRUWGTwujdhkpYROUAQ80iBvxFxAkcyM7SAoknDmyNjxCywRMxXWaCaGkv6CrggbtTI44gRLtyxSAS00UOvYrLDd' // Replace with your actual Stripe public key
};





/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
