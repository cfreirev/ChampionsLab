# Contributing to Champions Lab

Thank you for wanting to help! Champions Lab is a community-driven project and we welcome contributions of all kinds.

---

## 🌍 Translating Champions Lab

We're actively expanding language support. If you'd like to help translate Champions Lab into your language, here's how:

### Translation Files

All translation files are in `src/lib/i18n/`:

```
src/lib/i18n/
├── en.json                      # English (base language)
├── fr.json                      # French
├── abilities.fr.json            # Pokémon abilities (French)
├── items.fr.json                # Items (French)
├── moves.fr.json                # Moves (French)
├── natures.fr.json              # Natures (French)
├── pokemon-names.fr.json        # Pokémon names (French)
├── ability-descriptions.*.json  # Ability descriptions
├── item-descriptions.*.json     # Item descriptions
└── move-descriptions.*.json     # Move descriptions
```

### How to Contribute a Translation

1. **Fork** the [repository](https://github.com/Andrew21P/ChampionsLab)
2. **Copy** the English translation file as a template:
   - `src/lib/i18n/en.json` → `src/lib/i18n/{lang}.json`
   - `src/lib/i18n/pokemon-names.fr.json` → `src/lib/i18n/pokemon-names.{lang}.json`
   - etc. (where `{lang}` is your language code, e.g., `es`, `de`, `ja`, `it`)
3. **Translate** all the keys and values to your language
4. **Update** `src/lib/i18n/index.tsx` to add your language to the language selector
5. **Commit** and **Push** your changes
6. **Open a Pull Request** with your language translation

### Translation Guidelines

- Keep the same **JSON structure** as the English version
- Preserve **variable placeholders** like `{count}`, `{value}`, `{name}` — these are replaced at runtime
- **Don't translate** Pokémon names unless they have an official regional translation
- Use **professional terminology** for battle/competitive terms (Fake Out, Trick Room, etc.)
- Test your translation locally if possible — ensure text fits in UI elements
- If you're unsure about a term, leave a comment in the PR

### Example

**en.json:**
```json
{
  "meta": {
    "wrAbbr": "WR",
    "title": "Meta Analysis",
    "pokemonRanking": "Pokémon Ranking for {season}"
  }
}
```

**es.json (Spanish):**
```json
{
  "meta": {
    "wrAbbr": "TV",
    "title": "Análisis Meta",
    "pokemonRanking": "Clasificación de Pokémon para {season}"
  }
}
```

---

## 🐛 Reporting Bugs & Requesting Features

### Bug Reports
1. Check if the bug has already been reported in [Issues](https://github.com/Andrew21P/ChampionsLab/issues)
2. Open a new Issue with:
   - What you were doing when the bug occurred
   - What happened vs. what you expected
   - Browser/device info
   - Screenshots if helpful

### Feature Requests
1. Open an Issue describing the feature
2. Explain **why** it would be useful
3. Include any mockups or examples if you have them

---

## 💻 Code Contributions

### Getting Started

```bash
# Clone the repo
git clone https://github.com/Andrew21P/ChampionsLab.git
cd ChampionsLab

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Making Changes

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly (run `npm run build` to check for TypeScript errors)
4. Commit with clear messages: `git commit -m "Add X feature"`
5. Push to your fork: `git push origin feature/my-feature`
6. Open a Pull Request from your fork to `main`

### Code Style

- Use **TypeScript** — we aim for 100% type coverage
- Follow the existing code style (2-space indents, semicolons, etc.)
- Use **shadcn/ui** components when building UI
- Keep components small and focused
- Add comments for complex logic

---

## 📝 Commit Messages

Write clear, descriptive commit messages:

```
✨ Add dark mode toggle
🐛 Fix team synergy calculation for weather cores
📖 Update README with API docs
🌍 Add German translation (de.json)
```

---

## 🤝 Community

We hang out on Discord and through GitHub Discussions. If you have questions:

- **GitHub Issues** — for bugs and feature requests
- **GitHub Discussions** — for ideas and general chat
- **Contact Form** — on the website at [championslab.xyz](https://championslab.xyz)

---

## ❤️ What We're Looking For

- **Translations** — Help us reach players worldwide
- **Bug fixes** — Found a typo? A calculation error? PR it!
- **Feature ideas** — New pages, tools, analysis modes
- **Data** — Tournament results, usage statistics
- **Design** — UI/UX improvements, accessibility fixes
- **Documentation** — Better guides, clearer explanations

---

## License

By contributing to Champions Lab, you agree that your contributions will be licensed under the same [MIT License](LICENSE) as the project.

---

Thank you for helping make Champions Lab better. We can't wait to see what you build. 🚀
