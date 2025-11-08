# ⚡ CrewlyX - Simple 2-Step Start

## Step 1: Run This Command

```bash
./verify-and-start.sh
```

That's it! The script will:

- ✅ Check MongoDB is running
- ✅ Seed the database if needed
- ✅ Test the backend API
- ✅ Verify login works
- ✅ Start both servers

## Step 2: Open Your Browser

Go to: **http://localhost:3000**

Login with:

- **Email:** alex@test.com
- **Password:** Test123

---

## ⚠️ If Script Fails

### "command not found: ./verify-and-start.sh"

```bash
chmod +x verify-and-start.sh
./verify-and-start.sh
```

### MongoDB Error

```bash
brew services start mongodb-community
```

### Still Not Working?

```bash
# Manual start:

# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Then go to http://localhost:3000

---

## 🛑 To Stop

```bash
./stop-dev.sh
```

---

## 📝 That's All!

The verification script tests everything automatically and tells you exactly what's wrong if
something fails.

**No more debugging needed!** 🎉
