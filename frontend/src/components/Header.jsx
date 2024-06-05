import { Flex, Link } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md"
import { FaUserFriends } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";



const Header = () => {

  const user = useRecoilValue(userAtom);

  return(
    <>
      <Flex justifyContent={"space-between"} mt={6} mb="12">
        {user && (
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
        )}
        {user && (
          <>
            <Link as={RouterLink} to={`/allusers`}>
              <FaUserFriends size={20} />
            </Link>
            <Link as={RouterLink} to={`/${user.username}`}>
              <RxAvatar size={24} />
            </Link>
            <Link as={RouterLink} to={`/chat`}>
              <BsFillChatQuoteFill size={20} />
            </Link>
            <Link as={RouterLink} to={`/boycott`}>
              <FiLayers size={20} />
            </Link>
            {/* <Link as={RouterLink} to={`/createboycott`}>
              <FiLayers size={20} />
            </Link> */}
            <Link as={RouterLink} to={`/settings`}>
              <MdOutlineSettings size={20} />
            </Link>
            </>
        )}
      </Flex>
      
    </>
  )
};

export default Header;