import { FaCircleUser } from "react-icons/fa6";
import { HiHome, HiUser } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";

export default function NavBar() {
  const navList = [
    {
      title: "Trang chủ",
      href: "/",
      icon: <HiHome />,
    },
    {
      title: "Tài liệu",
      href: "/documents",
      icon: <IoDocumentText />,
    },
    {
      title: "Hồ sơ",
      href: "/profile",
      icon: <FaCircleUser />,
    },
  ];

  return (
    <div className="w-full h-16 bg-white shadow-md">
      {/* Nav */}
      <nav>
        <ul className="">
            
        </ul>
      </nav>

      {/* Profile box */}
      <div className=""></div>
    </div>
  );
}
