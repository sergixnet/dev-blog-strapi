import React, { useState, useEffect } from "react";
import {
  Alert,
  BaseCheckbox,
  Box,
  Loader,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
} from "@strapi/design-system";
import axios from "../utils/axiosInstance";

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
      <Table colCount={COL_COUNT} rowCount={6}>
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
      </Table>
    </Box>
  );
};

export default Repo;
