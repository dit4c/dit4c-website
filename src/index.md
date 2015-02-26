---
template: index.html
---

<abbr title="Data Intensive Tools for the Cloud">DIT4C</abbr> _(dit-for-see)_ is a platform for hosting data analysis tools "in the cloud" using Docker containers. Docker images provide the tools, and DIT4C provides a secure hosting platform for them.

[Learn more about how DIT4C was used for ResBaz 2015](resbaz.html)

---

### Host locally, run globally

DIT4C isn't a hosted service. You can run it anywhere you want.

As long as your users have Internet access and a modern browser, they'll be able to get to their tools from wherever they are.

---

### Pick an image, or bring your own

DIT4C has plenty of images to choose from:

 * [IPython Notebook][dit4c-container-ipython]
 * [RStudio][dit4c-container-rstudio]
 * [IJulia][dit4c-container-ijulia]
 * [Octave][dit4c-container-octave]

If they're not an instant fit, that's OK. DIT4C can use any appropriate image from Docker Hub.

#### Want a package installed for all new containers?

Extend one of the existing tool images.

```
# DOCKERFILE 1.0

FROM dit4c/dit4c-container-ipython

ADD yum install -y awesome-package-we-forgot

```

#### Need to run your own tool?

Extend one of the base images:

 * [Base][dit4c-container-base]
 * [X11 Desktop][dit4c-container-x11]

---

### Bring Your Own Compute

To improve scalability and security, DIT4C runs all Docker containers on compute nodes separate from the portal.

Compute nodes are spun up by their owners and registered with the portal. Compute node owners can then provide access tokens for others to use the node to run containers. Owners can stop or remove any container on their node via the portal, but not view their contents.

From bare metal to cloud VMs, DIT4C allows compute to be provided in whatever way makes sense for the users. For the security-conscious, DIT4C can even use
SSL for communication between the portal and individual compute nodes, providing end-to-end encryption.


[dit4c-container-base]: https://registry.hub.docker.com/u/dit4c/dit4c-container-base/
[dit4c-container-x11]: https://registry.hub.docker.com/u/dit4c/dit4c-container-x11/
[dit4c-container-ipython]: https://registry.hub.docker.com/u/dit4c/dit4c-container-ipython/
[dit4c-container-ijulia]: https://registry.hub.docker.com/u/dit4c/dit4c-container-ijulia/
[dit4c-container-rstudio]: https://registry.hub.docker.com/u/dit4c/dit4c-container-rstudio/
[dit4c-container-octave]: https://registry.hub.docker.com/u/dit4c/dit4c-container-octave/
