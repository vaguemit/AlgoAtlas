# CodeAtlas 🚀

A competitive programming training platform (currently in development) designed to help you train for Codeforces with themed contests, AI assistance, and curated problem sets.

## Project Status 🏗️

CodeAtlas is currently under active development. Many features are being built and refined. We welcome developers who'd like to contribute to this project!

## Planned Features ✨

### Smart Training Assistant
- Personalized problem recommendations using locally hosted AI
- Real-time hints and explanations from fine-tuned models
- Progress tracking and performance analytics
- Custom training paths tailored to your goals

### Themed Contests
- Themed competitions focusing on specific algorithms and techniques
- Virtual contests using past Codeforces problems
- Custom contest creation for practice

### Problem Repository
- Carefully curated collection of Codeforces problems
- Advanced filtering by topic, difficulty, and contest source
- User-contributed editorials and approaches

### Learning Resources
- Comprehensive guides for common algorithms and data structures
- Video tutorials and interactive lessons
- Code templates and example implementations
- Tips and tricks from experienced competitive programmers

## Tech Stack 🛠️

- Frontend: 
  - Next.js
  - Tailwind CSS
  - Modern UI components
  - Shadcn UI
- Backend: 
  - Supabase for database and authentication
  - Edge Functions for serverless computing
- AI Integration: 
  - Locally hosted fine-tuned models
  - Custom training pipeline for competitive programming data

## Contributing 🤝

We're excited to welcome contributors to help build CodeTlas! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Local Development 💻

```bash
# Clone the repository
git clone https://github.com/yourusername/codetlas.git

# Install dependencies
cd codetlas
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials and model paths to .env

# Start development server
npm run dev

# Download and set up the AI models (separate script)
npm run setup-models
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MODEL_PATH=path_to_your_finetuned_model
```

## Roadmap 🗺️

1. Phase 1: Core Features
   - User authentication with Supabase
   - Problem repository setup
   - Initial UI implementation

2. Phase 2: Contest System
   - Themed contest creation
   - Virtual contest support
   - Leaderboard implementation

3. Phase 3: AI Assistant
   - Model fine-tuning on competitive programming data
   - Local model deployment and optimization
   - Integration of AI features:
     - Problem recommendations
     - Hint generation
     - Solution analysis
     - Performance prediction

## AI Model Development 🤖

The AI capabilities in CodeTlas are powered by locally hosted models fine-tuned specifically for competitive programming tasks. Key aspects include:

- Custom training data from competitive programming solutions and editorials
- Fine-tuning pipeline optimized for coding assistance
- Local deployment for better privacy and control
- Continuous model improvements based on user interactions

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

- GitHub Issues: Feel free to create issues for bugs, feature requests, or questions
- GitHub Discussions: Join our discussions for longer conversations and ideas

## Acknowledgments 🙏

- Thanks to Codeforces for providing the competitive programming platform
- Thanks to Supabase for the backend infrastructure
- Inspired by the competitive programming community's need for structured training

---

Made with ❤️ by competitive programmers, for competitive programmers
