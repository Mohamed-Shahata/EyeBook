import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationsAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const [searchingUser , setSearchingUser] = useState(false);
  const [loadingConversations , setLoadingConversations] = useState(true);
  const [searchText , setSearchText] = useState("");
  const [selectConversation , SetselectConversation] = useRecoilState(selectedConversationsAtom);
  const [conversations , setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();

        if(data.error){
          showToast("Error" , data.error , "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        showToast("Error" , error.message , "error");
      }finally{
        setLoadingConversations(false);
      }
    };
    getConversations();
  },[showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchUser = await res.json();

      if(searchUser.error){
        showToast("Error" , searchUser.error , "error");
        return;
      }
      const messageingYourself = searchUser._id === currentUser._id;
      if(messageingYourself){
        showToast("Error" , "You cannot message yourself" , "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(conversation => conversation.participants[0]._id === searchUser._id)
      if(conversationAlreadyExists){
        SetselectConversation({
          _id: conversationAlreadyExists._id,
          userId: searchUser._id,
          username: searchUser.username,
          userProfilePic: searchUser.profilePic,
          name: searchUser.name
        })
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage:{
          text:"",
          sender:"",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchUser._id,
            username: searchUser.username,
            profilePic: searchUser.profilePic,
            name: searchUser.name
          }
        ]
      }
      setConversations((prevConvs) => [...prevConvs , mockConversation])
    } catch (error) {
      showToast("Error" , error.message , "error");
    }finally{
      setSearchingUser(false);
    }
  }
  return(
    <Box 
      position={"absolute"}
      left={"50%"}
      w={{
        base:"100%",
        md:"80%",
        lg:"880px"
      }}
      p={4}
      transform={"translateX(-50%)"}
    >

      <Flex
        gap={4}
        flexDirection={{
          base:"column",
          md:"row"
        }}
        maxW={{
          sm:"400px",
          md:"full"
        }}
        mx={"auto"}
      >
        <Flex display={selectConversation.openClose ? "none" : "block"}
        flex={35} gap={2} flexDirection={"column"} maxW={{sm: "250px", md:"full"}} mx={"auto"}>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search A Username" onChange={(e) => setSearchText(e.target.value)}/>
              <Button size={"md"} onClick={handleConversationSearch} isLoading={searchingUser}>
                <SearchIcon />
              </Button>
            </Flex>
      </form>

          {loadingConversations && 
            [0 , 1 , 2 , 3 , 4].map((_,i)=> (
              <Flex key={i} gap={4} align={"center"} p={"1"} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={"10"}/>
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"}/>
                  <Skeleton h={"8px"} w={"90%"}/>
                </Flex>
              </Flex>
            ))}

          {!loadingConversations && (
              conversations.map(conversation => (
                <Conversation  key={conversation._id}
                  isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation}
                />
              ))
            )}
        </Flex>

            {!selectConversation._id && (

              <Flex
                flex={70}
                borderRadius={"md"}
                p={2}
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                height={"400px"}
              >
                <GiConversation size={100}/>
                <Text fontSize={20}>Select a conversation to start messaging</Text>
              </Flex>

            )}
        {selectConversation._id && <MessageContainer />}
        
      </Flex>
    </Box>
  );
}

export default ChatPage;