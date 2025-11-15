import { OpenAI } from 'openai';
import { StorageDiffResult } from "./state-decoder";

export async function analyzeWithLLM(
    decodedExtrinsic: string,
    sourceCode: string,
    stateChanges: StorageDiffResult
  ) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing OPENAI_API_KEY environment variable. Please set it before running the application.'
      );
    }

    const client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
      });

      const temperature = 0.2;
    //const groq = new Groq({apiKey: process.env.GROQ_API_KEY}); // Pass the API key to the Groq constructor
    const prompt = `
      You are a transaction analyzer for a Polkadot SDK based blockchain. Analyze the following transaction:
      Decoded Extrinsic: ${decodedExtrinsic}
      Source Code: ${sourceCode}
      Old State: ${JSON.stringify(stateChanges.oldState)}
      New State: ${JSON.stringify(stateChanges.newState)}
      
      Your analysis should:
      1. Identify and explain the main action of this transaction in clear, intermediate-level terms
      2. Review all side effects and state changes to identify anything unusual, suspicious, or potentially malicious
      3. Highlight any security concerns or unexpected behaviors that should be flagged
      
      Provide a concise analysis in a maximum of 2 sentences that focuses on understanding what the transaction does and whether it poses any risks.
    `;

    console.log("PROMPT");
    console.log(prompt);

    try {
      const completion = await client.chat.completions.create({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
        response_format: { type: 'json_object' },
        max_tokens: 1000
      });

      console.log(completion);
    
      return (
        completion.choices[0]?.message?.content ||
        "Unable to analyze the transaction"
      );
    } catch (error: any) {
      console.error("Error calling OpenAI/OpenRouter API:");
      console.error("Status:", error?.status);
      console.error("Status Text:", error?.statusText);
      console.error("Message:", error?.message);
      
      if (error?.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
        console.error("Response Body:", JSON.stringify(error.response.data, null, 2));
      }
      
      if (error?.error) {
        console.error("Error Object:", JSON.stringify(error.error, null, 2));
      }
      
      throw new Error(`Failed to analyze transaction: ${error?.message || 'Unknown error'}`);
    }
  }