import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '../../../shared';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Mammoth Application - Terms of Use (EULA)</AlertDialogTitle>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Version: 1.0 | Effective Date: 31 December 2025</p>
            <p>Service Provider: Genco Oil Limited (Hong Kong) and its affiliates</p>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-bold text-base mb-2">1. Agreement to Terms</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li>
                <strong>Binding Agreement:</strong> By downloading, installing, accessing, or using the Mammoth application ("App"),
                you ("User") agree to be bound by these Terms of Use
              </li>
              <li>
                <strong>Authority:</strong> If using on behalf of a legal entity, you represent you have the legal authority to bind that entity
              </li>
              <li>
                <strong>Beta Status:</strong> You acknowledge the App is in "Beta" phase, provided "As Is" without specific service level guarantees
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">2. Scope of Use & Restricted Trading</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <strong>License Grant:</strong> We grant you a limited, non-exclusive, non-transferable, revocable license
                to use the App solely for recording supply chain data and facilitating transactions within the approved network
              </li>
              <li>
                <strong>Restricted Trading Network:</strong> The App is designed for a closed-loop supply chain. You agree that:
                <ul className="list-disc ml-6 mt-1">
                  <li>You may only use the App to record transactions with PT CEAA or authorized buyers</li>
                  <li>You are prohibited from using the App to facilitate sales to unauthorized competitors</li>
                </ul>
              </li>
              <li>
                <strong>Violation:</strong> Any attempt to use the App to divert supply to unauthorized parties
                constitutes material breach, resulting in immediate termination and potential legal action
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">3. Data Integrity & Operational Requirements</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <strong>Accuracy Warranty:</strong> You warrant that all data entered is true and accurate.
                Falsifying data is fraud and will be reported to authorities
              </li>
              <li>
                <strong>Offline Mode & Synchronization:</strong>
                <ul className="list-disc ml-6 mt-1">
                  <li>The App may function in offline mode in areas with poor connectivity</li>
                  <li><strong>The 48-Hour Rule:</strong> You must connect to internet and sync data within 48 hours of collection</li>
                  <li><strong>Data Rejection:</strong> We reserve the right to reject data synced after this window</li>
                </ul>
              </li>
              <li>
                <strong>Timestamp Logic:</strong> In case of conflict between "Device Time" and "Server Time",
                the Server Time upon synchronization shall prevail for audit purposes
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">4. Device Policy (BYOD)</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li><strong>Bring Your Own Device:</strong> You acknowledge using your own personal or company-issued device</li>
              <li><strong>Costs:</strong> You are responsible for all device costs (mobile data, internet, electricity)</li>
              <li><strong>Security:</strong> You must use a screen lock/passcode on your device</li>
              <li>
                <strong>Indemnity:</strong> The Provider is not liable for:
                <ul className="list-disc ml-6 mt-1">
                  <li>Any damage to your device</li>
                  <li>Battery drainage or data overage charges</li>
                  <li>Loss of data stored locally before synchronization</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">5. Financial Disclaimer (OJK Compliance)</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li>
                <strong>Not a Payment Gateway:</strong> The App is a technical recording tool only.
                It is NOT a financial instrument, e-wallet, or payment gateway
              </li>
              <li>
                <strong>Invoices & Receipts:</strong> Any "Invoice" or "Receipt" generated is for administrative reference only
                and does not constitute legal proof of payment
              </li>
              <li>
                <strong>No Liability for Non-Payment:</strong> The Provider is not liable for any failure of the Buyer to pay the Supplier
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">6. Intellectual Property & Data Rights</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <strong>User Content (Raw Data):</strong> You retain ownership of raw data you input,
                but grant us a perpetual, irrevocable, worldwide license to use, host, store, and share this data
              </li>
              <li>
                <strong>Derived Data (Provider IP):</strong> The Provider exclusively owns all rights to "Derived Data" including:
                <ul className="list-disc ml-6 mt-1">
                  <li>Yield predictions, regional supply maps, risk scores, AI models</li>
                  <li>You have no claim to royalties from monetization of this Derived Data</li>
                </ul>
              </li>
              <li>
                <strong>Cross-Border Transfer:</strong> You consent to your data being stored in Singapore
                and accessed by teams in Hong Kong and auditors in the EU/UK
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">7. Privacy & Personal Data (UU PDP)</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li><strong>Consent:</strong> By using the App, you consent to collection of Name, NIK, Phone Number, and Geospatial Location</li>
              <li>
                <strong>Purpose:</strong> This data is processed strictly for:
                <ul className="list-disc ml-6 mt-1">
                  <li>Supply chain traceability</li>
                  <li>Compliance with ISCC/RED sustainability standards</li>
                  <li>Commercial management of the supply chain</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">8. Termination & "Kill Switch"</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li><strong>Right to Terminate:</strong> We may terminate or suspend your access immediately for any breach</li>
              <li>
                <strong>Waiver of Articles 1266 & 1267:</strong> Parties agree to waive court order requirements for termination.
                The Provider reserves the right to terminate unilaterally and immediately upon breach
              </li>
              <li>
                <strong>The "Kill Switch":</strong> Upon termination or commercial relationship end:
                <ul className="list-disc ml-6 mt-1">
                  <li>The Provider may remotely disable access to the App</li>
                  <li>The Provider retains the right to lock and take over all data for ISCC audit continuity</li>
                  <li>You have no right to demand deletion of data required for regulatory or certification audits</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">9. Limitation of Liability</h3>
            <p>To the maximum extent permitted by law:</p>
            <ol className="list-decimal ml-6 space-y-1">
              <li>
                <strong>No Consequential Damages:</strong> The Provider shall not be liable for any indirect,
                incidental, or consequential damages (including loss of profit or business interruption)
              </li>
              <li>
                <strong>Cap on Liability:</strong> The Provider's total liability shall not exceed the total fees
                paid in the three months preceding the claim, or USD $100.00, whichever is lower
              </li>
              <li>
                <strong>Evidence:</strong> You agree that electronic logs and audit trails constitute valid legal evidence
                under Law No. 11 of 2008 regarding Electronic Information and Transactions
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">10. Dispute Resolution</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li><strong>Amicable Settlement:</strong> Parties shall attempt to resolve disputes within thirty (30) days</li>
              <li>
                <strong>Arbitration (BANI):</strong> If unresolved, disputes shall be settled by arbitration in Indonesia
                under BANI rules
                <ul className="list-disc ml-6 mt-1">
                  <li><strong>Seat:</strong> Jakarta, Indonesia</li>
                  <li><strong>Language:</strong> English (with Bahasa Indonesia translation if required)</li>
                  <li><strong>Decision:</strong> The award shall be final and binding</li>
                </ul>
              </li>
              <li>
                <strong>Class Action Waiver:</strong> You agree to resolve disputes only on an individual basis
                and waive any right to participate in a class action
              </li>
            </ol>
          </section>

          <section className="bg-gray-50 p-3 rounded">
            <h3 className="font-bold text-base mb-2">11. Governing Law & Language</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li><strong>Governing Law:</strong> Republic of Indonesia</li>
              <li><strong>Language:</strong> In case of inconsistency, the Bahasa Indonesia version shall prevail</li>
            </ol>
          </section>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TermsOfUseModal;