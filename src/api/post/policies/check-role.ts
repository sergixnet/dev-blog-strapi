/**
 * check-role policy
 */

export default (policyContext, config, { strapi }) => {
  const { userRole } = config;

  const isEligible = policyContext.state?.user?.role?.name === userRole;

  if (isEligible) {
    return true;
  }

  return false;
};
