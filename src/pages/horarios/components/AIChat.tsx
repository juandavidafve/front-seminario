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
import { sendMessageStream, type StreamEvent } from "@/services/ai-chat";

import MarkdownContent from "./MarkdownContent";

interface Props {
  id: number;
  updateSchedule: () => Promise<void>;
}

interface Message {
  sender: "user" | "ai";
  content: string;
  status?: string; // Para mostrar estado de las funciones
  isStreaming?: boolean;
}

const initialMessage = "Hola! ¿En qué puedo ayudarte hoy?";

export default function AIChat({ id, updateSchedule }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", content: initialMessage },
  ]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    setInput("");

    // Agregar mensaje del usuario
    const userMsg: Message = { sender: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);

    // Agregar mensaje placeholder para la respuesta de AI
    const aiMsg: Message = {
      sender: "ai",
      content: "",
      status: "Enviando mensaje...",
      isStreaming: true,
    };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      await sendMessageStream(
        id,
        userMessage,
        // onEvent: manejar diferentes tipos de eventos
        (event: StreamEvent) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            const lastMsg = updated[lastIndex];

            switch (event.type) {
              case "status":
              case "function_call":
              case "function_executing":
              case "function_completed":
              case "generating_response":
                // Actualizar estado
                updated[lastIndex] = {
                  ...lastMsg,
                  status: event.message || "",
                };
                break;

              case "response":
                // Respuesta final
                updated[lastIndex] = {
                  ...lastMsg,
                  content: event.content || "",
                  status: undefined,
                  isStreaming: false,
                };
                break;

              case "complete":
                // Completado
                updated[lastIndex] = {
                  ...lastMsg,
                  status: undefined,
                  isStreaming: false,
                };
                break;

              case "error":
                // Error
                updated[lastIndex] = {
                  ...lastMsg,
                  content: `❌ Error: ${event.message}`,
                  status: undefined,
                  isStreaming: false,
                };
                break;
            }

            return updated;
          });
        },
        // onError: manejar errores de conexión
        (error: string) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: `❌ ${error}`,
              status: undefined,
              isStreaming: false,
            };
            return updated;
          });
        },
        updateSchedule,
      );
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: `❌ Error inesperado: ${error}`,
          status: undefined,
          isStreaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
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
              <div className="space-y-3">
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
                      {/* Mostrar estado si está en streaming */}
                      {msg.status && (
                        <p className="mb-1 text-xs italic opacity-70">
                          {msg.status}
                        </p>
                      )}

                      {msg.content && (
                        <MarkdownContent>{msg.content}</MarkdownContent>
                      )}

                      {/* Indicator de carga */}
                      {msg.isStreaming && !msg.content && (
                        <div className="flex items-center gap-1">
                          <div className="animate-pulse">●</div>
                          <div className="animate-pulse delay-75">●</div>
                          <div className="animate-pulse delay-150">●</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="items-start gap-2">
            <Textarea
              className="text-sm"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              disabled={isLoading}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
            />
            <Button onClick={sendMessage} size="icon" disabled={isLoading}>
              <Icon
                icon={
                  isLoading
                    ? "eos-icons:loading"
                    : "material-symbols:send-outline-rounded"
                }
                className="size-6"
              />
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
