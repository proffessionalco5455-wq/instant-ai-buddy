import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import type { Request, Response } from 'express'

dotenv.config()

const app = express()
app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787

// Optional OpenAI client; fallback to mock if no key
let useOpenAI = false as boolean
let openai: any = null
if (process.env.OPENAI_API_KEY) {
  try {
    // Lazy import to keep runtime light if not used
    const OpenAI = (await import('openai')).default
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    useOpenAI = true
  } catch (err) {
    console.warn('OpenAI SDK not available, using mock responses')
    useOpenAI = false
  }
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true })
})

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body as { message?: string }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }

    if (useOpenAI && openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a concise and helpful assistant.' },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
        })
        const text = completion.choices?.[0]?.message?.content?.trim() || 'I could not generate a response.'
        return res.json({ text })
      } catch (apiErr: any) {
        console.warn('OpenAI error, falling back to mock:', apiErr?.message || apiErr)
      }
    }

    // Mock fallback
    let response = 'I understand your request! I am here to help with writing, analysis, translation, brainstorming, and more.'
    const lower = message.toLowerCase()
    if (lower.includes('summarize')) {
      response = "Here's a concise summary:\n\n• Key point 1\n• Key point 2\n• Key point 3"
    } else if (lower.includes('rephrase')) {
      response = "Here's an improved version of your text: Your content has been refined for clarity and impact."
    } else if (lower.includes('translate')) {
      response = 'Translation completed! The text has been accurately translated while preserving tone.'
    } else if (lower.includes('ideas')) {
      response = 'Here are 5 creative ideas: 1) Innovative approach 2) Targeted solution 3) Scalable strategy 4) Creative twist 5) Quick-win.'
    }
    return res.json({ text: response })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal error' })
  }
})

app.post('/api/text', async (req: Request, res: Response) => {
  try {
    const { mode, text, language } = req.body as { mode?: string; text?: string; language?: string }
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required' })
    }
    const modeSafe = (mode || 'summarize') as 'summarize' | 'rephrase' | 'translate' | 'expand'

    if (useOpenAI && openai) {
      const systemContent =
        modeSafe === 'summarize'
          ? 'Summarize the user text in 2-4 bullet points.'
          : modeSafe === 'rephrase'
          ? 'Rewrite the user text to be more professional and clear.'
          : modeSafe === 'translate'
          ? `Translate the user text to ${language || 'English'} while keeping tone.`
          : 'Expand the user text with helpful detail and examples, keep it concise.'

      try {
        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: text },
          ],
          temperature: 0.4,
        })
        const out = completion.choices?.[0]?.message?.content?.trim() || ''
        return res.json({ text: out })
      } catch (apiErr: any) {
        console.warn('OpenAI error, falling back to mock:', apiErr?.message || apiErr)
      }
    }

    // Mock fallback behavior
    let output = ''
    switch (modeSafe) {
      case 'summarize':
        output = `Summary:\n• ${text.substring(0, 80)}...\n• Key insight\n• Next steps`
        break
      case 'rephrase':
        output = `Rephrased: ${text.split(' ').reverse().join(' ')} [polished tone]`
        break
      case 'translate':
        output = `Translated (${language || 'ES'}): ${text}`
        break
      case 'expand':
      default:
        output = `Expanded: ${text} This can be further clarified with examples and context.`
        break
    }
    return res.json({ text: output })
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal error' })
  }
})

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})

