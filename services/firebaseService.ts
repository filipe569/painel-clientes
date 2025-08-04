import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get, Unsubscribe, Database } from "firebase/database";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    Auth,
    User
} from "firebase/auth";
import { Client, HistoryEntry, AuthUser } from '../types';

// INSTRUÇÕES DE CONFIGURAÇÃO
// 1. Acesse seu projeto no Firebase Console: https://console.firebase.google.com/
// 2. Vá para as "Configurações do projeto" (ícone de engrenagem).
// 3. Na aba "Geral", role para baixo até "Seus apps".
// 4. Se não tiver um app da Web, crie um.
// 5. Clique para ver o "SDK de configuração" e selecione "Config".
// 6. Copie o objeto `firebaseConfig` inteiro e cole abaixo, substituindo o objeto de exemplo.

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd-sLiDQwNONhmTblOEK83Z0P1str4MSk",
  authDomain: "gerenciadorpro-37789.firebaseapp.com",
  databaseURL: "https://gerenciadorpro-37789-default-rtdb.firebaseio.com",
  projectId: "gerenciadorpro-37789",
  storageBucket: "gerenciadorpro-37789.firebasestorage.app",
  messagingSenderId: "625019706049",
  appId: "1:625019706049:web:9e908621358e1210cb5240"
};


// Verificação para a UI saber se a configuração foi feita.
export const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyAd-sLiDQwNONhmTblOEK83Z0P1str4MSk";

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;

const CONFIG_ERROR = new Error("A configuração do Firebase está incompleta. Verifique o objeto `firebaseConfig` em 'services/firebaseService.ts'");

function initializeFirebase() {
  if (app) return; 
  if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        auth = getAuth(app);
    } catch (error) {
        console.error("Falha ao inicializar o Firebase. Verifique o objeto `firebaseConfig` em services/firebaseService.ts.", error);
        db = null;
        auth = null;
    }
  } else {
    console.warn("CONFIGURAÇÃO NECESSÁRIA: O objeto `firebaseConfig` não foi definido no arquivo 'services/firebaseService.ts'. As funcionalidades de banco de dados estão desativadas.");
  }
}

initializeFirebase();

const getDataPath = (uid: string) => `users/${uid}/data`;

const arrayToObject = <T extends { id:string }>(arr: T[]): Record<string, T> => {
    if (!arr) return {};
    return arr.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {} as Record<string, T>);
};

// --- AUTH FUNCTIONS ---

export const onAuthChanged = (callback: (user: AuthUser | null) => void): Unsubscribe => {
    if (!auth) {
        callback(null);
        return () => {};
    }
    return onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
            callback({ uid: user.uid, email: user.email });
        } else {
            callback(null);
        }
    });
};

export const signIn = (email: string, password: string): Promise<User> => {
    if (!auth) return Promise.reject(CONFIG_ERROR);
    return signInWithEmailAndPassword(auth, email, password).then(userCredential => userCredential.user);
};

export const logOut = (): Promise<void> => {
    if (!auth) return Promise.reject(CONFIG_ERROR);
    return signOut(auth);
};


// --- DATABASE FUNCTIONS ---

export const listenToData = (
    uid: string,
    callback: (data: { clients: Client[], history: HistoryEntry[] }) => void,
    errorCallback: (error: Error) => void
): Unsubscribe => {
  if (!db) {
    errorCallback(CONFIG_ERROR);
    return () => {};
  }
  const dataRef = ref(db, getDataPath(uid));
  return onValue(dataRef, 
    (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const clients = data.clients ? Object.values(data.clients) as Client[] : [];
            const history = data.history ? (Object.values(data.history) as HistoryEntry[]).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
            callback({ clients, history });
        } else {
            callback({ clients: [], history: [] });
        }
    },
    (error) => {
        console.error("Firebase read error:", error);
        errorCallback(error);
    }
  );
};

export const writeData = (uid: string, data: { clients: Client[], history: HistoryEntry[] }): Promise<void> => {
    if (!db) return Promise.reject(CONFIG_ERROR);
    const dataForFirebase = {
        clients: arrayToObject(data.clients),
        history: arrayToObject(data.history)
    };
    return set(ref(db, getDataPath(uid)), dataForFirebase);
};

export const getDataForUser = async (uid: string): Promise<{ clients: Client[], history: HistoryEntry[] }> => {
    if (!db) return Promise.reject(CONFIG_ERROR);
    const snapshot = await get(ref(db, getDataPath(uid)));
     if (snapshot.exists()) {
      const data = snapshot.val();
      const clients = data.clients ? Object.values(data.clients) as Client[] : [];
      const history = data.history ? (Object.values(data.history) as HistoryEntry[]).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
      return { clients, history };
    }
    return { clients: [], history: [] };
}

// Renaming for clarity in other parts of the app
export const writeDataForUser = writeData;