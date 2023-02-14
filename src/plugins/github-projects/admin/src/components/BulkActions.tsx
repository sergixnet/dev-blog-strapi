import React from "react";
import { Box, Flex, Typography, Button } from "@strapi/design-system";

const BulkActions = ({ selectedRepos }) => {
  const resposWithoutProjects = selectedRepos.filter((repo) => !repo.projectId);
  const resposWithProjects = selectedRepos.filter((repo) => repo.projectId);
  const projectsToBeCreated: number = resposWithoutProjects.length;
  const projectsToBeDeleted: number = resposWithProjects.length;

  return (
    <Box paddingBottom={4}>
      <Flex>
        <Typography>
          {`You have ${projectsToBeCreated} projects to generate and ${projectsToBeDeleted} to delete`}
        </Typography>
        {projectsToBeCreated && (
          <Box paddingLeft={2}>
            <Button
              size="S"
              variant="success-light"
              onClick={() => console.log("Bulk create projects")}
            >
              {`Create ${projectsToBeCreated} project(s)`}
            </Button>
          </Box>
        )}
        {projectsToBeDeleted && (
          <Box paddingLeft={2}>
            <Button
              size="S"
              variant="danger-light"
              onClick={() => console.log("Bulk delete projects")}
            >
              {`Delete ${projectsToBeDeleted} project(s)`}
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default BulkActions;
