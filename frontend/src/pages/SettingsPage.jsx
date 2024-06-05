import { Box, Button, Flex, Text, useColorMode } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { FiLogOut } from "react-icons/fi";
import { RxMoon, RxSun } from "react-icons/rx";

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();
	const {colorMode , toggleColorMode} = useColorMode();

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		try {
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();

			if (data.error) {
				return showToast("Error", data.error, "error");
			}
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<>
			<Flex my={5} justifyContent={"flex-end"} p={4}>
			
			<Box 
				display={"flex"}
				alignItems={"center"}
				cursor={"pointer"}
				onClick={toggleColorMode}
				bg={"blue.500"}
				_hover={{
					bg:"white",
					color:"black"
				}}
				transition={"ease 0.3s"}
				px={3}
				py={0.5}
				borderRadius={"md"}
				color={"white"}
			>
				<Text alignItems={"center"} p={1} mb={"2px"}>Change</Text>
				{colorMode === "dark" ? <RxSun size={24}/> : <RxMoon size={24}/>}
			</Box>
			</Flex>

			<Flex my={5} justifyContent={"flex-end"} p={4}>
			<Box
				display={"flex"}
				alignItems={"center"}
				cursor={"pointer"}
				onClick={logout}
				bg={"red.500"}
				_hover={{
					bg:"white",
					color:"black"
				}}
				transition={"ease 0.3s"}
				px={3}
				py={0.5}
				borderRadius={"md"}
				color={"white"}
          >
						<Text alignItems={"center"} p={1} mb={"2px"}>Logout</Text>
            <FiLogOut size={24} />
          </Box>
			</Flex>


			<Text my={1} fontWeight={"bold"} w={"full"} textAlign={"center"}>
				Freeze Your Account
			</Text>
			<Text my={1} w={"full"} textAlign={"center"}>You can unfreeze your account anytime by logging in.</Text>
			<Button color={"white"} size={"sm"} bg={"red.500"} w={"full"} textAlign={"center"} onClick={freezeAccount}>
				Freeze
			</Button>
		</>
	);
};

export default SettingsPage;