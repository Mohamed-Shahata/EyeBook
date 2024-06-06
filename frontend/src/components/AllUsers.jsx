import { Avatar, Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useState } from "react";

const AllUsers = ({user}) => {
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
	const currentUser = useRecoilValue(userAtom);
	const [loading , setLoading] = useState(true)

	return (
		<>
	{ currentUser._id !== user._id && !following  ? (


			<Flex gap={2} justifyContent={"space-between"} alignItems={"center"} mb={5}>
				{loading && (
          <Flex justify="center">
            <Spinner size="xl"/>
          </Flex>
        )}{setLoading(false)}
				<Flex gap={2} as={Link} to={`/${user.username}`}>
					<Avatar src={user?.profilePic} size={"lg"} name={user.name}/>
					<Box mt={3} mx={1} >
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

		) : null}

	</>
	);
};

export default AllUsers;