import { Box, Button, Divider, Flex, Image, Input, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";

const Boycott = () => {
  const [data, setData] = useState([]);
  const [searchTrim, setSearchTrim] = useState('');
  const [filterBoycot, setFilterBoycot] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const showToast = useShowToast();

  const fetchBoycot = async (page) => {
    try {
      setLoadingMore(true);
      const res = await fetch(`/api/poycot?page=${page}&limit=10`);
      const result = await res.json();

      if (result.error) {
        showToast("Error", result.error, "error");
        return;
      }

      if (Array.isArray(result.boycotItems)) {
        setData((prevData) => [...prevData, ...result.boycotItems]);
        setHasMore(page < result.totalPages);
      } else {
        showToast("Error", "Invalid data format", "error");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBoycot(page);
  }, [page]);

  useEffect(() => {
    const result = data.filter(item => item.name.toLowerCase().startsWith(searchTrim.toLowerCase()));
    setFilterBoycot(result);
  }, [searchTrim, data]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore) {
        return;
      }
      if (hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore]);

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
      {loadingMore && <Spinner size="md" />}
    </Flex>
  );
};

export default Boycott;
