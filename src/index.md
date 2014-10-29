---
template: index.html
---

DIT4C is a platform for hosting data analysis tools "in the cloud" using Docker containers. Docker images provide the tools, and DIT4C provides a secure hosting platform for them.

To improve scalability and security, DIT4C runs all Docker containers on compute nodes separate from the portal. Compute nodes are spun up by their owners and registered with the portal. Compute node owners can provide access tokens for others to use the node to run containers. Owners can stop or remove any container on their node via the portal, but not view their contents.
