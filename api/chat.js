const apiKey = process.env.GEMINI_API_KEY;

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    // Mapear historial al formato de Gemini
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = {
      parts: [{
        text: `Eres Nexus AI, el asistente virtual cinéfilo experto y amigable de la plataforma MovieNexus. Tu personalidad es entusiasta, apasionada por el cine, respetuosa y muy conocedora de directores, géneros, actores y datos curiosos. Responde siempre en español.
        
        Usa formato Markdown para estructurar tu respuesta (negritas, listas, saltos de línea para que sea fácil de leer).
        
        Debes responder EXCLUSIVAMENTE con un objeto JSON válido que tenga la siguiente estructura:
        {
          "message": "Tu respuesta en texto Markdown conversando con el usuario, saludando o recomendando películas.",
          "recommendedMovieTitles": ["Título Película 1", "Título Película 2"]
        }
        
        Si recomiendas o mencionas películas específicas que el usuario podría querer ver, incluye sus títulos exactos en el arreglo 'recommendedMovieTitles' (máximo 4 películas). Si no mencionas películas, o solo saludas o conversas en general, el arreglo debe estar vacío: [].
        NO agregues texto fuera del objeto JSON. No uses bloques de código con markdown triple comilla (como \`\`\`json). Devuelve únicamente la estructura JSON directamente.`
      }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(response.status).json({ error: `Gemini API Error: ${errorText}` });
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return res.status(500).json({ error: 'No response text received from Gemini API' });
    }

    // Intentar parsear el JSON recibido
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(candidateText.trim());
    } catch (parseError) {
      console.error('Error parsing Gemini JSON response:', candidateText);
      // Fallback si Gemini devuelve texto plano en vez de JSON
      parsedResponse = {
        message: candidateText,
        recommendedMovieTitles: []
      };
    }

    return res.status(200).json(parsedResponse);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
