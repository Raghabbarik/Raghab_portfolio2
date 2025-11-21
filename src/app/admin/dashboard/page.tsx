"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutForm } from "@/components/admin/about-form";
import { ContactForm as AdminContactForm } from "@/components/admin/contact-form";
import { ProjectForm } from "@/components/admin/project-form";
import { ServiceForm } from "@/components/admin/service-form";
import { SkillForm } from "@/components/admin/skill-form";
import type {
    About,
    ContactDetail,
    Project,
    Service,
    Skill,
} from "@/lib/definitions";
import { useData } from "@/lib/data-context";
import { PlusCircle, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function ProjectsTab() {
  const { projects, setProjects } = useData();

  const handleSave = (project: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? project : p))
    );
  };

  const handleDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleAdd = () => {
    const newProject: Project = {
      id: `new-project-${Date.now()}`,
      title: "New Project",
      description: "",
      technologies: [],
      imageUrl: "new-project-placeholder",
      imageHint: "new project",
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove projects from your portfolio.
          </p>
        </div>
        <Button size="sm" className="h-8 gap-1" onClick={handleAdd}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Project
          </span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectForm
            key={project.id}
            project={project}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

function SkillsTab() {
  const { skills, setSkills } = useData();

  const handleSave = (skill: Skill) => {
    setSkills((prev) => prev.map((s) => (s.name === skill.name ? skill : s)));
  };

  const handleDelete = (skillName: string) => {
    setSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const handleAdd = () => {
    const newSkill: Skill = {
      name: `New Skill ${skills.length + 1}`,
      level: 50,
      icon: PlusCircle,
    };
    setSkills((prev) => [newSkill, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skills</h2>
          <p className="text-muted-foreground">
            Manage your skills and proficiency levels.
          </p>
        </div>
        <Button size="sm" className="h-8 gap-1" onClick={handleAdd}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Skill
          </span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillForm
            key={skill.name}
            skill={skill}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

function ServicesTab() {
  const { services, setServices } = useData();

  const handleSave = (service: Service) => {
    setServices((prev) =>
      prev.map((s) => (s.title === service.title ? service : s))
    );
  };

  const handleDelete = (serviceTitle: string) => {
    setServices((prev) => prev.filter((s) => s.title !== serviceTitle));
  };

  const handleAdd = () => {
    const newService: Service = {
      title: `New Service ${services.length + 1}`,
      description: "",
      icon: PlusCircle,
    };
    setServices((prev) => [newService, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-muted-foreground">Manage the services you offer.</p>
        </div>
        <Button size="sm" className="h-8 gap-1" onClick={handleAdd}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Service
          </span>
        </Button>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceForm
            key={service.title}
            service={service}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

function AboutTab() {
  const { about, setAbout } = useData();

  const handleSave = (about: About) => {
    setAbout(about);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">About Section</h2>
        <p className="text-muted-foreground">
          Update the content of your about section.
        </p>
      </div>
      <AboutForm about={about} onSave={handleSave} />
    </div>
  );
}

function SettingsTab() {
  const { contactDetails, setContactDetails } = useData();

  const handleSave = (contact: ContactDetail) => {
    setContactDetails((prev) =>
      prev.map((c) => (c.id === contact.id ? contact : c))
    );
  };

  const handleDelete = (contactId: string) => {
    setContactDetails((prev) => prev.filter((c) => c.id !== contactId));
  };

  const handleAdd = () => {
    const newContact: ContactDetail = {
      id: `new-contact-${Date.now()}`,
      iconName: "Mail",
      text: "new.contact@example.com",
      href: "mailto:new.contact@example.com",
    };
    setContactDetails((prev) => [newContact, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Details</h2>
          <p className="text-muted-foreground">
            Manage your contact information.
          </p>
        </div>
        <Button size="sm" className="h-8 gap-1" onClick={handleAdd}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Contact
          </span>
        </Button>
      </div>
      <div className="space-y-4">
        {contactDetails.map((contact) => (
          <AdminContactForm
            key={contact.id}
            contact={contact}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { saveAllData } = useData();

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveAllData();
      toast({
        title: "Success!",
        description: "All your changes have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Could not save changes.",
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Manage your portfolio content here.
          </p>
        </div>
        <Button onClick={handleSaveAll} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <ScrollArea className="w-full">
            <TabsList className="grid w-max grid-flow-col gap-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="projects" className="mt-4">
          <ProjectsTab />
        </TabsContent>
        <TabsContent value="skills" className="mt-4">
          <SkillsTab />
        </TabsContent>
        <TabsContent value="services" className="mt-4">
          <ServicesTab />
        </TabsContent>
        <TabsContent value="about" className="mt-4">
          <AboutTab />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
