import { api } from "@/lib/axios";

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
    const response = await api.post(
      "/api/chat/chat/stream",
      {
        session_id,
        message,
      },
      {
        responseType: "stream",
        adapter: "fetch",
      },
    );

    const reader = response.data
      .pipeThrough(new TextDecoderStream())
      .getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const events: StreamEvent[] = value
        .replace(/^data: /gm, "")
        .split("\n")
        .filter((l: string) => l.length > 0)
        .map((e: string) => JSON.parse(e));

      for (const event of events) {
        onEvent(event);
      }
    }

    onDone();
  } catch (err) {
    if (err instanceof Error) {
      onError(err.message);
    }
  }
}
