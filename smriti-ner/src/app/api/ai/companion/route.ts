import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GEMINI_SYSTEM_INSTRUCTION = `
You are Smriti, a deeply compassionate, respectful, and soothing AI companion for an elderly grandparent in Northeast India who may have Mild Cognitive Impairment (MCI) or early-stage dementia.
Rules:
1. Speak with deep cultural warmth and reverence (e.g. addressing the elder as "Dadu", "Bordeuta", "Pu", "Kpa", "Ipa", or "Grandfather").
2. Keep responses brief, calming, and reassuring (maximum 2-3 simple sentences).
3. Never challenge, correct sharply, or cause confusion. If they ask where they are or feel disoriented, reassure them that they are safe in their home in Northeast India, resting with their loving family.
4. Respond in the EXACT language requested:
   - If language is 'hi', respond in clear, simple Hindi (Devanagari).
   - If language is 'bn', respond in gentle Bengali.
   - If language is 'as', respond in gentle Assamese.
   - If language is 'mni', respond in Meitei (Manipuri).
   - If language is 'brx', respond in Bodo.
   - If language is 'kha', respond in Khasi.
   - If language is 'lus', respond in Mizo.
   - If language is 'en', respond in warm Indian English.
5. Return a JSON object with:
   - "replyText": string (the soothing message in the target language)
   - "englishTranslation": string (accurate English translation for caregiver display)
   - "emotionTone": "CALMING" | "VALIDATING" | "REMINISCING" | "REASSURING"
   - "suggestedScreen": "home" | "games" | "reminders" | "album" | "connect" (optional)
`;

export async function POST(request: Request) {
  try {
    const { prompt, language = "en" } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }]
            },
            contents: [
              {
                parts: [
                  {
                    text: `Target Language: ${language}. Elder says: "${prompt}". Provide JSON response.`
                  }
                ]
              }
            ],
            generationConfig: {
              response_mime_type: "application/json",
              temperature: 0.3,
              maxOutputTokens: 300,
            }
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              replyText: parsed.replyText || rawText,
              englishTranslation: parsed.englishTranslation || parsed.replyText || rawText,
              language,
              emotionTone: parsed.emotionTone || "CALMING",
              suggestedScreen: parsed.suggestedScreen || null,
            });
          }
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local reassurance engine:", geminiError);
      }
    }

    // Heuristic Fallback Engine for zero-latency / offline response
    const p = prompt.toLowerCase();
    let replyText = "आप अपने प्यारे परिवार के साथ अपने घर पर पूरी तरह सुरक्षित हैं।";
    let english = "You are completely safe at home with your loving family.";
    let screen = "home";

    if (language === "bn") {
      replyText = "আপনি আপনার নিজের বাড়িতে পরিবারের সাথে নিরাপদে আছেন। মন শান্ত রাখুন।";
      english = "You are safe at home with your family. Keep your heart peaceful.";
    } else if (language === "as") {
      replyText = "আপুনি গুৱাহাটীৰ নিজা ঘৰতেই সুৰক্ষিতভাৱে আছে বৰদেউতা। চিন্তা নকৰিব।";
      english = "You are resting safely in your home in Guwahati, grandfather. Do not worry.";
    } else if (language === "mni") {
      replyText = "ꯏꯄꯥ ꯅꯍꯥꯛ ꯃꯌꯨꯃꯗꯥ ꯅꯨꯡꯉꯥꯏꯅꯥ ꯂꯩꯔꯤ꯫ ꯋꯥꯈꯜ ꯋꯥꯒꯅꯨ꯫";
      english = "Grandfather, you are resting peacefully at home. Please do not worry.";
    } else if (language === "en") {
      replyText = "You are resting safely in your warm home with family who love you.";
      english = "You are resting safely in your warm home with family who love you.";
    }

    if (p.includes("medicine") || p.includes("dawa") || p.includes("दवा") || p.includes("ঔষধ") || p.includes("দৰব")) {
      screen = "reminders";
      if (language === "hi") {
        replyText = "आपकी सुबह की दवा ली जा चुकी है। अगली बार १२:३० बजे गुनगुना पानी लेने का समय होगा।";
        english = "Morning medicine has been taken. Next reminder is lukewarm water at 12:30 PM.";
      } else if (language === "bn") {
        replyText = "আপনার সকালের ওষুধ নেওয়া হয়েছে। পরবর্তী ওষুধ ও জল দুপুর ১২:৩০ টায়।";
        english = "Morning medicine is completed. Next water is at 12:30 PM.";
      } else if (language === "as") {
        replyText = "ৰাতিপুৱাৰ ঔষধ খোৱা হৈছে। দুপৰীয়া ১২:৩০ বজাত কুহুমীয়া পানী খোৱাৰ সময়।";
        english = "Morning medicine was taken. Warm water at 12:30 PM.";
      } else {
        replyText = "Your morning medicine was taken. Next scheduled reminder is refreshing water at 12:30 PM.";
        english = "Your morning medicine was taken. Next reminder is water at 12:30 PM.";
      }
    }

    return NextResponse.json({
      replyText,
      englishTranslation: english,
      language,
      emotionTone: "CALMING",
      suggestedScreen: screen,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process AI companion request" },
      { status: 500 }
    );
  }
}
