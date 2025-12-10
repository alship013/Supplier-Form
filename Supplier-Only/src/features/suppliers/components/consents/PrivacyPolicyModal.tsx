import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '../../../shared';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Mammoth Application - Privacy Policy</AlertDialogTitle>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Version: 2.0 | Effective Date: 31 December 2025</p>
            <p>Data Controller: PT CEAA (Indonesia)</p>
            <p>Data Processor & App Owner: Genco Oil Limited (Hong Kong)</p>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-bold text-base mb-2">1. Introduction</h3>
            <p className="mb-2">
              This Privacy Policy governs the collection, use, and storage of data within the Mammoth Application ("App").
              By registering an account, you explicitly consent to the data practices described herein.
            </p>
            <p className="mb-2">This policy is drafted in compliance with:</p>
            <ul className="list-disc ml-6">
              <li><strong>Indonesia:</strong> Law No. 27 of 2022 on Personal Data Protection (UU PDP)</li>
              <li><strong>International Standards:</strong> ISCC (International Sustainability & Carbon Certification) and EU RED (Renewable Energy Directive)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">2. Data We Collect</h3>
            <p className="mb-2">We collect only the data necessary to verify the sustainability of the supply chain.</p>

            <div className="ml-4 space-y-2">
              <div>
                <h4 className="font-semibold">1. Personal Information (Data Pribadi)</h4>
                <ul className="list-disc ml-6 text-sm">
                  <li><strong>Identity:</strong> Full Name, National ID (NIK/KTP), and Farmer ID</li>
                  <li><strong>Contact:</strong> Phone number (for WhatsApp/SMS verification) and physical address</li>
                  <li className="text-gray-600"><em>Note:</em> We do not collect biometric data (facial geometry/fingerprints) or financial payment data within the App</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">2. Operational & Geospatial Data</h4>
                <ul className="list-disc ml-6 text-sm">
                  <li><strong>Land Data:</strong> GPS Coordinates (Latitude/Longitude) of the farm/collection point</li>
                  <li><strong>Evidence:</strong> Photos of the land, crops, and harvest receipts</li>
                  <li><strong>Transaction Logs:</strong> Weight, quality, and timestamps of deliveries</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">3. Mobile Permissions (App Store Compliance)</h4>
                <p className="text-sm">To function correctly, the App requires access to the following permissions:</p>
                <ul className="list-disc ml-6 text-sm">
                  <li><strong>Location (GPS):</strong> Required to verify harvest origin. We record location only during specific actions, not continuously</li>
                  <li><strong>Camera & Storage:</strong> Required to take and upload photos of delivery notes or land conditions</li>
                  <li><strong>Network:</strong> Required to synchronize data with our servers</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">3. How We Use Your Data</h3>
            <p className="mb-2">Your data is processed for the following legal bases:</p>
            <ol className="list-decimal ml-6 space-y-1 mb-2">
              <li><strong>Contractual Performance:</strong> To facilitate the sale of your goods to PT CEAA</li>
              <li><strong>Legal Obligation:</strong> To comply with ISCC/RED certification requirements regarding deforestation-free supply chains</li>
            </ol>
            <p className="font-semibold">Specific Use Cases:</p>
            <ul className="list-disc ml-6">
              <li>Verifying land legality (checking against protected forest maps)</li>
              <li>Sending transaction confirmations via WhatsApp API or SMS</li>
              <li>Generating "Chain of Custody" reports for international buyers</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">4. Data Sharing & Sub-Processors</h3>
            <p className="mb-2">We do not sell your data. However, we share data with trusted third parties:</p>

            <div className="ml-4 space-y-2">
              <div>
                <h4 className="font-semibold">1. Technology Providers (Sub-Processors)</h4>
                <ul className="list-disc ml-6 text-sm">
                  <li><strong>Google Cloud Platform (GCP) / Supabase:</strong> For secure cloud hosting and database management</li>
                  <li><strong>Firebase / Google Analytics:</strong> For app performance monitoring and crash reporting</li>
                  <li><strong>WhatsApp Business API / Twilio:</strong> For sending OTPs and transaction notifications</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">2. Compliance & Audit Partners</h4>
                <ul className="list-disc ml-6 text-sm">
                  <li><strong>International Auditors:</strong> Bodies such as ISCC, Control Union, or SGS may access your data to verify compliance</li>
                  <li><strong>Global Buyers:</strong> Entities purchasing the final product require access to "Chain of Custody" data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">5. Cross-Border Data Transfer</h3>
            <p>You explicitly acknowledge and consent that:</p>
            <ol className="list-decimal ml-6 space-y-1">
              <li><strong>Storage Location:</strong> Your data is stored on secure servers located in Singapore</li>
              <li><strong>Management Access:</strong> Operational teams in Hong Kong have remote access for management purposes</li>
              <li><strong>Global Transfer:</strong> Data for certification is transferred to the EU/UK as part of sustainability documentation</li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">6. Data Retention & The "Soft Delete" Policy</h3>

            <div className="ml-4 space-y-2">
              <div>
                <h4 className="font-semibold">1. Retention Period</h4>
                <p className="text-sm">We retain your data for a minimum of five (5) years, or longer if required by ISCC/RED regulations</p>
              </div>

              <div>
                <h4 className="font-semibold">2. No "Right to Erasure" for Certified Data</h4>
                <p className="text-sm">
                  Under UU PDP, you generally have the right to delete your data. However, for data linked to sold commodities:
                </p>
                <ul className="list-disc ml-6 text-sm">
                  <li>Account deletion results in a "Soft Delete" (Archival)</li>
                  <li>Your account will be deactivated, but historical data remains in our secure database</li>
                  <li>Reason: We are legally required to maintain the audit trail for sustainability certificates</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">7. Security & Breach Notification</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li>
                <strong>Security Measures:</strong> We use encryption (HTTPS/TLS) and strict access controls to protect your data
              </li>
              <li>
                <strong>Breach Protocol:</strong> In the event of a data breach:
                <ul className="list-disc ml-6 text-sm mt-1">
                  <li>PT CEAA will notify you within 3x24 hours (72 hours) via the App, WhatsApp, or Email</li>
                  <li>PT CEAA will handle all local reporting requirements to the Indonesian Government</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">8. Your Rights</h3>
            <p>Subject to limitations, you have the right to:</p>
            <ul className="list-disc ml-6">
              <li>Request a copy of your data</li>
              <li>Correct inaccurate data</li>
              <li>Withdraw consent for future data collection (results in account termination)</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-3 rounded">
            <h3 className="font-bold text-base mb-2">9. Contact & Governing Law</h3>
            <ol className="list-decimal ml-6 space-y-1">
              <li><strong>Governing Law:</strong> Republic of Indonesia</li>
              <li><strong>Language:</strong> In case of inconsistency, the Bahasa Indonesia version shall prevail</li>
            </ol>
            <p className="mt-2 text-sm">
              <strong>Contact for Privacy Inquiries:</strong><br/>
              Data Protection Officer (PT CEAA)<br/>
              Address: [To be filled]<br/>
              Email: [To be filled]
            </p>
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

export default PrivacyPolicyModal;