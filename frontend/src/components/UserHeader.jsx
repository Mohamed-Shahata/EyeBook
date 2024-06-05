import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useColorModeValue, useToast } from "@chakra-ui/react";
// import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {Link as RouterLink} from 'react-router-dom';
import useFollowUnfollow from "../hooks/useFollowUnfollow";



const UserHeader = ({user}) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const {handleFollowUnfollow , following , updating} = useFollowUnfollow(user);


  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        description: 'Profile Link Copied',
        duration: 2000,
        isClosable: true
      })
    });
  }
  return(
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Flex alignItems={"center"}>
            <Text fontSize={"3xl"} fontWeight={"bold"}>
              {user.name}
            </Text>
            {/* <Image src="/verified.png" w={5} h={5} ml={2} my={1}/> */}
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"lg"}>{user.username}</Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar 
            name={user.name}
            src={user.profilePic}
            size={
              {
                base:"lg",
                md:"xl"
              }
            }
          />
          )}
          {!user.profilePic && (
            <Avatar 
            name={user.name}
            src=""
            size={
              {
                base:"lg",
                md:"xl"
              }
            }
          />
          )}
        </Box>
      </Flex>
      <Text fontSize={18}>{user.bio}</Text>
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}
              py={5}
              bg={"gray.dark"}
              color={"white"}
              _hover={{
                bg: "white",
                color:"black"
              }}
          >Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (

          <Button 
            size={"md"}
            onClick={handleFollowUnfollow} 
            isLoading={updating}
            bg={following ? "red.600" : "blue.400"}
            color={"white"}
            _hover={{
              bg: "white",
              color:"black"
            }}
            >
            {following ? "Unfollow" : "Follow"}
          </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} Followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Text color={"gray.light"}>{user.following.length} Following</Text>
          {/* <Link color={"gray.light"}>instagram.com</Link> */}
        </Flex>
        <Flex>
          {/* <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box> */}
          <Box className="icon-container">
            <Menu>
              <MenuButton>
              <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList transition={"ease 0.2s"} bg={"gray.dark"} _hover={{
                  bg:"gray.700"
                }}>
                  <MenuItem bg={"transparent"} h={"full"} color={"#eee"} onClick={copyURL}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex 
          flex={1} 
          borderBottom={"2px solid"} 
          borderBottomColor={useColorModeValue("dark","white")} 
          justifyContent={"center"} pb="3"
          cursor={"pointer"}
          
        >
          <Text fontWeight={"bold"}>{currentUser._id === user._id ? "My POSTS" : "POSTS"}</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default UserHeader;