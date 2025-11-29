import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", content: "Hola! ¿En qué puedo ayudarte hoy?" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", content: input };
    const aiMsg = {
      sender: "ai",
      content: "Esta es una respuesta de ejemplo del asistente.",
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="fixed right-4 bottom-4 size-11 rounded-full shadow-lg">
          <Icon
            icon={
              !open ? "mdi:robot-outline" : "material-symbols:close-rounded"
            }
            className="size-6"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={16}
        className="w-sm border-0 bg-transparent p-0 shadow-none"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Card>
          <CardHeader className="text-center text-sm">
            <CardTitle>Asistente de Horarios</CardTitle>
            <CardDescription className="text-xs">
              Genera y organiza tus horarios fácilmente con IA
            </CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-50 px-3">
              {messages.map((msg, i) => (
                <div key={i} className="flex">
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg p-2 text-sm",
                      msg.sender === "user" &&
                        "ml-auto bg-secondary text-secondary-foreground",
                      msg.sender === "ai" &&
                        "bg-primary text-primary-foreground",
                    )}
                  >
                    {msg.content.split("\n").map((line) => (
                      <p className="text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="items-start gap-2">
            <Textarea
              className="text-sm"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
            />
            <Button onClick={sendMessage} size="icon">
              <Icon
                icon="material-symbols:send-outline-rounded"
                className="size-6"
              />
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
