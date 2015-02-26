---
title: "DIT4C & ResBaz 2015"
template: page.html
permalink: false
---

# DIT4C & [ResBaz 2015][resbaz]

Running training sessions for 200 researchers requires a fair amount of grunt, and a high degree of redundancy to cope with failures.

Fortunately, DIT4C is designed to scale out.

## Resources

 * 5 platform nodes across 5 data-centres, including:
   * 5 routing nodes
   * 3 portal nodes
 * 12 compute nodes across 3 data-centres

![DIT4C Architecture overview](https://github.com/dit4c/dit4c/raw/master/docs/architecture.png)

## Clustering

A five node [etcd][etcd] cluster is capable of tolerating two lost nodes before it ceases to function. Prior to deploying DIT4C, a cluster of CoreOS VMs was set up across five [NeCTAR Research Cloud][nectar-rc] data-centres with &le;50ms ping times between them. [Flannel][flannel] was deployed to provide a private shared network between the nodes.

<figure>
<img src="https://maps.googleapis.com/maps/api/staticmap?size=400x350&format=png32&zoom=5&center=-37.814107,144.96327999999994&markers=-37.814107,144.96327999999994&markers=-34.92862119999999,138.5999594&markers=-35.2819998,149.12868430000003&markers=-42.8819032,147.32381480000004&markers=-33.8674869,151.20699020000006" class="img-rounded"/>
<figcaption>Data-centre locations</figcaption>
</figure>

All five nodes were then deployed with routing containers, and three of the nodes with portal containers. A [cluster manager][cm] was used to monitor the portal containers and setup continuous replication between the three CouchDB instances.

Round-robin DNS was used to spread requests between the five compute nodes. The [dynamic reverse proxies][nginx-etcd-vhosts] spread requests between the three portal nodes and to the correct compute nodes for containers.

## High Availability

For domains with multiple A records, modern web browsers can try another server if they fail to get a response. This allows nodes in the cluster to reboot with minimal disruption to users.

Monitoring of the _"highcommand"_ portal servers is necessary to ensure Hipache doesn't continually try to contact dead servers.

For compute nodes, producing a HA solution was deamed too problematic, as multi-datacentre shared filesystems are not trivial deployments. Splitting compute nodes between multiple data-centres limits the damage from an outage instead.


[cm]: https://github.com/dit4c/dit4c-cluster-manager
[coreos]: https://coreos.com/
[etcd]: https://github.com/coreos/etcd
[flannel]: https://github.com/coreos/flannel
[nginx-etcd-vhosts]: https://github.com/dit4c/nginx-etcd-vhosts
[nectar-rc]: https://nectar.org.au/
[resbaz]: http://melbourne.resbaz.edu.au/ResBaz2015
