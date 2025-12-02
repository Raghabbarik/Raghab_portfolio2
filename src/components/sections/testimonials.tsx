
"use client";

import Image from "next/image";
import { useData } from "@/lib/data-context";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import TextType from "../ui/text-type";
import type { Testimonial } from "@/lib/definitions";
import { Quote } from "lucide-react";

function isValidHttpUrl(string: string | undefined) {
    if (!string || string.length === 0) return false;
    return string.startsWith('http') || string.startsWith('data:image');
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const hasValidImage = isValidHttpUrl(testimonial.imageUrl);

    return (
        <Card className="overflow-hidden flex flex-col items-center text-center p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 border-border/20 bg-card/50">
            {hasValidImage && (
                <div className="relative w-24 h-24 mb-4">
                    <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        data-ai-hint={testimonial.imageHint}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
            )}
            <CardContent className="p-0">
                <Quote className="w-8 h-8 text-primary/50 mx-auto mb-4" />
                <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                <h3 className="text-lg font-bold text-foreground">{testimonial.name}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{testimonial.role}</p>
            </CardContent>
        </Card>
    );
};


export default function TestimonialsSection() {
    const { testimonials, isDataLoaded } = useData();

    if (!isDataLoaded) {
        return (
            <section id="testimonials" className="w-full py-12 md:py-16 bg-card">
                <div className="container px-4 md:px-6">
                    <div className="space-y-3 text-center">
                        <Skeleton className="h-10 w-1/2 mx-auto" />
                        <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="testimonials" className="w-full py-12 md:py-16 bg-card">
            <div className="container px-4 md:px-6">
                <div className="space-y-3 text-center">
                     <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl min-h-[48px] md:min-h-[60px]">
                        <TextType
                            text="What My Clients Say"
                            typingSpeed={50}
                            deletingSpeed={25}
                            pauseDuration={4000}
                            loop={false}
                            startOnVisible={true}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
                            cursorClassName="text-primary"
                        />
                    </h2>
                    <div className="mx-auto w-[100px] h-1.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full" />
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
                        Here's what people I've worked with have to say about my work.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 max-w-4xl mx-auto">
                    {testimonials.length > 0 ? (
                        testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))
                    ) : (
                         <div className="col-span-full w-full h-48 flex items-center justify-center bg-muted rounded-lg border-2 border-dashed">
                            <p className="text-muted-foreground">No testimonials to display yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
