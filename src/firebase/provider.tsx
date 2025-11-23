
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, Suspense } from 'react';
import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
    app: FirebaseApp | null;
    auth: Auth | null;
    storage: FirebaseStorage | null;
    firestore: Firestore | null;
    user: User | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
    const [firebase, setFirebase] = useState<FirebaseContextType>({
        app: null,
        auth: null,
        storage: null,
        firestore: null,
        user: null
    });

    useEffect(() => {
        let app: FirebaseApp;
        const apps = getApps();
        if (apps.length > 0) {
            app = apps[0];
        } else {
            app = initializeApp(firebaseConfig);
        }

        const auth = getAuth(app);
        const storage = getStorage(app);
        const firestore = getFirestore(app);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebase({ app, auth, storage, firestore, user });
        });

        // Set initial state
        if (!firebase.app) {
          setFirebase({ app, auth, storage, firestore, user: auth.currentUser });
        }
        
        return () => unsubscribe();
    }, []);

    return (
        <FirebaseContext.Provider value={firebase}>
            <Suspense>
              <FirebaseErrorListener />
            </Suspense>
            {children}
        </FirebaseContext.Provider>
    );
}

export function useFirebase() {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}
