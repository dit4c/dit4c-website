---
layout: index.html
---

<abbr title="Data Intensive Tools for the Cloud">DIT4C</abbr> _(dit-for-see)_ is a platform for hosting data analysis tools "in the cloud" using containers. Container images provide the tools, and DIT4C provides a secure hosting platform for them.

---

### Host locally, run globally

DIT4C isn't a hosted service. You can run it anywhere you want.

As long as your users have Internet access and a modern browser, they'll be able to get to their tools from wherever they are.

---

### Pick an image, or bring your own

DIT4C has plenty of images to choose from:

 * [Jupyter Python Notebook][dit4c-container-ipython]
 * [RStudio][dit4c-container-rstudio]
 * [Jupyter + R][dit4c-container-jupyter]
 * [OpenRefine][dit4c-container-openrefine]
 * [Apache Zeppelin][dit4c-container-zeppelin]
 * [Slicer][dit4c-container-slicer]
 * [FSL][dit4c-container-fsl]

If they're not an instant fit, that's OK. DIT4C can use any appropriate image from Docker Hub.

#### Want a package installed for all new containers?

Extend one of the existing tool images.

```
# DOCKERFILE 1.0

FROM dit4c/dit4c-container-ipython

ADD apt-get install -y awesome-package-we-forgot

```

#### Need to run your own tool?

Extend one of the base images:

 * [Base][dit4c-container-base]
 * [X11 Desktop][dit4c-container-x11]

---

### Architecture

To improve scalability and security, DIT4C runs all containers on compute nodes separate from the portal.

A portal can have multiple schedulers, each able to start containers on compute nodes. Through the use of routing servers, DIT4C is able to allow compute nodes and schedulers to exist on private networks with no open inbound ports, providing better security for compute and data.

[Read about DIT4C's architecture in more detail](./architecture.html)

---

### Running

Let's [get started](./running.html)...

---

### Release Signing Key

```
include release-signing-key.asc
```
[Download release-signing-key.asc](./release-signing-key.asc)

[dit4c-container-base]: https://hub.docker.com/r/dit4c/dit4c-container-base/
[dit4c-container-gephi]: https://hub.docker.com/r/dit4c/dit4c-container-gephi/
[dit4c-container-ipython]: https://hub.docker.com/r/dit4c/dit4c-container-ipython/
[dit4c-container-jupyter]: https://hub.docker.com/r/dit4c/dit4c-container-jupyter/
[dit4c-container-fsl]: https://hub.docker.com/r/dit4c/dit4c-container-fsl/
[dit4c-container-openrefine]: https://hub.docker.com/r/dit4c/dit4c-container-openrefine/
[dit4c-container-rstudio]: https://hub.docker.com/r/dit4c/dit4c-container-rstudio/
[dit4c-container-slicer]: https://hub.docker.com/r/dit4c/dit4c-container-slicer/
[dit4c-container-x11]: https://hub.docker.com/r/dit4c/dit4c-container-x11/
[dit4c-container-zeppelin]: https://hub.docker.com/r/dit4c/dit4c-container-zeppelin/
