// Base IndexedDB en mémoire, neuve pour chaque test.
import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';

beforeEach(() => {
  Dexie.dependencies.indexedDB = new IDBFactory();
  Dexie.dependencies.IDBKeyRange = IDBKeyRange;
});

// Le Blob de jsdom ne passe pas le clonage d'IndexedDB (structuredClone de Node) ;
// celui de Node, oui, comme dans un vrai navigateur.
interface NodeProcess {
  getBuiltinModule(id: 'node:buffer'): { Blob: typeof Blob };
}
globalThis.Blob = (globalThis as unknown as { process: NodeProcess }).process.getBuiltinModule(
  'node:buffer',
).Blob;

// URL d'objets factices (jsdom ne sait pas les créer pour ce Blob).
let objectUrls = 0;
URL.createObjectURL = () => `blob:test/${++objectUrls}`;
URL.revokeObjectURL = () => undefined;
