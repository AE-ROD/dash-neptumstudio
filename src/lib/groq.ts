import Groq from 'groq-sdk'

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export type TipoCaptura = 'IDEA' | 'TAREA' | 'CLIENTE' | 'MEJORA'

export async function clasificarCaptura(texto: string): Promise<TipoCaptura> {
  try {
    const respuesta = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Clasificá el siguiente texto en una de estas categorías: IDEA, TAREA, CLIENTE, MEJORA.
Responde SOLO con la categoría, sin explicación.`,
        },
        { role: 'user', content: texto },
      ],
      max_tokens: 10,
    })
    const clasificacion = respuesta.choices[0]?.message?.content?.trim().toUpperCase()
    const tipos: TipoCaptura[] = ['IDEA', 'TAREA', 'CLIENTE', 'MEJORA']
    return tipos.includes(clasificacion as TipoCaptura) ? (clasificacion as TipoCaptura) : 'IDEA'
  } catch (error) {
    console.warn('[groq] clasificarCaptura falló, usando fallback IDEA:', error)
    return 'IDEA'
  }
}
