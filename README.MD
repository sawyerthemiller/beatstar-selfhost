# Beatstar Selfhosted

Main project discord: https://discord.gg/9ST4Qe83bT

A private server for Beatstar which is shutting down on October 31st 2025. This version has been modified for players who wish to selfhost it.

## Setup

1. Clone this repo
2. You must run chmod +x on token.sh and run it before continue
3. Run `pnpm run setup` to download dependencies in both the root directory and the `website/beatstar` directory.
4. While in the `website/beatstar` dir, `run pnpm approve-builds` sometimes it will require twice.
5. Start the docker server by and leave it running `docker compose up -d` inside the `website/beatstar` folder
6. Setup the database by running `pnpm prisma migrate reset`

   If you already have a database that has data for some reason, just run `npx prisma generate`

## Creating an account

1. First, in the main directory, run `pnpm exec tsx server.ts`
2. In another terminal window or tab, cd to `/website/beatstar` and run `pnpm dev --host`
3. Navigate to http://localhost:5173/profile and download your profile file
4. Place the downloaded file on your device in `sdcard/beatstar`

### Pointing to a custom instance

This will require the beatclone build from the server

2. Set `serverIp` to the IP of your machine hosting the server
3. Set `serverPort` to `3000`
4. Open your modded Beatstar

