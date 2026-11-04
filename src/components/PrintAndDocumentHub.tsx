import React, { useState } from 'react';
import { 
  Printer, 
  Copy, 
  Scan, 
  FileCheck2, 
  Send, 
  CheckCircle, 
  FileText
} from 'lucide-react';

export const PrintAndDocumentHub: React.FC = () => {
  const [pagesCount, setPagesCount] = useState<number>(10);
  const [copiesCount, setCopiesCount] = useState<number>(1);
  const [colorMode, setColorMode] = useState<'bw' | 'color'>('bw');
  const [paperFormat, setPaperFormat] = useState<'A4' | 'A3'>('A4');
  const [laminationCount, setLaminationCount] = useState<number>(0);
  const [scanCount, setScanCount] = useState<number>(0);
  const [faxPages, setFaxPages] = useState<number>(0);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  // Pricing in Euro (€)
  const unitPrintPrice = colorMode === 'color' 
    ? (paperFormat === 'A3' ? 0.80 : 0.40) 
    : (paperFormat === 'A3' ? 0.30 : 0.15);

  const printTotal = pagesCount * copiesCount * unitPrintPrice;
  const laminationTotal = laminationCount * 2.00;
  const scanTotal = scanCount * 0.30;
  const faxTotal = faxPages * 1.50;
  const grandTotal = printTotal + laminationTotal + scanTotal + faxTotal;

  const handleGenerateTicket = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setOrderCode(code);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Banner: Soft light green gradient */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/70 text-gray-900 rounded-3xl p-6 sm:p-10 border border-emerald-200/90 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <span>Services Bureautique & Documents Express</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Photocopie, Impression, Numérisation, Fax & Plastification
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Imprimantes professionnelles haute résolution Xerox et Canon en libre-service assisté. Imprimez vos CV, contrats, rapports, mémoires et formulaires administratifs en quelques secondes au 4-6 boulevard de la Boissière à Romainville.
          </p>
        </div>
      </div>

      {/* Services Price Table & Interactive Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Estimator */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Printer className="w-5 h-5 text-emerald-700" />
              <span>Simulateur & Devis d'impression</span>
            </h2>

            {/* Print Section */}
            <div className="space-y-4 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                <Copy className="w-4 h-4 text-emerald-700" />
                <span>1. Impression de documents ou photocopies (PDF, Word, CV, formulaires)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre de pages</label>
                  <input
                    type="number"
                    min="1"
                    value={pagesCount}
                    onChange={(e) => setPagesCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre d'exemplaires</label>
                  <input
                    type="number"
                    min="1"
                    value={copiesCount}
                    onChange={(e) => setCopiesCount(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mode couleur</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setColorMode('bw')}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        colorMode === 'bw'
                          ? 'bg-[#3f704d] text-white border-[#3f704d] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Noir & Blanc (0,15 €)
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode('color')}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        colorMode === 'color'
                          ? 'bg-[#3f704d] text-white border-[#3f704d] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Couleur HD (0,40 €)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Format de papier</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaperFormat('A4')}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        paperFormat === 'A4'
                          ? 'bg-[#3f704d] text-white border-[#3f704d] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Format standard A4
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperFormat('A3')}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        paperFormat === 'A3'
                          ? 'bg-[#3f704d] text-white border-[#3f704d] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Grand format A3
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bureau Services: Lamination, Scanning, Fax */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Lamination */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  <span>Plastification</span>
                </div>
                <p className="text-[11px] text-gray-500">2,00 € / pochette thermique rigide</p>
                <div className="flex items-center space-x-2 pt-1">
                  <label className="text-xs text-gray-700 font-medium">Quantité :</label>
                  <input
                    type="number"
                    min="0"
                    value={laminationCount}
                    onChange={(e) => setLaminationCount(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              {/* Scanning */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
                  <Scan className="w-4 h-4 text-emerald-700" />
                  <span>Numérisation HD</span>
                </div>
                <p className="text-[11px] text-gray-500">0,30 € / page vers e-mail ou USB</p>
                <div className="flex items-center space-x-2 pt-1">
                  <label className="text-xs text-gray-700 font-medium">Pages :</label>
                  <input
                    type="number"
                    min="0"
                    value={scanCount}
                    onChange={(e) => setScanCount(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              {/* Fax */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
                  <Send className="w-4 h-4 text-emerald-700" />
                  <span>Envoi & Réception Fax</span>
                </div>
                <p className="text-[11px] text-gray-500">1,50 € / page avec accusé</p>
                <div className="flex items-center space-x-2 pt-1">
                  <label className="text-xs text-gray-700 font-medium">Pages :</label>
                  <input
                    type="number"
                    min="0"
                    value={faxPages}
                    onChange={(e) => setFaxPages(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

            </div>

            {/* Total Display & Ticket generation */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                  Total estimé
                </span>
                <div className="text-3xl font-extrabold text-emerald-950 mt-0.5">
                  {grandTotal.toFixed(2).replace('.', ',')} €
                </div>
                <div className="text-[11px] text-emerald-800 mt-1">
                  Paiement au comptoir : Espèces, Carte Bancaire ou Sans Contact.
                </div>
              </div>

              {/* Slightly green button, strictly NO emoji in button */}
              <button
                onClick={handleGenerateTicket}
                className="bg-[#3f704d] hover:bg-[#335c3f] text-white font-bold py-3 px-5 rounded-2xl text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Générer mon ticket comptoir</span>
              </button>
            </div>

            {/* Ticket Result */}
            {orderCode && (
              <div className="p-4 bg-emerald-100 rounded-2xl border border-emerald-300 text-center space-y-2 animate-in zoom-in-95">
                <span className="text-xs font-bold uppercase text-emerald-900">
                  Votre numéro de passage prioritaire
                </span>
                <div className="text-3xl font-extrabold tracking-widest text-emerald-950">
                  {orderCode}
                </div>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Présentez ce code à notre conseiller au 4-6 boulevard de la Boissière à Romainville pour lancer immédiatement votre tirage.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Price Guide */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>Grille tarifaire détaillée</span>
            </h2>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Photocopie / Tirage N&B A4</span>
                <strong className="text-gray-900">0,15 € / page</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Impression Couleur HD A4</span>
                <strong className="text-gray-900">0,40 € / page</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Tirage N&B Format A3</span>
                <strong className="text-gray-900">0,30 € / page</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Impression Couleur Format A3</span>
                <strong className="text-gray-900">0,80 € / page</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Numérisation HD vers e-mail / USB</span>
                <strong className="text-gray-900">0,30 € / page</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Plastification thermique A4</span>
                <strong className="text-gray-900">2,00 € / pochette</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Plastification grand format A3</span>
                <strong className="text-gray-900">3,50 € / pochette</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Transmission de Fax (France)</span>
                <strong className="text-gray-900">1,50 € / page</strong>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-600">Transmission de Fax (International)</span>
                <strong className="text-gray-900">2,50 € / page</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500">
              Supports acceptés : Clés USB, cartes mémoire, e-mails avec pièces jointes à 3communesinfo@gmail.com, WhatsApp ou Bluetooth.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
