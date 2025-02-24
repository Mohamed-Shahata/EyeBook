import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [posts , setPosts] = useRecoilState(postAtom);
  const [loading , setLoading] = useState(true);

  const showToast = useShowToast()
  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true)
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if(data.error){
          showToast("Error" , data.error , "error");
          return;
        }
        setPosts(data)
      } catch (error) {
        showToast("Error" , error.message , "error");
      }finally{
        setLoading(false);
      }
    }
    getFeedPost();

  },[showToast , setPosts])
  return(
    <Flex gap="10px" alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && 
        (
          <Flex alignItems={"center"} justifyContent={"center"} h={"80vh"}>
            <Text fontWeight={700} fontSize={20}>Follow some users to see the feed</Text>
          </Flex>
        )
        }
        {loading && (
          <Flex justify="center">
            <Spinner size="xl"/>
          </Flex>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy}/>
        ))}
      </Box>
      <Box flex={30}
        display={{
          base: "none",
          md: "block"
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  )
}

export default HomePage;