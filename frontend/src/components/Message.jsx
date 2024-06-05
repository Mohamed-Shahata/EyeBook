import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { selectedConversationsAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
	const selectedConversation = useRecoilValue(selectedConversationsAtom);
	const user = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);
	const minutes = new Date(message.createdAt).getUTCMinutes()
	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"}>
					{message.text && (
						<Flex bg={"green.900"} maxW={"350px"} px={3} borderRadius={"md"} direction={"column"}>
							<Text color={"white"}>{message.text}</Text>
							<Box
								ml={1}
								color={message.seen ? "blue.400" : "white"}
								fontWeight={"bold"}
								display={"flex"}
								alignItems={"center"}
								alignSelf={"flex-end"}
								>
									<Text  fontWeight={"100"} fontSize={12} color={"white"} marginInline={1}>{minutes} m</Text>
									<BsCheck2All size={16}/>
							</Box>
						</Flex>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}
					<Avatar src={user.profilePic} w={"35px"} h="35px" name={user.name}/>
				</Flex>
			) : (
				<Flex gap={2}>
					<Avatar src={selectedConversation.userProfilePic} w={"35px"} h="35px" name={selectedConversation.name} />

					{message.text && (
									<Box 
										maxW={"350px"} 
										bg={"blue.800"} 
										px={4} 
										borderRadius={"md"} 
										ml={1}
										color={message.seen ? "blue.400" : "white"}
									>
										{message.text}
										<Text  fontWeight={"100"} fontSize={12} color={"white"} marginInline={1}>{minutes} m</Text>
									</Box>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default Message;