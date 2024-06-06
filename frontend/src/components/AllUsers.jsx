import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const AllUsers = ({user}) => {
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
	const currentUser = useRecoilValue(userAtom);

	return (
		<>
	{currentUser._id !== user._id && !following && !user.isFrozen  ? (


			<Flex gap={2} justifyContent={"space-between"} alignItems={"center"} mb={5}>
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