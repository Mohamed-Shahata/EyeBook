import { Avatar, Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const AllUsers = ({ user }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const currentUser = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual fetch logic
        const res = await fetch("/api/users");
        const result = await res.json();

        if (result.error) {
          // Handle error
          return;
        }

        if (Array.isArray(result)) {
          setUsers(result);
        } else {
          // Handle invalid data format
        }
      } catch (error) {
        // Handle fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <>
      {users.map((user) => (
        currentUser._id !== user._id && !following ? (
          <Flex gap={2} justifyContent={"space-between"} alignItems={"center"} mb={5} key={user._id}>
            <Flex gap={2} as={Link} to={`/${user.username}`}>
              <Avatar src={user?.profilePic} size={"lg"} name={user.name} />
              <Box mt={3} mx={1}>
                <Flex alignItems={"center"}>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    {user?.name}
                  </Text>
                  {/* <Image src="/verified.png" w={4} h={4} ml={1}/> */}
                </Flex>
                <Text color={"gray.light"} fontSize={"sm"}>
                  {user?.username}
                </Text>
              </Box>
            </Flex>
            <Button
              ml={1}
              size={"md"}
              color={following ? "black" : "white"}
              bg={following ? "white" : "blue.400"}
              onClick={handleFollowUnfollow}
              isLoading={updating}
              _hover={{
                color: following ? "black" : "white",
                opacity: ".8",
              }}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          </Flex>
        ) : null
      ))}
    </>
  );
};

export default AllUsers;
