import { Box, Button, Divider, Flex, Image, Input, Text, Spinner } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

const Boycott = () => {
  const [data, setData] = useState([]);
  const [searchTrim, setSearchTrim] = useState('');
  const [filterBoycot, setFilterBoycot] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getBoycot = async () => {
      try {
        const res = await fetch("/api/poycot");
        const result = await res.json();

        if (result.error) {
          showToast("Error", result.error, "error");
          return;
        }

        if (Array.isArray(result)) {
          setData(result);
        } else {
          showToast("Error", "Invalid data format", "error");
        }
      } catch (error) {
        showToast("Error", error.message, "error");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getBoycot();
  }, [showToast]);

  useEffect(() => {
    const result = data.filter(item => item.name.toLowerCase().startsWith(searchTrim.toLowerCase()));
    setFilterBoycot(result);
  }, [searchTrim, data]);

  return (
    <Flex wrap="wrap" justifyContent="center" gap={4}>
      <Box w={"full"} textAlign={"center"}>
        <Text fontSize={50}>BOYCOTT</Text>
      </Box>
      <form>
        <Flex maxW={500} alignItems={"center"} justifyContent={"center"} columnGap={2}>
          <Input
            placeholder="Search For A Boycott"
            h={"42px"}
            value={searchTrim}
            onChange={(e) => setSearchTrim(e.target.value)}
          />
          <Button size={"md"}>
            <SearchIcon />
          </Button>
        </Flex>
      </form>
      <Divider />
      {loading ? (
        <Spinner size="xl" />
      ) : filterBoycot.length !== 0 ? (
        filterBoycot.map((item) => (
          <Box
            key={item._id}
            flexDirection={"column"}
            justifyContent={"space-between"}
            maxW="250px"
            display={"flex"}
            alignItems={"center"}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image src={item.img} alt="boycot" h={"100%"} objectFit={"cover"} />
            <Box p="6">
              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                textAlign="center"
                fontSize={20}
              >
                {item.name.toLowerCase()}
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Text fontSize={40}>No Boycot</Text>
      )}
    </Flex>
  );
};

export default Boycott;
