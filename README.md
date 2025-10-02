<h1 align="center">Project Nova</h1>

<p align="center">
  <strong>An AI Powered Trust & Safety Gateway to Combat Digital Misinformation.</strong>
</p>

<p align="center">
    <a href="URL_TO_LIVE_DEMO_WHEN_READY"><strong>Live Demo</strong></a>
    ·
    <a href="#-the-mission-combating-misinformation"><strong>Mission</strong></a>
    ·
    <a href="#-key-features"><strong>Features</strong></a>
    ·
    <a href="#-architecture-deep-dive"><strong>Architecture</strong></a>
</p>

<p align="center">
  <!-- BADGES: Replace placeholders with your actual GitHub username and repo name -->
  <img src="https://img.shields.io/badge/Project%20Status-V3%20Complete-brightgreen" alt="Project Status"/>
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License"/>
  <img src="https://img.shields.io/github/last-commit/RamaPranav01/Nova" alt="Last Commit"/>
  <img src="https://img.shields.io/github/stars/RamaPranav01/Nova?style=social" alt="GitHub Stars"/>
</p>

---

## 💡 The Mission: Combating Misinformation

Built for the **Google Gen AI Exchange Hackathon**, Project Nova tackles the rapid spread of fake news, scams, and synthetic media. Existing solutions are too narrow simple fact checkers are not enough. A true solution must be holistic.

Nova is an enterprise grade gateway that provides a **complete, defense in depth Trust & Safety layer** for any AI application. We go beyond fact checking to address the entire ecosystem of misinformation by **securing the AI, verifying the source, detecting synthetic media, and educating the user.** Our mission is to build the essential infrastructure for a safer, more critically informed digital society.

## ✨ Key Features

Nova is built on a sophisticated, phased roadmap. Our submitted prototype is a feature-complete V3, and our vision extends to V6.

| Category                      | Feature                                   | Status      | Description                                                                                                     |
| ----------------------------- | ----------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| 🌐 **Misinformation Defense** | **Real-Time Rumor Verifier**              | ✅ Done     | Uses the Google Search API to cross-reference claims against live news and events.                                |
|                               | **Source Reputation Critic**              | ✅ Done     | Analyzes the credibility of any cited URL to flag known propaganda or low-trust sources.                           |
|                               | **Synthetic Media (Deepfake) Detection**  | ✅ Done     | Integrates specialized services to detect AI-generated images and audio.                                        |
|                               | **Generative Educational Content**        | ✅ Done     | Provides clear, AI-powered explanations to educate users on *why* content was flagged.                            |
| 🛡️ **Foundational Security**  | **Prompt Injection Defense ("Cerberus")** | 🗺️ Roadmap    | Our proprietary, custom trained Deep Learning model for detecting the #1 LLM vulnerability.                   |
|                               | **Immutable, Tamper-Proof Audit Logs**    | ✅ Done     | Creates a cryptographically-chained log of every transaction for complete, verifiable compliance.              |
|                               | **PII & Sensitive Data Leak Prevention**  | ✅ Done     | High-speed algorithmic filters to protect user privacy and company IP.                                          |
| ⚙️ **Platform & Governance**  | **Analytics Dashboard**                   | ✅ Done     | Provides rich visualizations of detected threats, operational metrics, and performance.                           |
|                               | **Custom Policy Engine**                  | ✅ Done     | Enforces user-defined, natural language rules for content and behavior.                                       |
| 🚀 **Proactive Intelligence (Finals Roadmap)** | **Knowledge Base Auto-Sync** | 🗺️ Roadmap  | Integrates with Notion/Google Drive to keep the RAG knowledge base perpetually up-to-date.                     |
|                               | **Automated Policy Suggestions**          | 🗺️ Roadmap  | An "AI Consultant" agent that analyzes logs and proactively suggests new policies to administrators.             |
|                               | **User Behavior Analysis**                  | 🗺️ Roadmap  | Detects anomalous user activity (e.g., coordinated attacks) to identify compromised accounts or malicious actors. |
| 🤖 **Autonomous Platform (Finals Roadmap)** | **Autonomous Threat Response** | 🗺️ Roadmap  | A self healing defense that can autonomously identify and neutralize novel attack campaigns without human intervention. |
|                               | **AI-Powered Root Cause Analysis**        | 🗺️ Roadmap  | An "AI Analyst" that generates in depth reports explaining the root cause of complex system failures.            |
|                               | **The "Attack Simulation Chamber"**       | 🗺️ Roadmap  | An interactive Red Team tool built into the dashboard to constantly pressure-test the platform's defenses. |

**Timeline:** V1-V3 (Prototype Submission) ✅, V4-V6 (Finals Roadmap) 🗺️

## 🏛️ Architecture Deep-Dive: The Tiered Defense

Nova operates on a hybrid, tiered defense architecture designed for the perfect balance of speed, privacy, and intelligence.

<p align="center">
  <img src="./assets/nova-architecture-diagram.png" alt="Project Nova Architecture Diagram" width="800"/>
</p>

1.  **Tier 1: The "Edge" (Algorithmic Filters):** An incoming request is first scanned by high-speed, deterministic algorithms for PII, sensitive keywords, and Denial of Service patterns.
2.  **Tier 2: The "Sentinels" (Specialized DL Models):** The request is then passed to a library of fast, locally-hosted Deep Learning models. This includes our proprietary **"Cerberus"** classifier for prompt injection and pre-trained models for toxicity and malicious code.
3.  **Tier 3: The "Oracle" (Google Gemini Pro):** Only the most complex or ambiguous requests are escalated to our deep reasoning layer, powered by Google Gemini. This layer handles nuance, fact-checking, and content generation, ensuring the highest level of intelligence is used efficiently. The entire transaction is then recorded in our **Immutable Log**.

## 🛠️ Tech Stack

This project showcases the power and versatility of the Google ecosystem.

**AI Platform:**
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E44AD?logo=google)

**Backend:**
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Cloud_SQL-PostgreSQL-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-24-2496ED?logo=docker)

**Frontend:**
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss)

## 🚀 Local Development

<details>
<summary><strong>Click to expand for setup instructions</strong></summary>



</details>

## 🤝 Contributing

This project is being built for the **Google Gen AI Exchange Hackathon**. We are passionate about building a safer AI ecosystem.

## ⚖️ License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  A project by Rama Pranav, Sanjana, Tejsai, Shlok and Pradyun. If you like our work, please ⭐ this repository!
</p>
