export default [
  {
    method: "GET",
    path: "/repos", // http://localhost:1337/github-projects/repos
    handler: "getReposController.index",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    },
  },
  {
    method: "POST",
    path: "/project",
    handler: "projectController.create",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    },
  },
  {
    method: "DELETE",
    path: "/project/:id",
    handler: "projectController.delete",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    },
  },
  {
    method: "POST",
    path: "/projects",
    handler: "projectController.createAll",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    },
  },
];
