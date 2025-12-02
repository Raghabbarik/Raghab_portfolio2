
"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colorPalette } from "@/lib/colors";
import { hexToHslString, hslStringToHex } from "@/lib/colors";
import { Paintbrush } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface ColorPickerProps {
  hslColor: string;
  onChange: (newHsl: string) => void;
}

export function ColorPicker({ hslColor, onChange }: ColorPickerProps) {
  const solid = hslStringToHex(hslColor);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 p-0"
          style={{ backgroundColor: `hsl(${hslColor})` }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Tabs defaultValue="solid" className="w-full">
          <div className="p-4 border-b">
             <TabsList className="w-full">
                <TabsTrigger value="solid" className="flex-1">
                <Paintbrush className="w-4 h-4 mr-2" />
                Solid
                </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="solid" className="p-4">
            <TooltipProvider delayDuration={100}>
              <ScrollArea className="h-60">
                <div className="flex flex-wrap gap-2">
                    {colorPalette.map((color) => (
                    <Tooltip key={color.name}>
                        <TooltipTrigger asChild>
                        <div
                            style={{ background: color.hex }}
                            className="rounded-full h-8 w-8 cursor-pointer active:scale-105 border border-border/20"
                            onClick={() => onChange(hexToHslString(color.hex))}
                        />
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>{color.name}</p>
                        <p className="text-muted-foreground">{color.hex}</p>
                        </TooltipContent>
                    </Tooltip>
                    ))}
                </div>
              </ScrollArea>
            </TooltipProvider>
          </TabsContent>
        </Tabs>
        <div className="p-4 border-t">
          <Input
            id="custom"
            value={solid}
            className="h-8"
            onChange={(e) => onChange(hexToHslString(e.currentTarget.value))}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
