
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, Suspense } from 'react';
import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";
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

        if (typeof window !== 'undefined') {
            isSupported().then(supported => {
                if (supported) {
                    getAnalytics(app);
                }
            });
        }

        const auth = getAuth(app);
        const storage = getStorage(app);
        const firestore = getFirestore(app);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebase({ app, auth, storage, firestore, user });
        });
        
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FirebaseContext.Provider value={firebase}>
            <Suspense>
              {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
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
