import React, { useState } from 'react';
import { Check, Copy, QrCode, Smartphone, ShieldCheck, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';

const PixPayment: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  // Seus dados reais de pagamento atualizados
  const pixCode = "00020101021126330014br.gov.bcb.pix011106807165994520400005303986540568.505802BR5921ALLAN RODRIGO MARQUES6009SAO PAULO622905251KN347P9HYSHBR57XTYQDNNT76304D001"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent("Olá Tio Allan! Acabei de realizar o pagamento do curso Elite do Crescimento. Segue o comprovante em anexo.");
    window.open(`https://wa.me/5542984141259?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-premium-black text-white">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-8 md:p-12 text-center space-y-8 border-tiktok-purple/30"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="w-16 h-16 bg-tiktok-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-tiktok-cyan w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Acesso à <span className="text-tiktok-purple">Elite</span>
            </h1>
            <p className="text-gray-400 font-medium">Escaneie o QR Code ou use o Copia e Cola</p>
          </div>

          {/* Valor */}
          <div className="bg-white/5 py-4 rounded-2xl border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Valor da Assinatura</p>
            <p className="text-4xl font-black text-tiktok-cyan italic">R$ 68,50</p>
          </div>

          {/* QR Code Real gerado via API */}
          <div className="relative group mx-auto w-64 h-64 bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(160,15,255,0.2)]">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`} 
              alt="QR Code Pix Allan"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Smartphone className="text-tiktok-purple w-12 h-12 animate-bounce" />
            </div>
          </div>

          {/* Botão Copia e Cola */}
          <div className="space-y-4">
            <button 
              onClick={handleCopy}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="text-left overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pix Copia e Cola</p>
                <p className="font-bold truncate text-xs text-gray-300">{pixCode}</p>
              </div>
              <div className="bg-tiktok-purple p-3 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0 ml-4">
                {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
              </div>
            </button>
            
            <AnimatePresence>
              {copied && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-tiktok-cyan font-black uppercase italic text-xs"
                >
                  ✨ Código de pagamento copiado!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Botão WhatsApp Comprovante */}
          <button 
            onClick={handleWhatsAppRedirect}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase italic transition-all shadow-[0_10px_30px_rgba(37,211,102,0.2)]"
          >
            <MessageCircle className="w-6 h-6 fill-white" />
            Enviar Comprovante no Whats
          </button>

          {/* Footer Seguro */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
            <ShieldCheck className="w-4 h-4 text-tiktok-cyan" />
            Recebedor: Allan Rodrigo Marques
          </div>
        </motion.div>

        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            A liberação ocorre após a confirmação do comprovante.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PixPayment;
