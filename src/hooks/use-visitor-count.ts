
"use client";

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/provider';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

const COUNTER_SESSION_KEY = 'visitor_counted';

export function useVisitorCount() {
    const { firestore } = useFirebase();
    const [visitorCount, setVisitorCount] = useState<number | null>(null);

    useEffect(() => {
        if (!firestore) return;

        const counterRef = doc(firestore, 'siteStats', 'visitorCounter');

        const incrementCount = async () => {
            try {
                // Check if this session has already been counted
                if (sessionStorage.getItem(COUNTER_SESSION_KEY)) {
                    // If counted, just fetch the value
                    const docSnap = await getDoc(counterRef);
                    if (docSnap.exists()) {
                        setVisitorCount(docSnap.data().count);
                    } else {
                        // Fallback if doc doesn't exist yet
                        setVisitorCount(1);
                    }
                    return;
                }

                // If not counted, increment and then fetch
                await setDoc(counterRef, { count: increment(1) }, { merge: true });
                
                const updatedDocSnap = await getDoc(counterRef);
                 if (updatedDocSnap.exists()) {
                    setVisitorCount(updatedDocSnap.data().count);
                }
                
                // Mark this session as counted
                sessionStorage.setItem(COUNTER_SESSION_KEY, 'true');

            } catch (error) {
                console.error("Error updating visitor count:", error);
                // Attempt to fetch count even if increment fails
                 try {
                    const docSnap = await getDoc(counterRef);
                    if (docSnap.exists()) {
                        setVisitorCount(docSnap.data().count);
                    } else {
                        // If it doesn't exist and increment fails, maybe set to 1?
                        setVisitorCount(1);
                    }
                } catch (fetchError) {
                     console.error("Error fetching visitor count after failed increment:", fetchError);
                }
            }
        };

        incrementCount();

    }, [firestore]);

    return visitorCount;
}
