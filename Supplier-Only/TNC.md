Of course. This is the perfect way to hand off content to a development team. A Markdown (.md) file is clean, easy to read, and clearly separates content from implementation details.

Here is the content formatted for a .md file. You can copy the text below and save it as TNC_Supplier_Data.md.

---

### How to Use This File

Your developer team (Ale, Tsany, and Ton) can use this file in two ways:
1.  *Content Source:* This is the official text they will copy and paste into the application's T&C modal window.
2.  *Implementation Guide:* The "Developer Notes" section tells them exactly what data needs to be captured in the database to make this feature robust and auditable.

---

markdown
# Genco Supplier Data - Terms and Conditions

> **Developer Notes:**
>
> - **Purpose:** This Markdown file contains the official text for the Terms and Conditions modal that appears in the Supplier Survey form.
> - **Display:** This content should be displayed in a modal window (pop-up) that is triggered by a hyperlink.
> - **Data to Capture on Submit:** When the user checks the consent box and submits the form, the backend must save the following data associated with the survey record:
>   - `consent_given` (Boolean): `true` if the checkbox was checked.
>   - `consent_timestamp` (Timestamp): The exact server date and time of submission.
>   - `tnc_version` (String): The version number from this document (e.g., "1.0"). This is critical for future audits if the T&C text changes.

---

**Effective Date:** [Current Date]
**Version:** 1.0

## 1. Introduction

By checking the box and submitting this form, you ("the Supplier") are providing information to Genco ("the Company") and agree to the terms outlined below regarding the collection, use, and protection of your data.

## 2. Purpose of Data Collection

The Company collects the information provided in this survey for the following specific purposes:

*   To conduct due diligence and verify your eligibility as a supplier.
*   To ensure compliance with international sustainability standards, including but not limited to ISCC (International Sustainability and Carbon Certification) and EUDR (EU Deforestation Regulation).
*   To manage our supply chain and maintain traceability of raw materials from source to final product.
*   For internal record-keeping, operational planning, and communication related to our business relationship.

## 3. Data Usage and Confidentiality

Genco provides the following guarantee regarding your data:

*   **Internal Use Only:** Your data will be used exclusively for the internal business purposes of the Company as described above.
*   **No Sale of Data:** We will **never** sell, rent, or lease your personal or operational data to any third party for marketing or any other purpose.
*   **Limited Sharing:** Your data may be shared with trusted third parties only when strictly necessary for our business operations. This includes:
    *   **Auditors:** Third-party auditors verifying our compliance with sustainability certifications.
    *   **Regulatory Bodies:** Government or regulatory agencies as required by law.
    
    These parties are also bound by strict confidentiality agreements.

## 4. Data Security

We are committed to ensuring that your information is secure. We have implemented suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect.

## 5. Consent and Declaration

By checking the "I Agree" box, you declare that:

*   You are authorized to provide this information on behalf of the supplier/plantation.
*   The information provided is true, accurate, and complete to the best of your knowledge.
*   You have read, understood, and agree to these Terms and Conditions regarding the use of your data.

