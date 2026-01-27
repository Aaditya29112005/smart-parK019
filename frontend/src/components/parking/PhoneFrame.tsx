import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  showNotch?: boolean;
}

const PhoneFrame = ({ children, showNotch = false }: PhoneFrameProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 p-4">
      <div className="phone-frame shadow-2xl">
        {showNotch && <div className="phone-notch" />}
        <div className="phone-screen pb-20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;