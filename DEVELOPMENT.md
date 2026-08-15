# Development Guide

## Prerequisites

### Required
- Node.js 22.x.x ([install via nvm](https://github.com/nvm-sh/nvm))
- npm 10.x.x or higher

### Platform-specific notes

#### macOS
- File watching works out of the box via FSEvents
- No additional configuration needed

#### Linux
- File watching uses inotify (built into kernel)
- If you see "too many open files" errors:
  ```bash
  # Increase inotify watchers limit
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

#### Windows
- File watching uses native Windows API
- Make sure to run terminal as Administrator if you encounter permission issues

## Setup

```bash
# 1. Install Node.js 22
# Option A: Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
nvm alias default 22

# Option B: On macOS with Homebrew
brew install node@22
brew link node@22

# Verify version
node --version  # Should show v22.x.x
npm --version   # Should show v10.x.x or higher

# 2. Install dependencies (use 'ci' not 'install'!)
npm ci

# 3. Copy environment file
cp .env.local.example .env.local  # if exists

# 4. Start development server
npm run dev
```

## Common Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Run tests once
npm run lint     # Lint code
```

## Hot Module Replacement (HMR)

The dev server automatically reloads when you save files. This works differently on each platform:

- **Linux**: Uses inotify API
- **macOS**: Uses FSEvents API  
- **Windows**: Uses ReadDirectoryChangesW API

All are handled automatically by Vite - no configuration needed!

## Troubleshooting

### Hot reload not working?

1. Check if dev server is running
2. Check browser console for errors
3. Try restarting the dev server
4. On Linux: Check inotify limits (see above)

### "Cannot find module" errors?

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm ci
```

### Different behavior between developers?

Make sure everyone is using:
- Same Node.js version (check with `node --version`)
- `npm ci` instead of `npm install`
- Latest code from git (with updated package-lock.json)
