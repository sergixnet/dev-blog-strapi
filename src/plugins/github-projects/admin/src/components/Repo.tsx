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
import { Pencil, Plus, Trash } from "@strapi/icons";
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
  const [repos, setRepos] = useState<RepoInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [alert, setAlert] = useState<
    { title: string; variant: string; message: string } | undefined
  >(undefined);

  const showAlert = (alert) => {
    setAlert(alert);

    setTimeout(() => {
      setAlert(undefined);
    }, 5000);
  };

  const createProject = async (repo: RepoInterface) => {
    try {
      const response = await axios.post("/github-projects/project", repo);

      if (response && response.data) {
        setRepos(
          repos.map((item: RepoInterface) =>
            item.id !== repo.id
              ? item
              : {
                  ...item,
                  projectId: response.data.id,
                }
          )
        );

        showAlert({
          title: "Project created",
          message: `Succesfully created project ${response.data.title}`,
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);
      showAlert({
        title: "An error ocurred",
        message: "Error creating the project, please retry.",
        variant: "danger",
      });
    }
  };

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

  const loaderStyles = {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  };

  if (loading) return <Loader style={loaderStyles} />;

  const allChecked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allChecked; // some repo selected, but not all

  return (
    <Box padding={8} background="neutral100">
      {alert && (
        <div style={{ position: "absolute", top: 0, left: "14%", zIndex: 10 }}>
          <Alert
            closeLabel="Close alert"
            title={alert.title}
            variant={alert.variant}
          >
            {alert.message}
          </Alert>
        </div>
      )}
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox
                aria-label="Select all entries"
                value={allChecked}
                indeterminate={isIndeterminate}
                onValueChange={(value) =>
                  value
                    ? setSelectedRepos(
                        repos.map((repo: RepoInterface) => repo.id)
                      )
                    : setSelectedRepos([])
                }
              />
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
          {repos.map((repo: RepoInterface) => {
            const { id, name, shortDescription, url, projectId } = repo;

            return (
              <Tr key={id}>
                <Td>
                  <BaseCheckbox
                    aria-label={`Select ${id}`}
                    value={selectedRepos.includes(repo.id)}
                    onValueChange={(value) => {
                      const newSelectedRepos = value
                        ? [...selectedRepos, id]
                        : selectedRepos.filter((item) => item !== id);

                      setSelectedRepos(newSelectedRepos);
                    }}
                  />
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
                  {projectId ? (
                    <Flex>
                      <Link
                        to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}
                      >
                        <IconButton
                          onClick={() => console.log("edit")}
                          label="Edit"
                          noBorder
                          icon={<Pencil />}
                        />
                      </Link>
                      <Box paddingLeft={1}>
                        <IconButton
                          onClick={() => console.log("delete")}
                          label="Delete"
                          noBorder
                          icon={<Trash />}
                        />
                      </Box>
                    </Flex>
                  ) : (
                    <IconButton
                      onClick={() => createProject(repo)}
                      label="Add"
                      noBorder
                      icon={<Plus />}
                    />
                  )}
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
