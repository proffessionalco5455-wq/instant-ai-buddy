export type ChatResponse = { text: string }
export type TextResponse = { text: string }

export async function postJSON<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(await res.text())
  }
  return res.json() as Promise<TResponse>
}

export async function chat(message: string): Promise<ChatResponse> {
  return postJSON<ChatResponse>('/api/chat', { message })
}

export async function processText(mode: 'summarize' | 'rephrase' | 'translate' | 'expand', text: string, language?: string): Promise<TextResponse> {
  return postJSON<TextResponse>('/api/text', { mode, text, language })
}

