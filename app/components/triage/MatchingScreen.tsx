export default function MatchingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-full animate-in fade-in duration-700 bg-pearl z-50 absolute inset-0">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        {/* Breathing Animation Background Blob */}
        <div className="absolute inset-0 bg-sage rounded-full opacity-20 animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-0 bg-sage rounded-full opacity-40 animate-pulse" style={{ animationDuration: '2s' }}></div>
        
        {/* Core Logo/Element */}
        <div className="relative w-20 h-20 bg-sage rounded-full shadow-lg flex items-center justify-center">
             <span className="text-white text-4xl font-bold font-heading">W</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-heading font-bold text-charcoal text-center mb-3">
        Finding the best counselor for you...
      </h2>
      <p className="text-center text-gray-500 font-body text-sm max-w-xs leading-relaxed">
        We&apos;re securely matching your responses to ensure you get the absolute best support. This should only take a moment.
      </p>
    </div>
  );
}
