import { skills } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SkillsSection() {
  return (
    <section id="skills" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              My Skills
            </h2>
            <div className="mx-auto w-[100px] h-1.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full" />
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
          {skills.map((skill) => (
            <Card
              key={skill.name}
              className="group transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl hover:-translate-y-2 p-6"
            >
              <CardHeader className="p-0 flex flex-row items-center gap-4 space-y-0">
                  <skill.icon className="w-8 h-8 text-primary" />
                <CardTitle className="text-lg font-semibold">{skill.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-4 space-y-2">
                <Progress value={skill.level} className="h-2" />
                <p className="text-right text-sm text-muted-foreground">
                  {skill.level}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
