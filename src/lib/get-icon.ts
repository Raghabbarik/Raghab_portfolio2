import {
  Code,
  PenTool,
  Monitor,
  LayoutTemplate,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  MapPin,
  Palette,
  Server,
  Globe,
  Briefcase,
  GraduationCap,
  PlusCircle,
  LucideIcon
} from "lucide-react";
import type { IconMap } from "./definitions";

const iconMap: IconMap = {
  Code,
  PenTool,
  Monitor,
  LayoutTemplate,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  MapPin,
  Palette,
  Server,
  Globe,
  Briefcase,
  GraduationCap,
  PlusCircle,
};

export const getIcon = (name: string): LucideIcon => {
  return iconMap[name] || Monitor; // Return a default icon
};

export const iconNames = Object.keys(iconMap);
