import React, { useState, useEffect } from 'react';
import { Check, Copy, QrCode, Smartphone, ShieldCheck, MessageCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const PixPayment: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [passKey, setPassKey] = useState(''); // Estado para a senha
  const navigate = useNavigate();
  
  const pixCode = "00020101021126330014br.gov.bcb.pix011106807165994520400005303986540568.505802BR5921ALLAN RODRIGO MARQUES6009SAO PAULO622905251KN347P9HYSHBR57XTYQDNNT76304D001"; 

  useEffect(() => {
    if (localStorage.getItem('access_key') === 'ELITE2026') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent("Tio Allan, fiz o Pix! Libera minha senha de acesso.");
    window.open(`https://wa.me/5542984141259?text=${message}`, '_blank');
  };

  const handleUnlock = () => {
    if (passKey.toUpperCase() === 'ELITE2026') { // Sua senha aqui
      localStorage.setItem('access_key', 'ELITE2026');
      navigate('/dashboard');
    } else {
      alert("Senha incorreta! Peça a senha correta ao Tio Allan no WhatsApp.");
    }
  };

  return (
    <div className="min-h-screen bg-premium-black text-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card p-8 text-center space-y-6">
          <h1 className="text-3xl font-black italic">ACESSO À <span className="text-tiktok-purple">ELITE</span></h1>
          
          <div className="bg-white/5 py-4 rounded-2xl border border-white/10">
            <p className="text-4xl font-black text-tiktok-cyan">R$ 68,50</p>
          </div>

          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`} className="mx-auto bg-white p-2 rounded-xl" alt="Pix" />

          <button onClick={handleCopy} className="w-full bg-white/10 p-3 rounded-xl flex justify-between items-center">
            <span className="text-xs truncate">{pixCode}</span>
            <Copy className="w-5 h-5" />
          </button>

          <button onClick={handleWhatsAppRedirect} className="w-full bg-[#25D366] p-4 rounded-xl font-bold flex justify-center items-center gap-2">
            <MessageCircle /> ENVIAR COMPROVANTE E PEDIR SENHA
          </button>

          <div className="h-[2px] bg-white/10 my-6" />

          {/* ÁREA DA SENHA */}
          <div className="space-y-4 bg-tiktok-purple/10 p-6 rounded-2xl border border-tiktok-purple/30">
            <p className="font-bold text-tiktok-purple flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> JÁ RECEBEU SUA SENHA?
            </p>
            <input 
              type="text" 
              placeholder="Digite sua senha de acesso..." 
              className="w-full bg-black border border-white/20 p-4 rounded-xl text-center font-bold uppercase tracking-widest"
              value={passKey}
              onChange={(e) => setPassKey(e.target.value)}
            />
            <button onClick={handleUnlock} className="w-full bg-tiktok-purple p-4 rounded-xl font-black uppercase">
              DESTRAVAR APLICATIVO
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PixPayment;
