
'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Threads = dynamic(() => import('@/components/threads-background'), {
  ssr: false,
});

export default function GlobalBackground() {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-0">
            <Suspense fallback={<div className="w-full h-full bg-background" />}>
            <Threads 
                color={[0.4, 0.2, 0.8]} 
                amplitude={0.5}
                distance={0.1}
                enableMouseInteraction={true} 
            />
            </Suspense>
        </div>
    );
}
