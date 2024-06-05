import { Avatar, AvatarBadge, Box, Flex, Stack, Text, WrapItem, useColorMode } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationsAtom } from "../atoms/messagesAtom";


const Conversation = ({conversation , isOnline}) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectConversation , SetSelectConversation] = useRecoilState(selectedConversationsAtom);
  const colorMode = useColorMode();
  return(
    <Flex
      my={2}
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor:"pointer",
				bg: "gray.dark",
				color: "white",
      }}
      onClick={() => SetSelectConversation({
        _id: conversation._id,
        userId: user._id,
        userProfilePic: user.profilePic,
        username: user.username,
        name: user.name,
        mock: conversation.mock,
      })
    }
      bg={selectConversation._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.dark") : ""}
      color={selectConversation._id === conversation._id ? (colorMode === "light" ? "gray.400" : "white") : ""}
      borderRadius={"md"}
    >
      
      <WrapItem>
        <Avatar size={{
          base:"xs",
          sm:"sm",
          md:"md"
          }} src={user.profilePic}
          name={user.name}>
          {isOnline ? <AvatarBadge boxSize="1em" bg="green.500"/> : ""}
        </Avatar>
      </WrapItem>

			<Stack direction={"column"} fontSize={"sm"}>
				<Text fontWeight='700' display={"flex"} alignItems={"center"}>
					{user.name} 
          {/* <Image src='/verified.png' w={4} h={4} ml={1} /> */}
				</Text>
				<Box fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
        {lastMessage.text.length > 18
						? lastMessage.text.substring(0, 18) + "..."
						: lastMessage.text || <BsFillImageFill size={16} />}
					{currentUser._id === lastMessage.sender ? (
						<Box color={lastMessage.seen ? "blue.400" : ""}>
							<BsCheck2All size={16} />
						</Box>
					) : (
						""
					)}

				</Box>
			</Stack>
		</Flex>
  )
}

export default Conversation;