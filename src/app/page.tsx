'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { incorrectSentences } from '@/app/incorrectSentences';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Home() {
    const [sentence, setSentence] = useState('');
    const [result, setResult] = useState<{
        corrected: string;
        explanation: string;
        complexExamples: string[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRandom = () => {
        const random = incorrectSentences[Math.floor(Math.random() * incorrectSentences.length)];
        setSentence(random.text);
        setResult(null);
    };

    const handleCorrect = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/correct-grammar', {
                method: 'POST',
                body: JSON.stringify({ sentence }),
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error('Error correcting:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 p-4 flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-2xl rounded-2xl p-4 sm:p-6 space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                    Grammar Corrector
                </h1>

                <Input
                    placeholder="Enter incorrect sentence..."
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    className="text-base sm:text-lg py-3 sm:py-5 px-4"
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <Button
                        onClick={handleRandom}
                        variant="secondary"
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        Take Random Sentence
                    </Button>
                    <Button
                        onClick={handleCorrect}
                        disabled={loading}
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Correct'}
                    </Button>
                </div>

                {result && (
                    <CardContent className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
                        <div>
                            <p className="text-base sm:text-lg font-semibold text-green-600">
                                Corrected:
                            </p>
                            <p className="text-gray-700">{result.corrected}</p>
                        </div>
                        <div>
                            <p className="text-base sm:text-lg font-semibold text-blue-600">
                                Explanation:
                            </p>
                            <p className="text-gray-700">{result.explanation}</p>
                        </div>
                        {result.complexExamples && result.complexExamples.length > 0 && (
                            <div>
                                <p className="text-base sm:text-lg font-semibold text-purple-600">
                                    Complex Subject-Verb Examples:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    {result.complexExamples.map((ex, i) => (
                                        <li key={i}>{ex}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </main>
    );
}