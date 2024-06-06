import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import AllUsers from "./AllUsers";
import { Button, Container, Flex, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";


const LogicAllUsers = () => {
  const [allUsers , setAllUsers] = useState([]);
	const [searchTrim , setSearchTrim] = useState('')
  const [fillterUser , setFillterUser] = useState([]);
	const [loading, setLoading] = useState(false);




	const showToast = useShowToast();
		useEffect(() => {
			const getUsers = async () => {
				setLoading(true);
				try {
					const res = await fetch("/api/users/allusers");
					const data = await res.json();
			
					if(data.error){
					showToast("Error" , data.error , "error");
					return;
					}
					setAllUsers(data)
          
				} catch (error) {
						showToast("Error" , error , "error");
            setAllUsers([]);
				} finally {
					setLoading(false);
				}
			}
			getUsers();

		}, [showToast])

		useEffect(() => {
			const resalt = allUsers.filter(user => user.name.toLowerCase().startsWith(searchTrim.toLowerCase()));
			setFillterUser(resalt)
		},[searchTrim , allUsers])


	return(
		
    <Container direction={"column"} maxW={{base: "100%", md: "620px"}}>
          <form>
            <Flex alignItems={"center"} gap={2} mb={20} justifyContent={"center"} mt={10}>
              <Input placeholder="Search for a user" maxW={"300px"} h={"42px"}
								value={searchTrim}
								onChange={(e) => setSearchTrim(e.target.value)}
							/>
              <Button size={"md"}>
                <SearchIcon/>
              </Button>
            </Flex>
      </form>
      {fillterUser.map((user) => <AllUsers key={user._id} user={user} loading={loading}/>)}
    </Container>
  )
};

export default LogicAllUsers;