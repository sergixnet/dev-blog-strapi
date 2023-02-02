export default [
  {
    method: "GET",
    path: "/repos", //
    handler: "getReposController.index", // http://localhost:1337/github-projects/repos
    config: {
      policies: [],
      auth: false, // TODO: change this to authorize only for admin panel users
    },
  },
];
