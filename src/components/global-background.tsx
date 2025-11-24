
'use client';

import dynamic from 'next/dynamic';

const Threads = dynamic(() => import('@/components/threads-background'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full bg-background" />,
});

export default function GlobalBackground() {
    return (
        <div className="absolute inset-0 w-full h-full bg-background z-0 opacity-20 pointer-events-none">
            <Threads
              color={[1, 1, 1]}
              amplitude={0.5}
              distance={0.2}
              enableMouseInteraction
            />
        </div>
    );
}
