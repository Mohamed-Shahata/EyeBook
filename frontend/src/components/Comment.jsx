import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({reply , lastReply}) => {

  return(
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} name={reply.name}/>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} alignItems={"center"}>
            <Box>
              <Text fontSize={"sm"} fontWeight={"bold"}>{reply.name}</Text>
              <Text fontSize={10} fontWeight={"bold"}>{reply.username}</Text>
            </Box>
            {/* <Image src="/verified.png" w={4} h={4} ml={2} my={1}/> */}
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      
      {!lastReply ? <Divider /> : null}
    </>
  )
};

export default Comment;