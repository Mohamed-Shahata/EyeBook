import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePrevlewImg';
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from 'react-router-dom';

export default function UpdateProfilePage() {
  const [user , setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [inputs , setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",

  });
  const fileref = useRef(null);
  const [updateing , setUpdateing] = useState(false)
  

  const showToast = useShowToast();

  const { handleImageChange , imgUrl} = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(updateing) return;
    setUpdateing(true);

    try {
      const res = await fetch(`/api/users/update/${user._id}`,{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json(); // updated user object
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

      setUser(data);
      showToast("Success" , "Profile update successfully" , "success");
      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast("Error" , error.message , "error");
    }finally{
      setUpdateing(false)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Flex
        align={'center'}
        justify={'center'}
        my={6}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar boxShadow={"md"} size="xl" src={imgUrl || user.profilePic}/>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileref.current.click()}>Change Avatar</Button>
                <Input type='file' hidden ref={fileref} onChange={handleImageChange}/>
              </Center>
            </Stack>
          </FormControl>

          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              value={inputs.name}
              onChange={(e) => setInputs({...inputs, name: e.target.value})}
              placeholder="mohamed"
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>

          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              value={inputs.username}
              onChange={(e) => setInputs({...inputs, username: e.target.value})}
              placeholder="User name"
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              value={inputs.email}
              onChange={(e) => setInputs({...inputs, email: e.target.value})}
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />

          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              value={inputs.bio}
              onChange={(e) => setInputs({...inputs, bio: e.target.value})}
              placeholder="Your Bio"
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              value={inputs.password}
              onChange={(e) => setInputs({...inputs, password: e.target.value})}
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}
            onClick={() => navigate(`/${user.username}`)}
          >
            Cancel
          </Button>
            <Button
              bg={'green.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }}
              type='submit'
              isLoading={updateing}
              >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}