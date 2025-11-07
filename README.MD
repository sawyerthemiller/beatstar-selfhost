# Beatstar Selfhosted

[Main Project Discord](https://discord.gg/9ST4Qe83bT)

---

### Project Overview

| Item | Description |
|------|-------------|
| Official Server Shutdown | **October 31, 2025** |
| **Purpose** | A mod of the Beatstar private server, make it easier to self-host |
| **Next Planned Update** | When ExternalAddress updates their one |
| **Official Repo Synced** | Yes |

## Setup

1. Clone this repo
2. You must run `chmod +x` on `token.sh` and run it before continue.
3. Run `pnpm run setup` to download dependencies in both the root directory and the `website/beatstar` directory.
4. While in the `website/beatstar` dir, `run pnpm approve-builds` sometimes you will have to do this twice.
5. Start the docker server by and leave it running `docker compose up -d` inside the `website/beatstar` folder.
6. Setup the database by running `pnpm prisma migrate reset`

   If you already have a database that has data for some reason, you can skip docker and just run `npx prisma generate`

## Creating an account

1. First, in the main directory, run `pnpm exec tsx server.ts`
2. In another terminal window or tab, `cd` to `/website/beatstar` and run `pnpm dev --host`
3. Navigate to `your pc ip` on port `5173` and download your profile file
4. Place the downloaded file on your device in `sdcard/beatstar`

### Pointing to a custom instance

This will require the beatclone build from the server

2. Set `serverIp` to the IP of your machine hosting the server in your `settings.json`
3. Set `serverPort` to `3000`
4. Open your modded Beatstar

Once you have tested everything, it should now be safer and more reliable to switch `ENVIRONMENT` in `env` to `prod` and it should also work offline. 

## Updating

To update, just run `git pull` and git will get the latest files for you. You might want to run `pnpm prisma migrate dev` in `website/beatstar` after

IF a seed is changed, i've redone the code to just update the db not replace it. All u need to do is `cd` to `/website/beatstar` and run `npx prisma seed db`

## Quiet Operation Mode

If you want true quiet operation

1. Use `pnpm exec tsx server.ts --quiet`
2. Download [this](https://tinyurl.com/mjs-bs-mod) and replace `beatstar-selfhost/node_modules/dotenv/lib/main.js` file with it
3. If you wish, you can make a script for it like this, and replace the line with your server location

```bash
#!/bin/bash

clear

cd ~/documents/github/beatstar-selfhost || exit
echo "beatstar server started"
pnpm exec tsx server.ts --quiet
```
