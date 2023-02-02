import React from "react";
import {
  BaseCheckbox,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
} from "@strapi/design-system";

const COL_COUNT = 5;

const Repo = () => {
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
