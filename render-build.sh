set -o errexit

npm install
npm run build
npx prism generate
npx prisma migrate deploy
