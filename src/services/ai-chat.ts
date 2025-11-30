import { api } from "@/lib/axios";
import { BACKEND_BASE_URL } from "@/lib/config";
import { auth } from "@/lib/firebase";
import type { MessageResponse } from "@/types/Chat";

// Helper function para obtener headers con JWT
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const user = auth.currentUser;
  if (user) {
    const accessToken = await user.getIdToken();
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function sendMessageAI(
  session_id: number,
  message: string,
): Promise<MessageResponse> {
  const response = await api.post("api/chat/chat/message", {
    session_id,
    message,
  });
  return response.data;
}

export interface StreamEvent {
  type:
    | "status"
    | "function_call"
    | "function_executing"
    | "function_completed"
    | "generating_response"
    | "response"
    | "complete"
    | "error";
  message?: string;
  content?: string;
  function_name?: string;
}

export async function sendMessageStream(
  session_id: number,
  message: string,
  onEvent: (event: StreamEvent) => void,
  onError: (error: string) => void,
  onDone: () => Promise<void>,
) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BACKEND_BASE_URL}api/chat/chat/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session_id,
        message,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        onError("No autorizado. Por favor inicia sesión nuevamente.");
        return;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // ...rest of the streaming code remains the same...

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataContent = line.slice(6);
          if (dataContent.trim() === "") continue;

          try {
            const eventData: StreamEvent = JSON.parse(dataContent);
            onEvent(eventData);
            if (eventData.type === "complete" || eventData.type === "error") {
              break;
            }
          } catch (parseError) {
            console.warn("Error parsing JSON:", dataContent, parseError);
          }
        }
      }
    }

    if (buffer.trim() && buffer.startsWith("data: ")) {
      const dataContent = buffer.slice(6);
      try {
        const eventData: StreamEvent = JSON.parse(dataContent);
        onEvent(eventData);
      } catch (parseError) {
        console.warn("Error parsing final buffer:", dataContent, parseError);
      }
    }

    onDone();
  } catch (error) {
    console.error("Error streaming:", error);
    onError(
      `Error de conexión: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
