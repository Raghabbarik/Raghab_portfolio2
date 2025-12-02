
"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { solidColors } from "@/lib/colors";
import { hexToHslString, hslStringToHex } from "@/lib/colors";
import { Paintbrush } from "lucide-react";

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
      <PopoverContent className="w-64">
        <Tabs defaultValue="solid" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="solid" className="flex-1">
              <Paintbrush className="w-4 h-4 mr-2" />
              Solid
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solidColors.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => onChange(hexToHslString(s))}
              />
            ))}
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={solid}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => onChange(hexToHslString(e.currentTarget.value))}
        />
      </PopoverContent>
    </Popover>
  );
}
