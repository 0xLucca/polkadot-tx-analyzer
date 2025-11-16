## MILESTONE 2 PLAN: Unblind for Polkadot

**Team:** Unblind for Polkadot  
**Track:** [X] SHIP-A-TON [ ] IDEA-TON  
**Date:** _________________

---

## 📍 WHERE WE ARE NOW

**What we built/validated this weekend:**
- Built a REST API that forks Polkadot chain state using Chopsticks
- Implemented transaction decoding and dry-run execution in isolation
- Created LLM-powered analysis that explains what transactions do in human-readable format
- Developed storage diff analysis to track state changes before and after execution

**What's working:**
- Chain forking and transaction simulation infrastructure
- Basic transaction decoding and execution
- LLM integration for generating explanations
- API endpoint for transaction analysis

**What still needs work:**
- Explanation format needs improvement for better clarity and structure
- Missing chain-specific context (token names, decimals, pallet information, source code references)
- Cross-chain interaction analysis using XCM runtime APIs not yet implemented
- Need to enhance analysis with richer metadata from specific chains

**Blockers or hurdles we hit:**
- Performance bottlenecks from remote RPC calls (will need local nodes for production)
- Limited chain-specific metadata in current analysis output

---

## 🚀 WHAT WE'LL SHIP IN 30 DAYS

**Our MVP will do this:**
Unblind for Polkadot will provide comprehensive, human-readable transaction analysis for Polkadot SDK-based chains. It will explain what transactions do with rich context including token names, amounts, pallet information, and source code references. The MVP will also support cross-chain transaction analysis using XCM runtime APIs, making it easy for users to understand complex multi-chain interactions before signing.

### Features We'll Build (3-5 max)

**Week 1-2:**
- Feature: Enhanced explanation format with structured output (actions, tokens, amounts, risks)
- Why it matters: Users need clear, organized information to make informed decisions about transactions
- Who builds it: Luca

**Week 2-3:**
- Feature: Chain-specific metadata enrichment (token names, decimals, pallet docs, source code links)
- Why it matters: Generic explanations lack context - users need to see actual token names, understand pallet behavior, and reference source code
- Who builds it: Felipe

**Week 3-4:**
- Feature: XCM cross-chain transaction simulation and explanation
- Why it matters: Cross-chain interactions are complex and opaque - users need to understand what happens across chains before executing
- Who builds it: Luca

### Mentoring & Expertise We Need

**Areas where we need support:**
- Go-to-market strategy and positioning
- Marketing and user acquisition
- Product-market fit validation
- Community building and outreach

**Specific expertise we're looking for:**
- Marketing strategy for developer tools and blockchain infrastructure
- Go-to-market planning for B2B developer products
- Community engagement and growth strategies

---

## 🎯 WHAT HAPPENS AFTER

**When M2 is done, we plan to...** 
- Launch public beta with wallet integrations (Talisman, SubWallet)
- Expand support to more Polkadot parachains and ecosystem chains
- Build developer SDK for wallets and dApps to integrate transaction analysis
- Implement caching and optimization for production-scale performance

**And 6 months out we see our project achieve:**
- Become the standard transaction analysis tool for Polkadot ecosystem wallets
- Support all major Polkadot parachains with comprehensive metadata
- Enable advanced features like transaction risk scoring and anomaly detection
- Build a thriving community of developers and users who rely on Unblind for transaction clarity 