"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { projects as initialProjects } from "@/lib/data";
import { ProjectForm } from "@/components/admin/project-form";
import type { Project } from "@/lib/definitions";

function ProjectsTab() {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    
    // In a real app, you would have API calls to update the backend
    const handleSave = (project: Project) => {
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
        console.log("Saving project:", project);
    }
    
    const handleDelete = (projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        console.log("Deleting project:", projectId);
    }
    
    const handleAdd = () => {
        const newProject: Project = {
            id: `new-project-${Date.now()}`,
            title: "New Project",
            description: "",
            technologies: [],
            imageUrl: "new-project-placeholder",
            imageHint: "new project"
        };
        setProjects(prev => [...prev, newProject]);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <p className="text-muted-foreground">Add, edit, or remove projects from your portfolio.</p>
                </div>
                 <Button size="sm" className="h-8 gap-1" onClick={handleAdd}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Project
                    </span>
                </Button>
            </div>

            {projects.map(project => (
                <ProjectForm 
                    key={project.id} 
                    project={project} 
                    onSave={handleSave} 
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
}

function ComingSoonTab({ title }: { title: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    This section is under construction. Soon you'll be able to manage your {title.toLowerCase()} here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Coming Soon!</p>
                </div>
            </CardContent>
        </Card>
    )
}


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground md:text-xl/relaxed">
          Manage your portfolio content here.
        </p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-4">
            <ProjectsTab />
        </TabsContent>
        <TabsContent value="skills" className="mt-4">
            <ComingSoonTab title="Skills" />
        </TabsContent>
        <TabsContent value="services" className="mt-4">
            <ComingSoonTab title="Services" />
        </TabsContent>
        <TabsContent value="about" className="mt-4">
            <ComingSoonTab title="About" />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
            <ComingSoonTab title="Settings" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
