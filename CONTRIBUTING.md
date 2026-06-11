# Contributing to Ember

Thanks for your interest. Ember is in early development — contributions are welcome but please open an issue before starting significant work.

## Getting started

1. Fork the repo and clone it locally
2. Follow the setup steps in [README.md](README.md)
3. Create a branch: `git checkout -b feat/your-feature`

## What to work on

Check the [issues](https://github.com/yourusername/ember/issues) tab for open tasks. Good first issues are labeled `good first issue`.

Things that are always welcome:
- Bug fixes
- Accessibility improvements
- Performance improvements
- Documentation

Things to discuss first:
- New features
- Changes to the data model
- Changes to the auth flow

## Workflow

1. Make your changes on a feature branch
2. Keep commits focused — one logical change per commit
3. Use conventional commit messages: `feat:`, `fix:`, `chore:`, `docs:`
4. Open a pull request against `main` with a clear description of what and why

## Code style

- TypeScript everywhere — no `any` unless unavoidable
- Use semantic Tailwind tokens (`bg-background`, `text-foreground`) not hardcoded colors
- Keep `page.tsx` files under 100 lines — extract components into `components/`
- Name component files with kebab-case: `calendar-heatmap.tsx`

## Pull requests

- Keep PRs small and focused
- Link the issue your PR closes: `Closes #123`
- Screenshots or a short video for UI changes