import { useNavigate } from "react-router-dom";

interface TopAppBarProps {
  showBack?: boolean;
  showMenu?: boolean;
  showAvatar?: boolean;
}

const TopAppBar = ({
  showBack = false,
  showMenu = false,
  showAvatar = true,
}: TopAppBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full top-0 z-50 sticky bg-[#0c1321] flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center gap-3 sm:gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="hover:opacity-80 transition-opacity flex items-center justify-center p-1 rounded-full cursor-pointer text-[#4ade80]"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">
              arrow_back
            </span>
          </button>
        )}

        <h1
          className="font-black tracking-tighter text-lg sm:text-2xl text-[#4ade80] uppercase"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          KINETIC
        </h1>
      </div>
      
      {showAvatar && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#3d4a3e] hover:opacity-80 transition-opacity cursor-pointer">
          <img
            alt="User Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4i7RlbQ4l304ud1zxmMU7fqKzh9QV1LSi39NPeIyQ8_bISd9ncovJOraB9kBs3BDUmXSxDXUbd3oc0_yQsLQqKNMVyr8Vf4QrUVXEPXy8HkaD4AuOn_-QmExGXamINh6zo5pOZKf5mdDdIWs6rJiNT70EBOgBXj6ohUK0gC_8pQM5Vzq0q7H_EcaKwvRL1VV3v_2kb_J3h3u0JhcJ3jTjtpQobvH0VP45-pMoGRspcknfrc0ZxtYx3PyYw6_9S9jJLzNFOO4gBdRi"
          />
        </div>
      )}
    </header>
  );
};

export default TopAppBar;
