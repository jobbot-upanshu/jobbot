const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function isJobRelevant(job, profile) {
  const prompt = `
Candidate Profile:
${profile}

Job Information:
Title: ${job.title}
Company: ${job.company}

Is this job a good match for the candidate?
Answer strictly with YES or NO.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  return response.choices[0].message.content.trim() === "YES";
}

module.exports = isJobRelevant;
