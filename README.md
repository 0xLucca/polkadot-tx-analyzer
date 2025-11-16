# Polkadot Transaction Analyzer API

A REST API service that analyzes Polkadot SDK-based blockchain transactions by forking the chain state and using LLM to provide human-readable summaries of transaction actions and potential security risks.

## Features

- **Transaction Analysis**: Decode and analyze Polkadot extrinsic transactions
- **State Forking**: Uses Chopsticks to fork chain state and execute transactions in isolation
- **LLM-Powered Summaries**: Provides human-readable analysis of transaction actions and risks
- **Storage Diff Analysis**: Tracks state changes before and after transaction execution

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- An OpenRouter API key (or OpenAI API key compatible with OpenRouter)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd polkadot-tx-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
touch .env
```

4. Add your environment variables to `.env`:
```env
OPENAI_API_KEY=your_openrouter_api_key_here
```

## Running the API

### Development Mode

Run the API in development mode with hot-reloading:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Usage

### Endpoint

**POST** `/analyze-tx`

Analyzes a Polkadot transaction by forking the chain state and providing an LLM-powered analysis.

### Request Body

```json
{
  "extrinsic": "0x0400008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
  "caller": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "network": "wss://rpc.polkadot.io"
}
```

**Parameters:**
- `extrinsic` (string, required): The hex-encoded extrinsic/call to analyze
- `caller` (string, required): The address of the account executing the transaction
- `network` (string, required): WebSocket RPC endpoint of the Polkadot-SDK based network (e.g., `wss://rpc.polkadot.io`, `wss://rpc.assethub-polkadot.polkadot.io`)

### Response

**Success Response (200 OK):**
```json
{
  "analysis": "You will transfer 100 DOT from Alice to Bob"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to analyze transaction",
  "message": "Error details here"
}
```

### Example Usage

#### Using cURL

```bash
curl -X POST http://localhost:3000/analyze-tx \
  -H "Content-Type: application/json" \
  -d '{
    "extrinsic": "0x0400008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
    "caller": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "network": "wss://rpc.polkadot.io"
  }'
```

#### Using JavaScript/TypeScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/analyze-tx', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    extrinsic: '0x0400008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48',
    caller: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    network: 'wss://rpc.polkadot.io'
  })
});

const result = await response.json();
console.log(result);
```

## How It Works

1. **Transaction Decoding**: The API decodes the hex-encoded extrinsic using Polkadotjs
2. **Chain Forking**: Uses Chopsticks to fork the specified network at the latest block
3. **Dry Run Execution**: Executes the transaction in isolation on the forked chain
4. **State Analysis**: Captures storage changes (old state, new state, and delta)
5. **LLM Analysis**: Sends the decoded transaction, execution outcome, and state changes to an LLM for human-readable analysis
6. **Response**: Returns the analysis in JSON format

## Notes

### Performance Considerations

- **API Response Time**: Each API call currently takes a significant amount of time because it fetches storage data from a remote node. This is the main bottleneck in the current implementation.
- **Production Recommendations**: For production environments local nodes for each supported chain should be run. This will dramatically improve response times by eliminating network latency and reducing dependency on remote RPC endpoints.

### LLM Model Selection

- Analysis quality and response time depend heavily on the LLM model used
- We have found that **Gemini 2.5 Flash** provides the best balance of analysis quality and response time
- The API is currently configured for OpenRouter with Gemini 2.5 Flash
