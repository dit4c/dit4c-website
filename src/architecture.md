---
title: "DIT4C architecture"
layout: page.html
permalink: false
---

# DIT4C Architecture

## Basic Components

DIT4C has four core components:
 * Portal
 * Scheduler
 * Routing server (can use [ngrok](https://ngrok.com/) in dev)
 * Compute Node

This is enough to provide access to containerized tools to a user's web browser. Like [Jupyter Hub](https://github.com/jupyterhub/jupyterhub), but able to run more than Jupyter.

![](images/diagrams/high-level-arch-basic.dot.svg)

The portal and routing server are the only components directly accessed by users. The scheduler and compute node can live on a private network without open ports (even a home router using NAT!).

## Optional Components

In addition, DIT4C can be run with a:
 * Image server
 * Storage/file server (experimental)

An _image server_ provides a mechanism for saving resulting container images. This allows a user to checkpoint their work in case of hardware failure, share images with other users, and generally use the system for more long-term work.

A _file server_ provides shared persistent storage between different user instances. A user can copy outputs from one research tool to storage, and then use them from another instance. It appears as a simple file-system mount under `/mnt`.

![](images/diagrams/high-level-arch-extra.dot.svg)

Both services rely on the portal to authenticate access to them. No direct user interaction happens with them, so they don't need to be public to the internet, but they do need to be accessible from all compute nodes and the portal.

## Pod Components

Each container instance runs in a pod with a number of helper containers. This allows a compute node to avoid installing any software that needs maintenance or detailed configuration.

* Listener helper - listeners for traffic sent to a public routing server.
* Auth helper - reverse proxy which authenticates traffic before sending to the user container instance. It acts as an OAuth 2 client against the portal's OAuth 2 server.
* Storage helper - mounts persistent remote storage into the user container instance.
* Upload helper - once the instance has terminated, this helper uploads the saved image to the image server.

![](images/diagrams/pod-components.dot.svg)

## Further Detail

See "[installation guide](./running.html)" for further details on how the components fit together.
