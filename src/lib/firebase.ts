import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

/**
 * Firebase app core only. Auth and Firestore live in `firebaseAuth.ts` and
 * `firebaseDb.ts` so a page downloads just the SDK it uses: importing one file
 * that initialised both used to pull all ~670 KB for any Firebase touch.
 */
export const app = initializeApp(firebaseConfig);
export const firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
