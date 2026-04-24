import PatientForm from "./PatientForm";
import CounselorForm from "./CounselorForm";

interface AuthCardProps {
  role: "patient" | "counselor";
  onRoleChange: (role: "patient" | "counselor") => void;
}

export default function AuthCard({ role, onRoleChange }: AuthCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
      <div className="p-8">
        <h1 className="font-heading text-3xl font-bold text-center mb-2 text-charcoal">
          Welcome to Wumbness
        </h1>
        <p className="text-center font-sub text-2xl text-gray-400 mb-8 leading-none">
          A safe, welcoming space just for you.
        </p>

        {/* Role Toggle */}
        <div className="flex rounded-2xl bg-gray-100 p-1 mb-8 shadow-inner">
          <button
            onClick={() => onRoleChange("patient")}
            className={`flex-1 py-3 px-4 rounded-xl text-center font-bold transition-all duration-200 ${role === "patient"
                ? "bg-sage text-white shadow-md"
                : "text-gray-500 hover:text-charcoal"
              }`}
          >
            I need support
          </button>
          <button
            onClick={() => onRoleChange("counselor")}
            className={`flex-1 py-3 px-4 rounded-xl text-center font-bold transition-all duration-200 ${role === "counselor"
                ? "bg-brown text-white shadow-md"
                : "text-gray-500 hover:text-charcoal"
              }`}
          >
            I&apos;m a Counselor
          </button>
        </div>

        {role === "patient" ? <PatientForm /> : <CounselorForm />}

        <div className="mt-8 text-center">
          <p className="font-sub text-xl text-gray-500">By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
}
