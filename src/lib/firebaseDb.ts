import { getFirestore } from 'firebase/firestore';
import { app, firestoreDatabaseId } from './firebase';

/** The project uses a named database, not `(default)` (see docs/OPERATIONS.md §3). */
export const db = getFirestore(app, firestoreDatabaseId);
