# 🧪 Authentication System - Quick Testing Guide

## Backend Status
✅ Running on `http://localhost:3000`
✅ API endpoints ready
✅ Database connected

---

## Test Case 1: Login with Valid Credentials

**Scenario**: User with verified email logging in

**Steps**:
1. Open `http://localhost:3000/login`
2. Make sure you're on "Login" tab
3. Enter valid email (must be verified)
4. Enter correct password
5. Click "Sign In"

**Expected Result**:
- ✅ Redirects to `/dashboard`
- ✅ Navbar shows user as logged in
- ✅ Form clears
- ✅ Local storage updates

---

## Test Case 2: Login - Invalid Email Format

**Scenario**: User enters email without @ symbol

**Steps**:
1. Open `http://localhost:3000/login`
2. Email: `testemail.com` (missing @)
3. Password: `anypassword`
4. Click "Sign In"

**Expected Result**:
- ✅ Modal shows: "Invalid Email"
- ✅ Does NOT call API
- ✅ User stays on login form

---

## Test Case 3: Login - Empty Fields

**Scenario**: User clicks login without entering credentials

**Steps**:
1. Open `http://localhost:3000/login`
2. Leave email & password empty
3. Click "Sign In"

**Expected Result**:
- ✅ Modal shows: "Missing Credentials"
- ✅ "Please enter both email and password."
- ✅ Does NOT call API

---

## Test Case 4: Login - Wrong Password

**Scenario**: Valid user, but wrong password

**Steps**:
1. Open `http://localhost:3000/login`
2. Email: `user@example.com` (valid user)
3. Password: `wrongpassword123`
4. Click "Sign In"

**Expected Result**:
- ✅ Modal shows: "Login Failed"
- ✅ "Invalid email or password."
- ✅ User stays on login form
- ✅ Can retry

---

## Test Case 5: Login - Unverified Email

**Scenario**: User registered but didn't verify email

**Steps**:
1. Open `http://localhost:3000/login`
2. Email: `unverified@example.com`
3. Password: (correct password)
4. Click "Sign In"

**Expected Result**:
- ✅ Modal shows: "Login Failed"
- ✅ "Please verify your email first. Check your inbox for the verification link."
- ✅ Guides user to check email

---

## Test Case 6: Login - User Not Found

**Scenario**: Email doesn't exist in system

**Steps**:
1. Open `http://localhost:3000/login`
2. Email: `nonexistent@example.com`
3. Password: `anypassword`
4. Click "Sign In"

**Expected Result**:
- ✅ Modal shows: "Login Failed"
- ✅ "No account found with this email. Please register first."
- ✅ Suggests registration

---

## Test Case 7: Signup - Step 1 (Personal Info)

**Scenario**: Fill personal information

**Steps**:
1. Open `http://localhost:3000/login`
2. Click "Register" tab
3. Fill all fields:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `9876543210`
   - Gender: `Male`
   - CA Code: (optional, leave blank)
   - Password: `MyPassword123`
   - Confirm: `MyPassword123`
4. Click "Next (College Details)"

**Expected Result**:
- ✅ Moves to Step 2
- ✅ Stepper shows Step 2 highlighted
- ✅ College Details form appears

---

## Test Case 8: Signup - Weak Password

**Scenario**: User tries to register with password < 6 chars

**Steps**:
1. On signup Step 1
2. Password: `12345` (only 5 chars)
3. Confirm: `12345`
4. Click "Next (College Details)"

**Expected Result**:
- ✅ Modal shows: "Weak Password"
- ✅ "Password must be at least 6 characters long."
- ✅ Stays on Step 1
- ✅ Does NOT call API

---

## Test Case 9: Signup - Invalid Email

**Scenario**: User enters invalid email format

**Steps**:
1. On signup Step 1
2. Email: `invalidemail.com` (missing @)
3. Fill other fields correctly
4. Click "Next (College Details)"

**Expected Result**:
- ✅ Modal shows: "Invalid Email"
- ✅ "Please enter a valid email address."
- ✅ Stays on Step 1

---

## Test Case 10: Signup - Password Mismatch

**Scenario**: Password and Confirm password don't match

**Steps**:
1. On signup Step 1
2. Password: `MyPassword123`
3. Confirm: `Different123`
4. Click "Next (College Details)"

**Expected Result**:
- ✅ Modal shows: "Password Mismatch"
- ✅ "Passwords do not match!"
- ✅ Stays on Step 1

---

## Test Case 11: Signup - Step 2 (College Info)

**Scenario**: Fill college information

**Steps**:
1. Complete Step 1 successfully
2. On Step 2, fill:
   - College Name: `IET Lucknow`
   - Year: `3rd Year`
   - Course: `B.Tech`
   - Accommodation: Select "No"
3. Click "Complete Registration"

**Expected Result**:
- ✅ API call made (show loading)
- ✅ Success modal appears
- ✅ "Registration Successful! Please check your email..."
- ✅ Can click "Go to Login" to switch tabs

---

## Test Case 12: Signup - Duplicate Email

**Scenario**: Try to register with already existing email

**Steps**:
1. On signup Step 1
2. Email: `existing@example.com` (already registered)
3. Fill other fields
4. Continue to Step 2 and submit

**Expected Result**:
- ✅ Modal shows: "Registration Failed"
- ✅ "This email is already registered. Please login instead."
- ✅ Offers helpful guidance
- ✅ HTTP 409 status from API

---

## Test Case 13: Email Verification

**Scenario**: Verify email after registration

**Steps**:
1. Receive verification email
2. Click verification link (should look like):
   `http://localhost:3000/verify-email?token=...`
3. Should show success message

**Expected Result**:
- ✅ Email marked as verified
- ✅ User can now login
- ✅ Getting error before = now success after verification

---

## Test Case 14: Network Error

**Scenario**: Simulate network failure

**Steps**:
1. Open DevTools (F12)
2. Network tab → Throttle to "Offline"
3. Try to login or register
4. See error modal

**Expected Result**:
- ✅ Modal shows: "Network Error"
- ✅ "Connection error. Please check your internet and try again."
- ✅ Clear guidance to user
- ✅ Can retry when network is back

---

## Test Case 15: Form Clearing After Actions

**Scenario**: Verify form data is cleared

**Steps**:
1. Login successfully or signup successfully
2. If login: Check dev console
   ```javascript
   // Should be empty
   document.querySelector('input[placeholder="Enter your email"]').value
   ```
3. If signup: Should reset to Step 1 and empty fields

**Expected Result**:
- ✅ Email field is empty
- ✅ Password field is empty
- ✅ No sensitive data persists

---

## Checklist for All Tests

Run all tests in this order:

**Login Tests**:
- [ ] Test Case 1: Valid credentials
- [ ] Test Case 2: Invalid email format
- [ ] Test Case 3: Empty fields
- [ ] Test Case 4: Wrong password
- [ ] Test Case 5: Unverified email
- [ ] Test Case 6: User not found

**Signup Tests**:
- [ ] Test Case 7: Complete Step 1 & 2
- [ ] Test Case 8: Weak password
- [ ] Test Case 9: Invalid email
- [ ] Test Case 10: Password mismatch
- [ ] Test Case 11: Successful signup
- [ ] Test Case 12: Duplicate email

**General Tests**:
- [ ] Test Case 13: Email verification
- [ ] Test Case 14: Network error
- [ ] Test Case 15: Form clearing

---

## Troubleshooting

### Email not being sent?
- Check SMTP credentials in `.env`
- Check email service is configured
- Check logs in development mode

### Can't verify email?
- Check verification link format
- Make sure NEXTAUTH_URL matches
- Check database for emailVerificationToken

### Still seeing old errors?
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Clear localStorage
- Check network tab for actual API responses

### Login keeps failing?
- Verify email is verified first
- Check password is correct
- Try exact error message in tests above
- Check network tab → Response tab

---

## Expected API Response Times

- **Email validation**: < 100ms (client-side)
- **Password validation**: < 100ms (client-side)
- **Login API call**: 200-500ms
- **Signup API call**: 300-800ms (includes email send)
- **Email send**: 1-2 seconds

If times are longer, check network throttling or server load.

---

## Success Indicators

After fixes, you should see:

✅ Specific, helpful error messages
✅ Form validation before API calls
✅ Clear guidance on what to do
✅ No silent failures
✅ Proper HTTP status codes
✅ Forms clear after success
✅ User-friendly experience

🎉 **All Tests Pass = Authentication System Ready!**

