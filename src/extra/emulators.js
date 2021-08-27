import { connectAuthEmulator  } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";
import { connectStorageEmulator } from "firebase/storage";

function connectAll(auth, db, storage) {
  if (window.location.hostname === "localhost" && false) {
    if (auth !== null)
      connectAuthEmulator(auth, "http://localhost:9099");
    if (db !== null)
      connectFirestoreEmulator(db, 'localhost', 8080);
    if (storage !== null) {
      connectStorageEmulator(storage, "localhost", 9199);
    }
  }
}

export default connectAll ;