import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box , Flex , Text } from "@chakra-ui/layout"
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";


const Post = ({ post , postedBy }) => {
  const [user , setUser] = useState(null);
  const shwoToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts , setPosts] = useRecoilState(postAtom);
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if(data.error){
          shwoToast("Error" , data.error , "error");
          return;
        }
        setUser(data);
      } catch (error) {
        shwoToast("Error" , error , "error");
        setUser(null)
      }
    }
    getUser();
  },[postedBy , shwoToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if(!window.confirm("Are you sure you want to delete this post")) return;
      const res = await fetch(`/api/posts/${post._id}`, {
        method:"DELETE",
      });
      const data = await res.json();

      if(data.error){
        shwoToast("Error" , data.error , "error");
        return;
      }
      shwoToast("Success" , "Post Deleted" , "success");
      setPosts(posts.filter((p) => p._id !== post._id))
    } catch (error) {
      shwoToast("Error" , error , "error");
    }
  }

  if(!user) return null;
  return(
    <Link to={`/${user.username}/post/${post._id}`} >
    <Flex gap={3} mb={4} py={5} >
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Avatar size="md" name={user.name} src={user?.profilePic}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/${user.username}`)
        }}
        
        />
					<Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{post.replies.length === 0 && <Text textAlign={"center"}>😀</Text>}
						{post.replies[0] && (
							<Avatar
								size='xs'
								name={post.replies[0].name}
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
                right={"12px"}
								padding={"2px"}
							/>
						)}

          {post.replies[1] && (
            <Avatar 
              size="xs"
              name={post.replies[1].name}
              src={post.replies[1].userProfilePic}
              position={"absolute"}
              bottom={"25px"}
              right={"12px"}
              padding={"2px"}
            />
          )}

          {post.replies[2] && (
            <Avatar 
              size="xs"
              name={post.replies[2].name}
              src={post.replies[2].userProfilePic}
              position={"absolute"}
              bottom={"50px"}
              right={"12px"}
              padding={"2px"}
            />
          )}

        </Box>

      </Flex>
      <Flex flex={1} flexDirection={"column"} gap={2} >
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`)
              }}
            >{user?.name}</Text>
            {/* {user.role == "USER" ? "" : <Image src="/verified.png" w={5} h={5} ml={2} my={1}/>} */}
          </Flex>

          <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </Text>
            {currentUser?._id === user._id && (
              <DeleteIcon size={20}  onClick={handleDeletePost}/>
            )}
          </Flex>

        </Flex>
        <Text fontSize={"sm"}>{post.text}</Text>
        {post.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={post.img} w={"full"}/>
            </Box>
        )}
        <Flex gap={3} my={1}>
          <Actions post={post}/>
        </Flex>
      </Flex>
    </Flex>
  </Link>
  )
}

export default Post;