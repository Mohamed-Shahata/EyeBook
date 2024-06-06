import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
	

	return (
		<Flex gap={2} justifyContent={"space-between"} alignItems={"center"} mb={2}>

		{user.isFrozen ? null : (
			<>
										<Flex gap={2} as={Link} to={`${user.username}`}>
						<Avatar src={user.profilePic} name={user.name}/>
						<Box>
							<Flex minW={32}>
								<Text fontSize={"sm"} fontWeight={"bold"}>
								{user.name}
								</Text>
								{/* {user.role == "USER" ? "" : <Image src="/verified.png" w={5} h={5} ml={2} my={1}/>} */}
							</Flex>
							<Text color={"gray.light"} fontSize={"sm"}>
								{user.username}
							</Text>
						</Box>
					</Flex>
					<Button
						ml={1}
						size={"sm"}
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
			</>
		)}
		</Flex>
	);
};

export default SuggestedUser;