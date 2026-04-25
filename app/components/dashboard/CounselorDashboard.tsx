import Link from "next/link";

interface CounselorDashboardProps {
  firstName?: string | null;
}

export default function CounselorDashboard({ firstName }: CounselorDashboardProps) {
  const stats = [
    { label: "Patients Helped", value: "24", icon: "M12 4v16m8-8H4" },
    { label: "Hours Volunteered", value: "86", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Active Chats", value: "3", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  ];

  const matchedPatients = [
    {
      id: "1",
      alias: "Patient A",
      severity: "Moderate",
      unread: 2,
      triageSummary: [
        "Experiencing school stress from upcoming finals.",
        "Feels overwhelmed and unable to focus.",
        "Mentioned difficulty sleeping."
      ]
    },
    {
      id: "2",
      alias: "Patient B",
      severity: "Check-in",
      unread: 0,
      triageSummary: [
        "Navigating recent family conflicts.",
        "Looking for grounding exercises.",
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Welcome & Stats */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-charcoal mb-4">
          {firstName ? `Welcome back, ${firstName}` : "Welcome back, Counselor"}
        </h1>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-brown font-heading">{stat.value}</span>
              <span className="text-xs font-bold text-gray-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matched Patients Queue */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">Your Patient Queue</h2>
        <div className="flex flex-col gap-4">
          {matchedPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative overflow-hidden">
              {patient.unread > 0 && (
                <div className="absolute top-0 right-0 bg-sage text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                  {patient.unread} new messages
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pearl rounded-full flex items-center justify-center font-heading font-black text-xl text-sage border border-sage/20">
                    {patient.alias[patient.alias.length - 1]}
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-lg leading-tight">{patient.alias}</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{patient.severity}</span>
                  </div>
                </div>
              </div>

              <div className="bg-pearl/50 rounded-2xl p-4 mb-4">
                <h4 className="text-xs font-bold text-charcoal mb-2 uppercase tracking-wide">AI Triage Summary</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {patient.triageSummary.map((bullet, idx) => (
                    <li key={idx} className="text-sm text-gray-600 font-body">{bullet}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/chat"
                  className="flex-1 bg-brown hover:bg-[#907460] text-white font-bold py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] text-center"
                >
                  Enter Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
