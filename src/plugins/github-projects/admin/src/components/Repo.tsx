import React, { useState, useEffect } from "react";
import {
  Alert,
  BaseCheckbox,
  Box,
  Flex,
  IconButton,
  IconButtonGroup,
  Loader,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
} from "@strapi/design-system";
import { Pencil, Trash } from "@strapi/icons";
import axios from "../utils/axiosInstance";

interface RepoInterface {
  id: number;
  name: string;
  shortDescription: string;
  url: string;
  projectId: number | null;
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
}

const COL_COUNT = 5;

const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const { data } = await axios.get("/github-projects/repos");
        setRepos(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(error).length) {
    console.log(error);

    return (
      <Alert
        closeLabel="Close alert"
        title="Error fetching repoitories"
        variant="danger"
      >
        {error.toString()}
      </Alert>
    );
  }

  if (loading) return <Loader />;

  console.log(repos);

  return (
    <Box padding={8} background="neutral100">
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox aria-label="Select all entries" />
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Description</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Url</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map((repo) => {
            console.log(repo);

            const { id, name, shortDescription, url, projectId } = repo;

            return (
              <Tr key={id}>
                <Td>
                  <BaseCheckbox aria-label={`Select ${id}`} />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {shortDescription && truncate(shortDescription, 50)}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link href={url} isExternal>
                      {url}
                    </Link>
                  </Typography>
                </Td>
                <Td>
                  <Flex>
                    <IconButton
                      onClick={() => console.log("edit")}
                      label="Edit"
                      noBorder
                      icon={<Pencil />}
                    />
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => console.log("delete")}
                        label="Delete"
                        noBorder
                        icon={<Trash />}
                      />
                    </Box>
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Repo;
