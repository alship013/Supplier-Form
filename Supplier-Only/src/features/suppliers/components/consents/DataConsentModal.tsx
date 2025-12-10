import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '../../../shared';

interface DataConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const DataConsentModal: React.FC<DataConsentModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Specific Personal Data Consent Form</AlertDialogTitle>
          <p className="text-sm font-normal text-gray-600">
            Formulir Persetujuan Khusus Data Pribadi
          </p>
        </AlertDialogHeader>

        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold">Reference: Law No. 27 of 2022 (UU PDP)</p>
            <p className="font-semibold">Controller: PT CEAA (Indonesia)</p>
            <p className="font-semibold">Processor: Genco Oil Limited (Hong Kong)</p>
          </div>

          <section>
            <h3 className="font-bold text-base mb-2">1. Declaration of Capacity (Pernyataan Kecakapan)</h3>
            <p className="mb-2">
              I hereby declare that I am inputting this data myself. I am 21 years of age or older,
              or I am/have been married, and I am legally capable of entering into this agreement.
            </p>
            <p className="text-gray-600 italic">
              (Saya dengan ini menyatakan bahwa saya memasukkan data ini sendiri. Saya berusia 21 tahun
              atau lebih, atau sudah/pernah menikah, dan saya cakap secara hukum untuk mengadakan perjanjian ini.)
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">2. Scope of Data Collection (Lingkup Pengumpulan Data)</h3>
            <p className="mb-2">
              I explicitly consent to the collection and processing of the following categories of data:
            </p>
            <p className="text-gray-600 italic mb-3">
              (Saya secara tegas menyetujui pengumpulan dan pemrosesan kategori data berikut:)
            </p>

            <div className="ml-4 space-y-3">
              <div>
                <h4 className="font-semibold">A. General Data (Data Umum):</h4>
                <ul className="list-disc ml-6">
                  <li>Full Name, NIK (KTP Number), Phone Number, and Physical Address</li>
                  <li className="text-gray-600">(Nama Lengkap, NIK, Nomor Telepon, dan Alamat Fisik)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">B. Asset & Geospatial Data (Data Aset & Spasial):</h4>
                <ul className="list-disc ml-6">
                  <li>Land Documents: Photos/Scans of Land Deeds (SHM, Girik, SKT) to prove ownership</li>
                  <li className="text-gray-600">(Dokumen Lahan: Foto/Pindai Surat Tanah (SHM, Girik, SKT) untuk membuktikan kepemilikan)</li>
                  <li>Location: Precise GPS coordinates of the farm and photos of the land/crops</li>
                  <li className="text-gray-600">(Lokasi: Koordinat GPS presisi kebun dan foto lahan/tanaman)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">C. Financial Data (Data Keuangan):</h4>
                <ul className="list-disc ml-6">
                  <li>Bank Details: Bank Account Number, Bank Name, and Account Holder Name</li>
                  <li className="text-gray-600">(Detail Bank: Nomor Rekening, Nama Bank, dan Nama Pemilik Rekening)</li>
                </ul>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Note: This data is collected solely for the purpose of generating invoices and facilitating payments outside the App.
                  The App itself is not a payment gateway.
                </p>
                <p className="text-xs text-gray-500 italic ml-6">
                  (Catatan: Data ini dikumpulkan semata-mata untuk tujuan pembuatan faktur dan memfasilitasi pembayaran di luar Aplikasi.
                  Aplikasi ini bukan gerbang pembayaran.)
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">3. Purpose of Processing (Tujuan Pemrosesan)</h3>
            <p className="mb-2">My data is processed strictly for:</p>
            <p className="text-gray-600 italic mb-2">(Data saya diproses semata-mata untuk:)</p>
            <ol className="list-decimal ml-6 space-y-1">
              <li>
                <span className="font-semibold">Sustainability Certification:</span> Verifying land legality and deforestation-free status (ISCC/RED)
                <span className="block text-gray-600">(Sertifikasi Keberlanjutan: Memverifikasi legalitas lahan dan status bebas deforestasi)</span>
              </li>
              <li>
                <span className="font-semibold">Administrative & Financial:</span> Generating invoices and processing payments for goods supplied
                <span className="block text-gray-600">(Administrasi & Keuangan: Membuat faktur dan memproses pembayaran atas barang yang dipasok)</span>
              </li>
              <li>
                <span className="font-semibold">Communication:</span> Sending notifications via In-App Messages and WhatsApp/SMS regarding delivery schedules and account updates
                <span className="block text-gray-600">(Komunikasi: Mengirim pemberitahuan melalui Pesan Dalam Aplikasi dan WhatsApp/SMS mengenai jadwal pengiriman dan pembaruan akun)</span>
              </li>
            </ol>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">4. Cross-Border Transfer (Transfer Lintas Batas)</h3>
            <p className="mb-2">I explicitly consent to the transfer and storage of my data outside Indonesia:</p>
            <p className="text-gray-600 italic mb-2">(Saya secara tegas menyetujui transfer dan penyimpanan data saya di luar Indonesia:)</p>
            <ul className="list-disc ml-6">
              <li><strong>Storage:</strong> Google Cloud Platform (Server: Singapore)</li>
              <li><strong>Management:</strong> Genco Oil Limited (Location: Hong Kong)</li>
              <li><strong>Audit:</strong> Certification Bodies & Buyers (Location: EU / UK)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">5. Data Retention (Retensi Data)</h3>
            <p className="mb-2">
              I acknowledge that PT CEAA must retain my data (including Land and Financial records) for a minimum
              of five (5) years to comply with international trade audit trails.
            </p>
            <p className="text-gray-600 italic">
              (Saya mengakui bahwa PT CEAA wajib menyimpan data saya (termasuk catatan Lahan dan Keuangan) selama minimal
              5 (lima) tahun untuk mematuhi jejak audit perdagangan internasional.)
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

export default DataConsentModal;