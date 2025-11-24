# Implementing Digital Consent with OTP, IP, and Timestamp

This guide details how to replace a traditional signature field with a robust digital consent mechanism in a React and Express.js application. The process involves capturing the user's IP address, a timestamp, and verifying their identity via a One-Time Password (OTP) sent to their phone.

## 1. Revising the Consent Text (Frontend UI)

First, update the consent text on your form to reflect the new digital verification process.

### Old Text (To be replaced)

> I have read, understood, and agree to the Genco Supplier Data Terms and Conditions. I certify that I am authorized to provide this information and that all information provided is true, accurate, and complete to the best of my knowledge.
>
> I, the undersigned, declare that the information provided in this supplier and plantation survey form is true, accurate, and complete to the best of my knowledge and belief.
>
> [Signature Field]

### New Suggested Text

> ### Digital Consent and Verification
>
> By checking the box below and completing the verification process, you confirm the following:
>
> 1.  You have read, understood, and agree to the **Genco Supplier Data Terms and Conditions**.
> 2.  You certify that you are authorized to provide this information on behalf of the supplier/plantation.
> 3.  You declare that all information provided is true, accurate, and complete to the best of your knowledge.
>
> Your agreement will be recorded digitally. For verification purposes, we will capture your **IP Address**, the **Date and Time** of submission, and validate your identity by sending a **One-Time Password (OTP)** to the provided phone number. This digital record will serve as your binding confirmation.

Below this text, your form will conditionally render a checkbox, an OTP input, and submit buttons as detailed in the React component section.

## 2. Technical Implementation Overview

The workflow is as follows:
1.  **User fills the form** and agrees to the terms by checking a box.
2.  **User requests an OTP**, which triggers a request to the backend.
3.  **Backend generates an OTP**, saves it to the user's session, and uses an SMS gateway (e.g., Twilio) to send it to the user's phone.
4.  **User enters the OTP** on the frontend.
5.  **User submits the final form** with all data, including the OTP.
6.  **Backend verifies the OTP**, captures the IP address and timestamp, and saves all data, including the consent record, to the database.

---

## 3. Backend Implementation (Express.js)

### Prerequisites

1.  **SMS Gateway:** Sign up for a service like [Twilio](https://www.twilio.com/). You will need your `Account SID`, `Auth Token`, and a Twilio phone number. Store these in a `.env` file.
2.  **Session Management:** Install and configure `express-session` to store the OTP temporarily.
    ```bash
    npm install express-session
    ```

### Step 1: Update Database Schema

Modify your Mongoose (or other ORM) schema to include a `consent` object.

```javascript
// file: models/Supplier.js

const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    // ... all your other supplier fields (supplierName, address, etc.)
    phoneNumber: {
        type: String,
        required: true
    },
    consent: {
        ipAddress: String,
        timestamp: Date,
        verifiedPhoneNumber: String,
        method: {
            type: String,
            default: 'OTP Verification'
        }
    }
}, { timestamps: true }); // Mongoose timestamps add createdAt and updatedAt

module.exports = mongoose.model('Supplier', supplierSchema);