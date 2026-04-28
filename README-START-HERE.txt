================================================================================
                        START HERE - SIMPLE INSTRUCTIONS
================================================================================

You need to START the backend server first!

================================================================================
STEP 1: START BACKEND (in Terminal 1)
================================================================================

Double-click this file:
    START-BACKEND-NOW.bat

OR open a terminal and run:
    START-BACKEND-NOW.bat

WAIT FOR:
    ✅ OAuth configured: Client ID loaded (199412317897...)
    Application startup complete

This means the backend is running and OAuth is configured!

KEEP THIS TERMINAL OPEN!

================================================================================
STEP 2: START FRONTEND (in Terminal 2)
================================================================================

Open a NEW terminal and double-click:
    START-FRONTEND-NOW.bat

OR run:
    START-FRONTEND-NOW.bat

WAIT FOR:
    Local: http://localhost:5173/

KEEP THIS TERMINAL OPEN TOO!

================================================================================
STEP 3: TEST OAUTH
================================================================================

Open your browser and go to:
    http://localhost:5173/login

Click "Continue with Google"

You should see Google's consent screen (blue Google page)!

================================================================================
THAT'S IT!
================================================================================

If you see "Failed to fetch", the backend is not running.
Go back to Step 1 and start the backend.

If you see "Missing required parameter: client_id", check the backend terminal.
You should see: ✅ OAuth configured: Client ID loaded

If you don't see that line, there's a problem with the .env file.

================================================================================
QUICK CHECK:
================================================================================

Backend running? Open: http://localhost:8000/docs
Should show API documentation

Frontend running? Open: http://localhost:5173
Should show login page

================================================================================
