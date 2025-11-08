#\!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║         🚀  CREWLYX QUICK START  🚀                      ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if MongoDB is running
echo "🔍 Checking MongoDB status..."
if mongosh --eval "db.version()" --quiet > /dev/null 2>&1 || mongo --eval "db.version()" --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB is running\!"
    
    # Seed database
    echo ""
    echo "🌱 Seeding database with test users..."
    cd server
    npm run seed
    cd ..
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                                                          ║"
    echo "║            ✅  SETUP COMPLETE\!  ✅                       ║"
    echo "║                                                          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "Terminal 1 - Start Backend:"
    echo "  $ cd server && npm run dev"
    echo ""
    echo "Terminal 2 - Start Frontend:"
    echo "  $ npm run dev"
    echo ""
    echo "Then open: http://localhost:3000"
    echo "Login with: alex@test.com / Test123"
    echo ""
else
    echo "❌ MongoDB is not running\!"
    echo ""
    echo "Please install MongoDB first. Choose one option:"
    echo ""
    echo "Option A - Xcode Bypass (Fastest):"
    echo "  $ sudo mv /Applications/Xcode.app /Applications/Xcode.app.bak"
    echo "  $ brew install mongodb-community"
    echo "  $ brew services start mongodb-community"
    echo "  $ sudo mv /Applications/Xcode.app.bak /Applications/Xcode.app"
    echo ""
    echo "Option B - Cloud MongoDB (Free):"
    echo "  1. Go to: https://www.mongodb.com/cloud/atlas"
    echo "  2. Create free cluster"
    echo "  3. Update server/.env with connection string"
    echo ""
    echo "See COMPLETE_SETUP.md for detailed instructions"
    echo ""
fi

