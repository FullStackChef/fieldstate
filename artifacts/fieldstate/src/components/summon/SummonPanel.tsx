import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store";
import { X, Send } from "lucide-react";
import { useSubmitLead } from "@/hooks/use-leads";
import { useLocation } from "wouter";

export function SummonPanel() {
  const { summonState, setSummonState } = useStore();
  const [location] = useLocation();
  const { submit, isPending, isSuccess, error } = useSubmitLead();
  
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<{sender: 'system' | 'user', text: string}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, step]);

  useEffect(() => {
    if (summonState === 'open' && step === 0) {
      let greeting = "You have initiated a connection sequence.";
      if (location === '/forge') greeting = "You are examining the artifacts. What do you seek to build?";
      else if (location === '/mythos') greeting = "The narrative resonates. How can we align our stories?";
      else if (location === '/labs') greeting = "Experimental protocols active. Are you applying for access?";
      else if (location === '/contact') greeting = "A direct channel. What brings you here?";
      
      setMessages([{ sender: 'system', text: greeting }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'system', text: "State your intent or identity." }]);
        setStep(1);
        setSummonState('active');
      }, 1500);
    }
  }, [summonState, location, step, setSummonState]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);

    if (step === 1) {
      setIntent(userText);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'system', text: "Intent recorded. A channel requires a contact vector. Provide your email." }]);
        setStep(2);
      }, 1000);
    } else if (step === 2) {
      setEmail(userText);
      setStep(3);
      setSummonState('capturing');
      
      submit({
        source: 'summon',
        email: userText,
        message: intent,
        route: location,
        honeypot: honeypot
      });
    }
  };

  useEffect(() => {
    if (step === 3 && isSuccess) {
      setMessages(prev => [...prev, { sender: 'system', text: "Transmission received. The sequence is complete. We will initiate contact." }]);
      setSummonState('complete');
    } else if (step === 3 && error) {
      setMessages(prev => [...prev, { sender: 'system', text: `Error in transmission: ${error}` }]);
      setStep(2);
    }
  }, [isSuccess, error, step, setSummonState]);

  const closePanel = () => {
    setSummonState('closed');
    setTimeout(() => {
      setStep(0);
      setMessages([]);
      setEmail("");
      setIntent("");
    }, 500);
  };

  if (summonState === 'closed') return null;

  const panelContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border flex justify-between items-center flex-shrink-0">
        <h3 className="font-serif tracking-widest text-primary uppercase text-sm">Summon Sequence</h3>
        <button onClick={closePanel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={msg.sender === 'system' ? 'text-left' : 'text-right'}
          >
            <div className={`inline-block p-4 max-w-[85%] text-sm leading-relaxed ${
              msg.sender === 'system' 
                ? 'bg-secondary text-secondary-foreground border border-border rounded-br-2xl rounded-tr-2xl rounded-tl-2xl' 
                : 'bg-primary text-primary-foreground rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        
        {isPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left">
            <div className="inline-flex gap-1 p-4 bg-secondary text-muted-foreground border border-border rounded-br-2xl rounded-tr-2xl rounded-tl-2xl">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-background flex-shrink-0">
        <form onSubmit={handleInputSubmit} className="relative">
          {/* Honeypot */}
          <input 
            type="text" 
            name="website" 
            value={honeypot} 
            onChange={e => setHoneypot(e.target.value)} 
            style={{ display: 'none' }}
            tabIndex={-1} 
            autoComplete="off" 
            aria-hidden="true"
          />
          
          <input
            type={step === 2 ? "email" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={step === 3 || step === 0 || isPending}
            placeholder={step === 1 ? "Enter your intent..." : step === 2 ? "Enter your email..." : "Sequence complete."}
            className="w-full bg-secondary border border-border text-foreground px-4 py-3 pr-14 rounded-none focus:outline-none focus:border-primary disabled:opacity-50 text-sm"
            autoFocus
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isPending || step === 3 || step === 0}
            className="absolute right-0 top-0 bottom-0 px-4 bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={closePanel}
        />

        {/* Desktop: right-side panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl hidden md:flex"
        >
          {panelContent}
        </motion.div>

        {/* Mobile: bottom sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 right-0 bottom-0 z-50 h-[80vh] bg-card border-t border-border flex flex-col shadow-2xl md:hidden"
          style={{ borderRadius: '1rem 1rem 0 0' }}
        >
          <div className="w-12 h-1 bg-border rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
          {panelContent}
        </motion.div>
      </>
    </AnimatePresence>
  );
}
