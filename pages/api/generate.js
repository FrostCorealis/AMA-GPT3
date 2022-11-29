import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
    Write me a detailed table of contents with the title below. Please make sure the table of contents goes in-depth on the topic and shows that the writer did their research.

    Title: 
  `;
const generateAction = async (req, res) => {
  // first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.8,
    max_tokens: 1755,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // second prompt
  const secondPrompt =
  `
  Take the table of contents and title of the article below and generate an articlee written in thwe style of Judith Orloff. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  Article:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.89,
    max_tokens: 1900,
  });
  
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
