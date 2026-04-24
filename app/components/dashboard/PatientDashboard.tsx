export default function PatientDashboard() {
  const counselor = {
    name: "Sarah Jenkins, LSW",
    bio: "Specializes in youth anxiety, school stress, and building self-esteem. Here to listen.",
    isOnline: true,
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header element */}
      <div className="mb-2">
        <h1 className="font-heading text-3xl font-bold text-charcoal">Hello there,</h1>
        <p className="text-gray-500 font-sub text-2xl leading-none">Your safe space awaits.</p>
      </div>

      {/* Counselor Match Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-start gap-4">
          <div className="relative">
             {/* Abstract Avatar for Counselor */}
             <div className="w-16 h-16 rounded-2xl bg-brown flex items-center justify-center shadow-md">
                 <svg viewBox="0 0 100 100" className="w-10 h-10 fill-white">
                   <path d="M50 8C27 8 8 27 8 50s19 42 42 42 42-19 42-42S73 8 50 8zm0 76c-19 0-34-15-34-34S31 16 50 16s34 15 34 34-15 34-34 34z" />
                   <path d="M35 45c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5zm30 0c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5zm-15 15c-10 0-18 6-22 15h44c-4-9-12-15-22-15z" />
                 </svg>
             </div>
             {/* Online Status */}
             {counselor.isOnline && (
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
             )}
          </div>
          <div className="flex-1">
            <h2 className="font-heading font-bold text-xl text-charcoal">{counselor.name}</h2>
            <p className="text-sm font-body text-gray-500 mt-1 leading-relaxed">{counselor.bio}</p>
          </div>
        </div>

        <button className="mt-5 w-full bg-sage hover:bg-[#8ca56d] text-white font-bold py-4 rounded-2xl shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Resume Chat
        </button>
      </div>

      {/* Mood Check-in Widget */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <h3 className="font-heading font-bold text-lg text-charcoal mb-4">How are you feeling today?</h3>
        <div className="flex justify-between items-center bg-pearl p-2 rounded-2xl">
           {["😢", "😕", "😐", "🙂", "😊"].map((emoji, idx) => (
             <button key={idx} className="text-3xl hover:scale-125 transition-transform duration-200">
               {emoji}
             </button>
           ))}
        </div>
      </div>

    </div>
  );
}
