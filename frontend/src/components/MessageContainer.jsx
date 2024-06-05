import { Avatar, Box, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationsAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectConversation = useRecoilValue(selectedConversationsAtom);
  const [loadingMessage , setLoadingMessage] = useState(true);
  const [messages , setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null)
  useEffect(() => {
    socket.on("newMessage" , (message) => {
      if(selectConversation._id === message.conversationId){
        setMessages((prevMessages) => [...prevMessages, message])
      }

      if(!document.hasFocus()){
        const sound = new Audio(messageSound);
        sound.play();
      }
      setConversations((prev) => {
        const updatedConversations = prev.map(conversation => {
          if(conversation._id === message.conversationId){
            return {
              ...conversation,
              lastMessage:{
                text: message.text,
                sender: message.sender,
              }
            }
          }
          return conversation
        })
        return updatedConversations
      })
    })
    return () => socket.off("newMessage")
  },[socket , selectConversation , setConversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser = messages.length && messages[messages.length -1].sender !== currentUser._id;
    if(lastMessageIsFromOtherUser){
      socket.emit("MessagesAsSeen" , {
        conversationId: selectConversation._id,
        userId: selectConversation.userId
      })
    }
		socket.on("messagesSeen", ({ conversationId }) => {
			if (selectConversation._id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});
	}, [socket, currentUser._id, messages, selectConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior : "smooth"})
  } , [messages])

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessage(true)
      setMessages([])
      try {
        if(selectConversation.mock) return;
        const res = await fetch(`/api/messages/${selectConversation.userId}`);
        const data = await res.json();

        if(data.error) {
          showToast("Error" , data.error , "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showToast("Error" , error , "error");
      }finally{
        setLoadingMessage(false)
      }
    }
    getMessages();
  },[showToast , selectConversation.userId , selectConversation.mock])
  return(
    <Flex
      boxShadow={"lg"}
      flex="70"
      bg={useColorModeValue("white","gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectConversation.userProfilePic} size={"sm"} name={selectConversation.name}/>
        <Box >
          <Text display={"flex"} alignItems={"center"}>
            {selectConversation.name} 
            {/* {selectConversation.role === "USER" ? "" : <Image src="/verified.png" w={5} h={5} ml={2} my={1}/>} */}
          </Text>
          <Text display={"flex"} alignItems={"center"} fontSize={10}>
            {selectConversation.username} 
            {/* {selectConversation.role === "USER" ? "" : <Image src="/verified.png" w={5} h={5} ml={2} my={1}/>} */}
          </Text>
        </Box>

      </Flex>
      <Divider />

      <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
      {loadingMessage &&
          [...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}

          {!loadingMessage && (
            messages.map(message => (
              <Flex key={message._id} direction={"column"}
                ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null}
              >
                <Message  message={message} ownMessage={currentUser._id === message.sender} />
              </Flex>
            ))
          )}
      </Flex>

      <MessageInput setMessages={setMessages}/>
    </Flex>
  )
}

export default MessageContainer;