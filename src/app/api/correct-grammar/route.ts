import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey:process.env.OPENAI_KEY
});

console.log("key:", process.env.OPENAI_KEY)

export async function POST(req: NextRequest) {
    const { sentence } = await req.json();

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `You are a helpful grammar assistant. Return your response as a JSON object with the keys "corrected", "explanation", and "complexExamples" (which should be an array of two sentences using complex subject-verb agreement rules). Do not include any text outside the JSON.`
            },
            {
                role: 'user',
                content: `Correct this sentence and explain the mistake: "${sentence}"`
            }
        ]
    });

    const raw = chatCompletion.choices[0].message.content || '';

    try {
        const parsed = JSON.parse(raw);
        return NextResponse.json({
            corrected: parsed.corrected?.trim() || '',
            explanation: parsed.explanation?.trim() || '',
            complexExamples: parsed.complexExamples || []
        });
    } catch (e) {
        console.error("❌ Failed to parse GPT response as JSON. Raw content:", raw);
        return NextResponse.json({
            corrected: '',
            explanation: 'Failed to parse response from AI.',
            complexExamples: []
        });
    }
}
