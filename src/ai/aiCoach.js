/**
 * AI Coach — GPT-4o integration
 * Requires VITE_AI_API_KEY in .env
 */

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export async function getCoachResponse(errorType, query, problem, resultSummary = '') {
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  if (!apiKey) return null;

  const storyText = stripHtml(problem.story || '');

  const prompt = `You are an SQL tutor helping a beginner learner on a platform called badcode.

The learner is working on this problem:
"${problem.title}"

Problem description: "${storyText}"

The learner wrote this query:
"${query}"

The query result was: ${resultSummary || 'no result'}
The expected output requires: ${problem.requiredConcept}

Give a short, encouraging hint (2-3 sentences max). Do not give them the full answer.
Point out what's wrong and nudge them in the right direction.
Use plain language suitable for a beginner.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}
