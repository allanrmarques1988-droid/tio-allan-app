import React, { useState, useEffect } from 'react';
import { Check, Copy, QrCode, Smartphone, ShieldCheck, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const PixPayment: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  // Seus dados reais de pagamento
  const pixCode = "00020101021126330014br.gov.bcb.pix011106807165994520400005303986540568.505802BR5921ALLAN RODRIGO MARQUES6009SAO PAULO622905251KN347P9HYSHBR57XTYQDNNT76304D001"; 

  // SENSOR DE ACESSO: Se o aluno já pagou antes, ele não vê essa tela e vai direto para as aulas
  useEffect(() => {
    const hasPaid = localStorage.getItem('elite_access') === 'true';
    if (hasPaid) {
      navigate('/dashboard'); 
    }
  }, [navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // LIBERA O ACESSO, ABRE WHATSAPP E REDIRECIONA
  const handleConfirmAndAccess = () => {
    // 1. Cria o "ticket" de acesso no navegador
    localStorage.setItem('elite_access', 'true');

    // 2. Prepara a mensagem do WhatsApp (Número Corrigido)
    const message = encodeURIComponent("Olá Tio Allan! Acabei de realizar o pagamento do Elite do Crescimento. Segue o comprovante para conferência.");
    const whatsappUrl = `https://wa.me/5542984141259?text=${message}`;

    // 3. Abre o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');

    // 4. Manda o aluno para dentro do App
    navigate('/dashboard');
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

          {/* QR Code */}
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

          {/* BOTÃO PRINCIPAL: PAGA E LIBERA */}
          <div className="space-y-4">
            <button 
              onClick={handleConfirmAndAccess}
              className="w-full bg-tiktok-purple hover:bg-tiktok-purple/80 text-white p-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase italic transition-all shadow-[0_10px_30px_rgba(160,15,255,0.3)]"
            >
              <MessageCircle className="w-6 h-6 fill-white" />
              JÁ PAGUEI! LIBERAR MEU ACESSO
            </button>
            <p className="text-gray-500 text-[10px] font-bold uppercase">
              Ao clicar, você enviará o comprovante e entrará na comunidade.
            </p>
          </div>

          {/* Footer Seguro */}
          <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
            <ShieldCheck className="w-4 h-4 text-tiktok-cyan" />
            Recebedor: Allan Rodrigo Marques
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PixPayment;
