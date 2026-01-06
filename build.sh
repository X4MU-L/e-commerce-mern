# Build script for combined deployment
# This builds the React frontend and prepares for production

echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🏗️  Building React frontend..."
npm run build

echo "✅ Build complete! Backend will serve frontend from /frontend/build"
cd ..
