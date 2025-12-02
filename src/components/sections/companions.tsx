
"use client";

import Image from "next/image";
import Link from "next/link";
import { useData } from "@/lib/data-context";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { Companion } from "@/lib/definitions";
import TextType from "../ui/text-type";

function isValidHttpUrl(string: string | undefined) {
    if (!string || string.length === 0) return false;
    return string.startsWith('http') || string.startsWith('data:image');
}

const CompanionCard = ({ companion }: { companion: Companion }) => {
    const hasValidImage = isValidHttpUrl(companion.imageUrl);

    return (
        <Card className="overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 border-border/20 bg-card/50">
            <div className="relative w-full sm:w-2/5 aspect-square sm:aspect-auto">
                 {hasValidImage ? (
                    <Image
                        src={companion.imageUrl}
                        alt={companion.name}
                        data-ai-hint={companion.imageHint}
                        fill
                        className="object-cover"
                    />
                 ) : (
                     <div className="w-full h-full flex items-center justify-center bg-muted">
                        <p className="text-muted-foreground text-sm">No Image</p>
                    </div>
                 )}
            </div>
            <CardContent className="p-4 sm:p-6 flex flex-col justify-center sm:w-3/5">
                <h3 className="text-lg font-bold text-primary">{companion.name}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{companion.role}</p>
                <p className="text-sm text-muted-foreground mt-2">{companion.description}</p>
                <Link href={companion.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline mt-3 flex items-center gap-1">
                    Visit Profile <ArrowRight className="h-4 w-4" />
                </Link>
            </CardContent>
        </Card>
    );
};


export default function CompanionsSection() {
    const { companions, isDataLoaded } = useData();

    if (!isDataLoaded) {
        return (
            <section id="companions" className="w-full py-8 md:py-12">
                <div className="container px-4 md:px-6">
                    <div className="space-y-3 text-center">
                        <Skeleton className="h-10 w-1/2 mx-auto" />
                        <Skeleton className="h-6 w-1/3 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="companions" className="w-full py-8 md:py-12">
            <div className="container px-4 md:px-6">
                <div className="space-y-3 text-center">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        <TextType as="span" text="My Creative Companions" loop={false} startOnVisible={true} />
                    </h2>
                    <div className="mx-auto w-[100px] h-1.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10 max-w-4xl mx-auto">
                    {companions.length > 0 ? (
                        companions.map((companion) => (
                            <CompanionCard key={companion.id} companion={companion} />
                        ))
                    ) : (
                         <div className="col-span-full w-full h-48 flex items-center justify-center bg-muted rounded-lg border-2 border-dashed">
                            <p className="text-muted-foreground">No companions to display yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
